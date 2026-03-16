import os
from datetime import datetime

def generate_sitemap(root_dir, base_url):
    pages = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                rel_path = os.path.relpath(os.path.join(root, file), root_dir)
                url = base_url if rel_path == "index.html" else f"{base_url}/{rel_path.replace(os.sep, '/')}"
                last_mod = datetime.fromtimestamp(os.path.getmtime(os.path.join(root, file))).strftime('%Y-%m-%d')
                priority = "1.0" if rel_path == "index.html" else "0.8"
                pages.append((url, last_mod, priority))
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url, last_mod, priority in pages:
        xml += f'  <url>\n    <loc>{url}</loc>\n    <lastmod>{last_mod}</lastmod>\n    <priority>{priority}</priority>\n  </url>\n'
    xml += '</urlset>'
    with open(os.path.join(root_dir, 'sitemap.xml'), 'w') as f:
        f.write(xml)
    print(f"Sitemap generated with {len(pages)} pages.")

if __name__ == "__main__":
    generate_sitemap('trekking-team-nepal', 'https://trekkingteamnepal.com')
