from PIL import Image
import os

def create_ios_icons():
    # Define all the required iOS icon sizes
    sizes = {
        # iPhone
        'icon-180.png': 180,    # iPhone home screen (@3x)
        'icon-120.png': 120,    # iPhone home screen (@2x)
        'icon-87.png': 87,      # iPhone Spotlight (@3x)
        'icon-58.png': 58,      # iPhone Spotlight (@2x)
        'icon-40.png': 40,      # iPhone Spotlight (@1x)
        
        # iPad
        'icon-152.png': 152,    # iPad home screen (@2x)
        'icon-76.png': 76,      # iPad home screen (@1x)
        'icon-29.png': 29,      # iPad Spotlight (@1x)
    }
    
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    source_path = os.path.join(script_dir, 'icon-1024.png')
    
    # Check if source file exists
    if not os.path.exists(source_path):
        print("Error: icon-1024.png not found in the same directory as this script!")
        return
    
    try:
        # Open the source image
        with Image.open(source_path) as img:
            print(f"Source image: {img.size[0]}x{img.size[1]} pixels")
            
            # Create each required size
            for filename, size in sizes.items():
                # Resize image using high-quality resampling
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # Save to same directory
                output_path = os.path.join(script_dir, filename)
                resized_img.save(output_path, 'PNG', optimize=True)
                
                print(f"Created: {filename} ({size}x{size})")
            
            print(f"\n✅ Successfully created {len(sizes)} icon sizes!")
            print("All icons saved in the same directory as this script.")
            
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    create_ios_icons()