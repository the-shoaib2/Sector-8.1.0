from flask import Flask, render_template, request, jsonify, session, copy_current_request_context
import os
import json
import base64
import io
import time
import threading
import uuid
from datetime import datetime
from PIL import Image
import numpy as np
from functools import wraps
from src.models.mnist_classifier import MNISTClassifier, train_and_save_model
from torchvision import datasets, transforms
import logging

# Global variables
training_in_progress = False
training_status = {
    'status': 'idle',
    'progress': 0,
    'message': '',
    'start_time': None,
    'elapsed_time': 0,
    'metrics': {}
}

def async_route(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        ctx = copy_current_request_context(f)
        t = threading.Thread(target=ctx, args=args, kwargs=kwargs)
        t.daemon = True
        t.start()
        return t
    return wrapper

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Required for session

# Initialize the MNIST model
mnist_model = None

def get_model_info(model):
    """Get model information and statistics"""
    if not model or not model.is_trained:
        return {
            'status': 'not_trained',
            'accuracy': 0.0,
            'parameters': 0,
            'device': str(model.device) if model else 'cpu'
        }
    
    # Count trainable parameters
    total_params = sum(p.numel() for p in model.model.parameters() if p.requires_grad)
    
    return {
        'status': 'trained',
        'accuracy': getattr(model, 'best_accuracy', 0.0),
        'parameters': f"{total_params:,}",
        'device': str(model.device)
    }

def load_model():
    """Load the MNIST model, train if not found"""
    global mnist_model
    
    model_path = "models/mnist_classifier.pth"
    best_model_path = "models/mnist_classifier_best.pth"
    
    # Try to load the best model first
    if os.path.exists(best_model_path):
        try:
            mnist_model = MNISTClassifier.load_model("models/mnist_classifier_best")
            print("Loaded best MNIST classifier model.")
            print(f"Model info: {get_model_info(mnist_model)}")
            return
        except Exception as e:
            print(f"Error loading best MNIST model: {e}")
    
    # Fall back to regular model if best model not available
    if os.path.exists(model_path):
        try:
            mnist_model = MNISTClassifier.load_model("models/mnist_classifier")
            print("Loaded pre-trained MNIST classifier model.")
            print(f"Model info: {get_model_info(mnist_model)}")
            return
        except Exception as e:
            print(f"Error loading MNIST model: {e}")
    
    # If no model exists, initialize a new one
    print("No pre-trained MNIST model found. Initializing a new model...")
    mnist_model = MNISTClassifier()
    print(f"New model initialized on {mnist_model.device}")

def update_training_status(status, progress=0, message='', metrics=None):
    """Update the training status"""
    global training_status
    training_status['status'] = status
    training_status['progress'] = progress
    training_status['message'] = message
    training_status['elapsed_time'] = time.time() - training_status.get('start_time', time.time())
    
    if metrics:
        training_status['metrics'].update(metrics)
    
    # Print status for debugging
    print(f"[Training {status.upper()}] {progress}% - {message}")
    if metrics:
        print(f"Metrics: {metrics}")

def train_mnist_model(epochs=30, learning_rate=0.001):
    """Train the MNIST classifier model"""
    global mnist_model, training_in_progress, training_status
    
    if training_in_progress:
        return {'error': 'Training already in progress'}
    
    training_in_progress = True
    training_status = {
        'status': 'starting',
        'progress': 0,
        'message': 'Initializing training...',
        'start_time': time.time(),
        'elapsed_time': 0,
        'metrics': {}
    }
    
    try:
        # Initialize model if not already done
        if mnist_model is None:
            mnist_model = MNISTClassifier()
        
        # Update status
        update_training_status('training', 5, 'Loading and preparing data...')
        
        # Train the model
        def train_job():
            try:
                # Train with progress updates
                def progress_callback(epoch, total_epochs, metrics):
                    progress = int(100 * (epoch + 1) / total_epochs)
                    update_training_status(
                        'training',
                        progress,
                        f'Epoch {epoch + 1}/{total_epochs}',
                        metrics
                    )
                
                # Start training
                history = mnist_model.train(
                    epochs=epochs,
                    learning_rate=learning_rate,
                    progress_callback=progress_callback
                )
                
                # Save the trained model
                mnist_model.save_model("models/mnist_classifier")
                
                # Update final status
                test_accuracy = history.get('test_acc', 0.0)
                update_training_status(
                    'completed',
                    100,
                    f'Training completed! Test accuracy: {test_accuracy:.2f}%',
                    {'test_accuracy': test_accuracy}
                )
                
            except Exception as e:
                update_training_status('failed', 0, f'Training failed: {str(e)}')
                raise
            finally:
                global training_in_progress
                training_in_progress = False
        
        # Start training in a separate thread
        thread = threading.Thread(target=train_job)
        thread.daemon = True
        thread.start()
        
        return {'status': 'started', 'message': 'Training started in background'}
        
    except Exception as e:
        training_in_progress = False
        update_training_status('failed', 0, f'Error starting training: {str(e)}')
        return {'error': str(e)}

# Load the model when the app starts
load_model()

@app.route('/model-status')
def get_model_status():
    """Get the status of the MNIST model and training progress"""
    global mnist_model, training_status
    
    response = {
        'model': get_model_info(mnist_model) if mnist_model else None,
        'training': dict(training_status)
    }
    
    # Format elapsed time
    if response['training'].get('elapsed_time'):
        elapsed = int(response['training']['elapsed_time'])
        response['training']['elapsed_time_str'] = f"{elapsed // 60}m {elapsed % 60}s"
    
    return jsonify(response)

@app.route('/predict-digit', methods=['POST'])
def predict_digit():
    """Endpoint to predict a digit from an uploaded image"""
    global mnist_model
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Get the image file from the request
        image_file = request.files['image']
        
        # Validate file
        if image_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Check file size (max 5MB)
        if image_file.content_length > 5 * 1024 * 1024:
            return jsonify({'error': 'File too large (max 5MB)'}), 400
        
        try:
            # Open and preprocess the image
            image = Image.open(image_file.stream)
            
            # Convert to grayscale if needed
            if image.mode != 'L':
                image = image.convert('L')
            
            # Make prediction
            start_time = time.time()
            prediction = mnist_model.predict_image(image)
            inference_time = (time.time() - start_time) * 1000  # in ms
            
            # Get top 3 predictions with their probabilities
            probs = prediction['probabilities']
            top3 = sorted([(i, p) for i, p in enumerate(probs)], 
                         key=lambda x: x[1], reverse=True)[:3]
            
            return jsonify({
                'digit': int(prediction['digit']),
                'confidence': float(max(probs)),
                'inference_time_ms': f"{inference_time:.2f}",
                'top_predictions': [
                    {'digit': int(d), 'probability': float(p)} 
                    for d, p in top3
                ],
                'all_probabilities': [float(p) for p in probs]
            })
            
        except IOError:
            return jsonify({'error': 'Invalid image file'}), 400
            
    except Exception as e:
        app.logger.error(f"Error in predict_digit: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/random-test-image')
def get_random_test_image():
    """Get a random test image from the MNIST test set"""
    global mnist_model
    
    try:
        # Load MNIST test dataset
        test_dataset = datasets.MNIST(
            './data', 
            train=False, 
            transform=transforms.Compose([
                transforms.ToTensor(),
                transforms.Normalize((0.1307,), (0.3081,))
            ])
        )
        
        # Get a random test sample
        idx = np.random.randint(0, len(test_dataset))
        image, label = test_dataset[idx]
        
        # Convert tensor to PIL Image
        image = transforms.functional.to_pil_image(image)
        
        # Save image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Convert to base64 for sending in JSON
        img_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
        
        return jsonify({
            'image': img_base64,
            'label': int(label)
        })
    except Exception as e:
        print(f"Error in get_random_test_image: {str(e)}")
        return jsonify({'error': f'Error getting test image: {str(e)}'}), 500

@app.route('/')
def home():
    return render_template('mnist.html')

@app.route('/train-mnist', methods=['POST'])
@async_route
def train_mnist_endpoint():
    """Endpoint to retrain the MNIST model"""
    try:
        data = request.get_json() or {}
        epochs = min(int(data.get('epochs', 30)), 100)  # Cap at 100 epochs
        learning_rate = float(data.get('learning_rate', 0.001))
        
        print(f"Starting MNIST training for {epochs} epochs with learning rate {learning_rate}")
        
        # Start training in background
        result = train_mnist_model(epochs=epochs, learning_rate=learning_rate)
        
        if 'error' in result:
            return jsonify({'error': result['error']}), 400
            
        return jsonify({
            'status': 'training_started',
            'message': 'Training started in background',
            'epochs': epochs,
            'learning_rate': learning_rate
        })
        
    except Exception as e:
        app.logger.error(f"Error in train_mnist_endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error starting training: {str(e)}'}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Set up logging
    log_file = os.path.join('logs', f'mnist_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log')
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    
    # Load the model when starting the app
    try:
        load_model()
    except Exception as e:
        print(f"Error loading model: {e}")
    
    # Run the app
    print("\n=== MNIST Classifier ===")
    print("Starting server...")
    print(f"Model status: {get_model_info(mnist_model) if mnist_model else 'No model loaded'}")
    print(f"Server running at http://127.0.0.1:5000")
    print("Press Ctrl+C to stop\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
