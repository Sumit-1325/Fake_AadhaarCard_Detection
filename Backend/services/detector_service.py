import os
import numpy as np
from typing import Dict, List
from core.image_loader import ImageLoader
from core.feature_extractor import FeatureExtractor
from models.ml_model import MLModel
from config.config import Config

class DetectorService:
    """Main detector service - handles all detection operations"""
    
    def __init__(self, threshold: float = None):
        self.threshold = threshold or Config.THRESHOLD
        self.image_loader = ImageLoader()
        self.feature_extractor = FeatureExtractor()
        self.ml_model = MLModel()
    
    def train(self, real_images_paths: List[str], fake_images_paths: List[str]):
        """Train the detector on real and fake images"""
        X = []
        y = []
        
        print(f"Training on {len(real_images_paths)} real and "
              f"{len(fake_images_paths)} fake images...")
        
        # Process real images
        print("Processing real images...")
        for img_path in real_images_paths:
            features = self.feature_extractor.extract_features(img_path)
            X.append(features)
            y.append(1)
        
        # Process fake images
        print("Processing fake images...")
        for img_path in fake_images_paths:
            features = self.feature_extractor.extract_features(img_path)
            X.append(features)
            y.append(0)
        
        # Train model
        X = np.array(X)
        y = np.array(y)
        self.ml_model.train(X, y)
        
        print("Training completed successfully!")
    
    def predict(self, image_path: str) -> Dict:
        """Predict if an Aadhaar card is real or fake"""
        if not self.ml_model.is_trained:
            raise Exception("Model not trained. Load a trained model first.")
        
        # Extract features and predict
        features = self.feature_extractor.extract_features(image_path)
        ml_score = self.ml_model.predict_proba(features)
        
        # Convert to percentage
        authenticity_score = ml_score * 100
        
        # Classify
        prediction = "REAL" if ml_score >= self.threshold else "FAKE"
        is_uncertain = abs(ml_score - self.threshold) < 0.1
        
        return {
            'prediction': prediction,
            'authenticity_score': float(authenticity_score),
            'threshold': float(self.threshold * 100),
            'uncertain': bool(is_uncertain)
        }
    
    def predict_batch(self, image_folder: str) -> Dict:
        """Predict on all images in a folder"""
        if not self.ml_model.is_trained:
            raise Exception("Model not trained. Load a trained model first.")
        
        image_paths = self.image_loader.load_images_from_folder(image_folder)
        results = []
        
        print(f"Processing {len(image_paths)} images...")
        
        for img_path in image_paths:
            try:
                result = self.predict(img_path)
                result['image_path'] = img_path
                result['image_name'] = os.path.basename(img_path)
                results.append(result)
            except Exception as e:
                print(f"Error processing {os.path.basename(img_path)}: {e}")
        
        return self._generate_report(results)
    
    def _generate_report(self, results: List[Dict]) -> Dict:
        """Generate summary report from batch predictions"""
        if not results:
            return {
                'total': 0,
                'real_count': 0,
                'fake_count': 0,
                'uncertain_count': 0,
                'avg_score': 0.0,
                'results': []
            }
        
        total = len(results)
        real_count = sum(1 for r in results if r['prediction'] == 'REAL')
        fake_count = sum(1 for r in results if r['prediction'] == 'FAKE')
        uncertain_count = sum(1 for r in results if r['uncertain'])
        avg_score = np.mean([r['authenticity_score'] for r in results])
        
        return {
            'total': total,
            'real_count': real_count,
            'fake_count': fake_count,
            'uncertain_count': uncertain_count,
            'avg_score': float(avg_score),
            'fake_percentage': float(fake_count / total * 100),
            'real_percentage': float(real_count / total * 100),
            'results': results
        }
    
    def save_model(self, filepath: str = None):
        """Save trained model"""
        filepath = filepath or Config.MODEL_PATH
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        self.ml_model.save(filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str = None):
        """Load trained model"""
        filepath = filepath or Config.MODEL_PATH
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        self.ml_model.load(filepath)
        print(f"Model loaded from {filepath}")
    
    @staticmethod
    def allowed_file(filename: str) -> bool:
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS