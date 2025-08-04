import os
import time
from src.models.mnist_classifier import train_and_save_model

def progress_callback(update):
    """Handle training progress updates"""
    if 'message' in update:
        level = update.get('level', 'info')
        print(f"[{level.upper()}] {update['message']}")
    
    if 'progress' in update:
        progress = update['progress']
        status = update.get('status', 'training')
        metrics = update.get('metrics', {})
        
        if status == 'training' and metrics:
            print(f"\rProgress: {progress}% | "
                  f"Epoch: {metrics.get('epoch', 0)}/{metrics.get('total_epochs', 1)} | "
                  f"Train Loss: {metrics.get('train_loss', 0):.4f} | "
                  f"Val Acc: {metrics.get('val_acc', 0):.2f}% | "
                  f"LR: {metrics.get('lr', 0):.6f}", end='')
        elif status == 'completed':
            print(f"\n\nTraining completed!")
            print(f"Best Validation Accuracy: {update.get('best_val_accuracy', 0):.2f}%")
            print(f"Test Accuracy: {update.get('test_accuracy', 0):.2f}%")
            print(f"Model saved to: {update.get('model_path', '')}")
        elif status == 'error':
            print(f"\n\nError: {update.get('error', 'Unknown error')}")

if __name__ == "__main__":
    print("Starting MNIST Model Training")
    print("=" * 50)
    
    start_time = time.time()
    try:
        train_and_save_model(progress_callback=progress_callback)
        print(f"\nTotal training time: {(time.time() - start_time)/60:.2f} minutes")
    except KeyboardInterrupt:
        print("\nTraining interrupted by user")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        raise
