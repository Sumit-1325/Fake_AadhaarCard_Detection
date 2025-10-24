import cv2
import numpy as np
from core.image_analyzer import ImageAnalyzer

class FeatureExtractor:
    """Extracts ML features from images"""
    
    def __init__(self):
        self.image_analyzer = ImageAnalyzer()
    
    def extract_features(self, image_path: str) -> np.ndarray:
        """Extract all ML features from image"""
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        features = []
        
        # ELA features
        ela_img = self.image_analyzer.calculate_ela(image_path)
        features.extend([
            np.mean(ela_img),
            np.std(ela_img),
            np.max(ela_img)
        ])
        
        # Text region features
        text_analysis = self.image_analyzer.analyze_text_regions(gray)
        features.extend([
            text_analysis['mean_area'],
            text_analysis['std_area'],
            text_analysis['num_regions']
        ])
        
        # Edge features
        edges = cv2.Canny(gray, 50, 150)
        features.extend([
            np.mean(edges),
            np.std(edges)
        ])
        
        # Color histogram features
        hist_b = cv2.calcHist([img], [0], None, [256], [0, 256])
        hist_g = cv2.calcHist([img], [1], None, [256], [0, 256])
        hist_r = cv2.calcHist([img], [2], None, [256], [0, 256])
        features.extend([
            np.std(hist_b),
            np.std(hist_g),
            np.std(hist_r)
        ])
        
        # JPEG artifacts
        features.append(self.image_analyzer.detect_jpeg_artifacts(img))
        
        # Image dimensions
        h, w = gray.shape
        features.extend([w, h, w * h])
        
        # Noise level
        noise = self.image_analyzer.estimate_noise(gray)
        features.append(noise)
        
        # Brightness and contrast
        features.extend([
            np.mean(gray),
            np.std(gray)
        ])
        
        return np.array(features)