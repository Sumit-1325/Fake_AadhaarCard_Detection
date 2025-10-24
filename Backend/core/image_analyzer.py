import cv2
import numpy as np
from PIL import Image
import os

class ImageAnalyzer:
    """Analyzes image properties and detects forgery indicators"""
    
    @staticmethod
    def calculate_ela(image_path: str, quality: int = 90) -> np.ndarray:
        """Calculate Error Level Analysis"""
        img = Image.open(image_path)
        
        # Convert to RGB if needed
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # Save with compression
        temp_path = 'temp_ela.jpg'
        img.save(temp_path, 'JPEG', quality=quality)
        compressed = Image.open(temp_path)
        
        # Calculate difference
        original = np.array(img.convert('RGB'))
        comp = np.array(compressed.convert('RGB'))
        diff = np.abs(original.astype(int) - comp.astype(int))
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return diff
    
    @staticmethod
    def detect_jpeg_artifacts(img: np.ndarray) -> float:
        """Detect JPEG compression artifacts"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        dct = cv2.dct(np.float32(gray))
        high_freq = np.abs(dct[dct.shape[0]//2:, dct.shape[1]//2:])
        return float(np.mean(high_freq))
    
    @staticmethod
    def estimate_noise(gray_img: np.ndarray) -> float:
        """Estimate noise level in image using Laplacian"""
        h, w = gray_img.shape
        kernel = np.array([[1, -2, 1],
                          [-2, 4, -2],
                          [1, -2, 1]])
        
        sigma = np.sum(np.abs(cv2.filter2D(gray_img, -1, kernel)))
        sigma = sigma * np.sqrt(0.5 * np.pi) / (6 * (w-2) * (h-2))
        return float(sigma)
    
    @staticmethod
    def analyze_text_regions(gray_img: np.ndarray) -> dict:
        """Analyze text region properties"""
        _, binary = cv2.threshold(gray_img, 0, 255, 
                                  cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, 
                                       cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            text_areas = [cv2.contourArea(c) for c in contours 
                         if cv2.contourArea(c) > 50]
            return {
                'mean_area': float(np.mean(text_areas)) if text_areas else 0.0,
                'std_area': float(np.std(text_areas)) if text_areas else 0.0,
                'num_regions': len(text_areas)
            }
        
        return {'mean_area': 0.0, 'std_area': 0.0, 'num_regions': 0}