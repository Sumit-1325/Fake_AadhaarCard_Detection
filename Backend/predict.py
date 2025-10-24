"""
Prediction script for single image or batch prediction
"""
import sys
from services.detector_service import DetectorService
from config.config import Config

def predict_single(image_path: str, model_path: str = None):
    """Predict on a single image"""
    # Initialize detector
    detector = DetectorService()
    
    # Load model - THIS IS WHERE YOU SPECIFY MODEL PATH
    model_path = model_path or Config.MODEL_PATH
    detector.load_model(model_path)
    
    # Predict
    print(f"\nAnalyzing: {image_path}")
    result = detector.predict(image_path)
    
    # Display results
    print("\n" + "="*60)
    print("🔍 AADHAAR CARD VERIFICATION RESULT")
    print("="*60)
    print(f"Prediction: {result['prediction']}")
    print(f"Authenticity Score: {result['authenticity_score']:.2f}%")
    print(f"Threshold: {result['threshold']:.0f}%")
    
    if result['uncertain']:
        print("\n⚠️  WARNING: Score near threshold - Manual review recommended")
    
    print("="*60 + "\n")
    
    return result

def predict_batch(folder_path: str, model_path: str = None):
    """Predict on all images in a folder"""
    # Initialize detector
    detector = DetectorService()
    
    # Load model
    model_path = model_path or Config.MODEL_PATH
    detector.load_model(model_path)
    
    # Batch predict
    report = detector.predict_batch(folder_path)
    
    # Display summary
    print("\n" + "="*80)
    print("📊 BATCH PREDICTION SUMMARY REPORT")
    print("="*80)
    print(f"Total Images: {report['total']}")
    print(f"Real Cards: {report['real_count']} ({report['real_percentage']:.1f}%)")
    print(f"Fake Cards: {report['fake_count']} ({report['fake_percentage']:.1f}%)")
    print(f"Uncertain: {report['uncertain_count']}")
    print(f"Average Score: {report['avg_score']:.2f}%")
    print("="*80)
    
    # List fake cards
    if report['fake_count'] > 0:
        print("\n🚫 FAKE CARDS DETECTED:")
        for r in report['results']:
            if r['prediction'] == 'FAKE':
                print(f"  • {r['image_name']}: {r['authenticity_score']:.2f}%")
    
    print("\n")
    return report

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single prediction: python predict.py <image_path> [model_path]")
        print("  Batch prediction: python predict.py --batch <folder_path> [model_path]")
        sys.exit(1)
    
    if sys.argv[1] == '--batch':
        folder = sys.argv[2]
        model = sys.argv[3] if len(sys.argv) > 3 else None
        predict_batch(folder, model)
    else:
        image = sys.argv[1]
        model = sys.argv[2] if len(sys.argv) > 2 else None
        predict_single(image, model)