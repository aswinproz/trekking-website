import os
from PIL import Image

def convert_to_webp(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                if file.lower() == 'logo.png': continue
                filepath = os.path.join(root, file)
                try:
                    with Image.open(filepath) as img:
                        filename_no_ext = os.path.splitext(file)[0]
                        webp_path = os.path.join(root, filename_no_ext + '.webp')
                        img.save(webp_path, 'webp', quality=80)
                        count += 1
                except Exception as e:
                    pass
    print(f"Total images converted: {count}")

def update_html_references(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.css', '.js')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                new_content = content.replace('.jpg', '.webp').replace('.jpeg', '.webp')
                if content != new_content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
    print("References updated.")

if __name__ == "__main__":
    convert_to_webp('trekking-team-nepal/images')
    update_html_references('trekking-team-nepal')
