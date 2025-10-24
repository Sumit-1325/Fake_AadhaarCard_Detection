import os
from typing import List

def create_directory_structure():
    """Create necessary directories for the project"""
    directories = [
        'uploads',
        'saved_models',
        'data/real',
        'data/fake',
        'logs'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    
    print("Directory structure created successfully!")

def print_training_summary(real_count: int, fake_count: int):
    """Print training data summary"""
    total = real_count + fake_count
    print("\n" + "="*60)
    print("TRAINING DATA SUMMARY")
    print("="*60)
    print(f"Total Images: {total}")
    print(f"Real Images: {real_count} ({real_count/total*100:.1f}%)")
    print(f"Fake Images: {fake_count} ({fake_count/total*100:.1f}%)")
    print("="*60 + "\n")