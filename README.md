# MNIST Digit Classifier

A deep learning model for handwritten digit recognition using PyTorch, with a Flask web interface for real-time predictions.

![MNIST Classifier Demo](https://img.shields.io/badge/PyTorch-1.9.0-EE4C2C?style=flat&logo=pytorch)
![Flask](https://img.shields.io/badge/Flask-2.0.1-000000?style=flat&logo=flask)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)

## Features

- **High Accuracy**: CNN-based model with >99% test accuracy on MNIST dataset
- **Web Interface**: Interactive canvas for drawing digits
- **REST API**: Endpoints for model inference and training
- **Training Dashboard**: Monitor training progress in real-time
- **Model Management**: Save and load trained models

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mnist-classifier.git
   cd mnist-classifier
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate  # Windows
   # OR
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### 1. Train the Model
```bash
python train_model.py
```

### 2. Start the Web Application
```bash
python app.py
```

Open your browser and navigate to: http://127.0.0.1:5000

### 3. Make Predictions
- Draw a digit on the canvas
- Click "Predict" to see the model's prediction
- Click "Clear" to clear the canvas
- Use "Random Test Image" to test with MNIST test samples

## Project Structure

```
.
├── app.py                 # Flask application
├── train_model.py        # Training script
├── requirements.txt      # Python dependencies
├── models/               # Saved models
├── data/                 # MNIST dataset
├── src/                  # Source code
│   └── models/
│       └── mnist_classifier.py  # Model definition
└── templates/            # HTML templates
    ├── index.html
    └── mnist.html
```

## API Endpoints

- `GET /` - Home page
- `POST /predict` - Predict digit from image
  ```json
  {
    "image": "base64_encoded_image"
  }
  ```
- `GET /model-status` - Get model status and metrics
- `POST /retrain` - Retrain the model

## Model Architecture

The model uses a CNN architecture with:
- 2 Convolutional blocks (Conv2D + BatchNorm + ReLU + MaxPool + Dropout)
- 2 Fully connected layers
- Dropout for regularization
- AdamW optimizer with learning rate scheduling

## Training

### Data Augmentation
- Random rotation (±10 degrees)
- Random translation (±10%)
- Random scaling (0.9-1.1x)
- Random erasing

### Hyperparameters
- Batch size: 128
- Learning rate: 0.001
- Epochs: 15 (with early stopping)
- Optimizer: AdamW
- Loss: Cross Entropy

## Troubleshooting

- **Missing Dependencies**: Ensure all packages in `requirements.txt` are installed
- **Port in Use**: If port 5000 is in use, change it in `app.py`
- **Model Not Learning**: Try adjusting the learning rate or training for more epochs
- **Browser Issues**: Clear cache or try a different browser if UI doesn't load properly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
