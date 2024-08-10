import os
import datetime
from urllib.parse import urljoin
import os
import sys
def generate_sitemap(root_dir, base_url):
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                rel_path = os.path.relpath(path, root_dir)
                url = urljoin(base_url, rel_path.replace('\\', '/'))
                mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(path))
                
                sitemap += '  <url>\n'
                sitemap += f'    <loc>{url}</loc>\n'
                sitemap += f'    <lastmod>{mod_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}</lastmod>\n'
                sitemap += '    <changefreq>monthly</changefreq>\n'
                sitemap += '    <priority>0.70</priority>\n'
                sitemap += '  </url>\n'

    sitemap += '</urlset>'
    return sitemap

# 使用示例
# 获取当前脚本的绝对路径
script_path = os.path.abspath(__file__)

# 获取脚本所在的目录
root_directory = os.path.dirname(script_path)

base_url = 'https://deepwokenbuilder.com/'
sitemap_content = generate_sitemap(root_directory, base_url)

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print("Sitemap has been generated successfully!")