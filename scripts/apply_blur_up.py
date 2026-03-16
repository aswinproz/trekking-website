import os
import re

def apply_blur_up(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                pattern = r'(<div class="hero-bg">\s*<img\s+)(src="[^"]+")'
                replacement = r'\1class="blur-up" \2'
                new_content = re.sub(pattern, replacement, content)
                if content != new_content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
    print("Blur-up class applied.")

if __name__ == "__main__":
    apply_blur_up('trekking-team-nepal')
