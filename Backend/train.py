"""
Training script for Aadhaar Forgery Detector
Run this script to train a new model
"""
from services.detector_service import DetectorService
from core.image_loader import ImageLoader
from config.config import Config
from utils.helpers import create_directory_structure, print_training_summary

def main():
    # Create directory structure
    create_directory_structure()
    
    # Initialize components
    print("Initializing Aadhaar Forgery Detector...")
    detector = DetectorService(threshold=0.6)
    image_loader = ImageLoader()
    
    # Load training images
    print("\nLoading training images...")
    try:
        real_images = image_loader.load_images_from_folder(Config.REAL_IMAGES_FOLDER)
        fake_images = image_loader.load_images_from_folder(Config.FAKE_IMAGES_FOLDER)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("\nPlease ensure you have:")
        print(f"1. Real images in: {Config.REAL_IMAGES_FOLDER}")
        print(f"2. Fake images in: {Config.FAKE_IMAGES_FOLDER}")
        return
    
    # Print summary
    print_training_summary(len(real_images), len(fake_images))
    
    # Train model
    detector.train(real_images, fake_images)
    
    # Save model
    detector.save_model()
    
    print("\n✅ Training completed successfully!")
    print(f"Model saved to: {Config.MODEL_PATH}")

if __name__ == "__main__":
    main()
