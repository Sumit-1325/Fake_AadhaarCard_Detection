import os
from pathlib import Path

class Config:
    # Base directory
    BASE_DIR = Path(__file__).parent.parent
    
    # Upload settings
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff'}
    
    # Model settings
    MODEL_PATH = os.path.join(BASE_DIR, 'saved_models', 'aadhaar_detector.pkl')
    THRESHOLD = 0.5
    
    # Training data paths
    REAL_IMAGES_FOLDER = os.path.join(BASE_DIR, 'data', 'real')
    FAKE_IMAGES_FOLDER = os.path.join(BASE_DIR, 'data', 'fake')