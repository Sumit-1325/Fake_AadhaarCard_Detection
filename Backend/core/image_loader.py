import os
import cv2
from typing import List

class ImageLoader:
    """Handles loading images from folders and files"""
    
    VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
    
    @staticmethod
    def load_images_from_folder(folder_path: str) -> List[str]:
        """Load all images from a folder and return their paths"""
        if not os.path.exists(folder_path):
            raise FileNotFoundError(f"Folder not found: {folder_path}")
        
        image_paths = []
        for filename in os.listdir(folder_path):
            if ImageLoader._is_valid_image(filename):
                image_paths.append(os.path.join(folder_path, filename))
        
        return image_paths
    
    @staticmethod
    def load_image(image_path: str):
        """Load a single image"""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        return cv2.imread(image_path)
    
    @staticmethod
    def _is_valid_image(filename: str) -> bool:
        """Check if file has valid image extension"""
        return any(filename.lower().endswith(ext) for ext in ImageLoader.VALID_EXTENSIONS)