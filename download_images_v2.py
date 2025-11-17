import os
import re
import subprocess
import pandas as pd
import requests
from urllib.parse import urlparse

# 設定
DISCOGRAPHY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQt6Gfu28w-60QiOb57bhw-pyd9i66nA4leISszI-O8B-tDGdw-MYp6ojlt2FQgGy3vzi9nos0kyZcF/pub?gid=0&single=true&output=csv"
CSV_INPUT_PATH = 'discography.csv'
IMG_DIR = 'next-app/public/img/discography'
CSV_OUTPUT_PATH = 'discography_updated.csv'
MANUAL_CHECK_PATH = 'manual_check_required.txt'

def download_csv():
    """Google SheetからCSVをダウンロードする"""
    print(f"Downloading latest CSV from Google Sheets...")
    try:
        response = requests.get(DISCOGRAPHY_CSV_URL)
        response.raise_for_status()
        # response.textに頼らず、contentを直接UTF-8でデコードして書き込む
        csv_content = response.content.decode('utf-8')
        with open(CSV_INPUT_PATH, 'w', encoding='utf-8') as f:
            f.write(csv_content)
        print(f"Successfully downloaded and saved to {CSV_INPUT_PATH}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading CSV: {e}")
        return False
    except UnicodeDecodeError as e:
        print(f"Error decoding CSV content as UTF-8: {e}")
        return False

def get_safe_filename(title):
    if not isinstance(title, str):
        title = str(title)
    filename = re.sub(r'[^a-zA-Z0-9]', '', title)
    if not filename:
        return str(abs(hash(title))) + '.jpg'
    return filename + '.jpg'

def get_og_image_url(page_url):
    if not isinstance(page_url, str) or not page_url.startswith('http'):
        print(f"  - Invalid or missing page URL: {page_url}")
        return None
    try:
        grep_pattern = '<meta property=\"og:image\" content=\"[^\"]*\"'
        cmd = f"curl -A 'Mozilla/5.0' -s -L \"{page_url}\" | grep -o '{grep_pattern}' | head -n 1"
        result = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.PIPE).strip()
        if result:
            match = re.search(r'content="([^"]*)"', result)
            if match:
                return match.group(1)
        print(f"  - og:image not found on {page_url}")
        return None
    except subprocess.CalledProcessError as e:
        print(f"  - Failed to execute curl/grep for {page_url}. Error: {e.stderr}")
        return None

def download_image(url, save_path):
    try:
        subprocess.run(
            ['curl', '-A', 'Mozilla/5.0', '-L', '-s', '-f', '-o', save_path, url],
            check=True,
            stderr=subprocess.PIPE
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"  - Failed to download image from {url}. Error: {e.stderr.decode('utf-8')}")
        return False

def main():
    if not download_csv():
        print("Aborting due to CSV download failure.")
        return

    try:
        df = pd.read_csv(CSV_INPUT_PATH, encoding='utf-8')
    except FileNotFoundError:
        print(f"Error: Input file '{CSV_INPUT_PATH}' not found.")
        return

    df = df.where(pd.notnull(df), None)
    all_records = df.to_dict('records')

    if not os.path.exists(IMG_DIR):
        os.makedirs(IMG_DIR)
    existing_images = os.listdir(IMG_DIR)

    updated_records_for_csv = []
    manual_check_list = []

    for record in all_records:
        title = record.get('title')
        if not title:
            continue

        image_url = record.get('imageUrl')
        page_url = record.get('url')
        
        # 1. imageUrlに有効なローカルパスが指定されており、かつそのファイルが実際に存在するかチェック
        if image_url and isinstance(image_url, str) and image_url.startswith('/img/discography/'):
            local_filename = os.path.basename(image_url)
            if local_filename in existing_images:
                print(f"Skipping '{title}': Valid local image '{local_filename}' already exists.")
                updated_records_for_csv.append(record.copy())
                continue

        # 2. safe_filenameで生成したファイルが既に存在するかチェック (重複ダウンロード防止)
        safe_filename = get_safe_filename(title)
        if safe_filename in existing_images:
             print(f"Skipping '{title}': Image '{safe_filename}' already exists locally (derived from title).")
             record['imageUrl'] = f'/img/discography/{safe_filename}'
             updated_records_for_csv.append(record.copy())
             continue

        print(f"Processing '{title}'...")
        
        download_url = None
        if image_url and isinstance(image_url, str) and image_url.startswith('http'):
            download_url = image_url
        else:
            download_url = get_og_image_url(page_url)

        if download_url:
            filename = get_safe_filename(title)
            save_path = os.path.join(IMG_DIR, filename)
            
            if download_image(download_url, save_path):
                new_image_path = f'/img/discography/{filename}'
                print(f"  + Downloaded image to {save_path}")
                record['imageUrl'] = new_image_path
            else:
                print(f"  ! Failed to download image for '{title}'. Adding to manual check list.")
                manual_check_list.append(f"{title}: {page_url} (Download failed from: {download_url})")
        else:
            print(f"  ! Could not find image for '{title}'. Adding to manual check list.")
            manual_check_list.append(f"{title}: {page_url} (Image URL not found)")

        updated_records_for_csv.append(record.copy())

    updated_df = pd.DataFrame(updated_records_for_csv)
    updated_df.to_csv(CSV_OUTPUT_PATH, index=False, encoding='utf-8')
    print(f"\nUpdated data saved to {CSV_OUTPUT_PATH}")

    if manual_check_list:
        with open(MANUAL_CHECK_PATH, 'w', encoding='utf-8') as f:
            f.write('\n'.join(manual_check_list))
        print(f"Some records require manual checking. See {MANUAL_CHECK_PATH}")

if __name__ == '__main__':
    try:
        import requests
    except ImportError:
        print("requests not found. Installing...")
        subprocess.run(['pip', 'install', 'requests'], check=True)
    try:
        import pandas
    except ImportError:
        print("Pandas not found. Installing...")
        subprocess.run(['pip', 'install', 'pandas'], check=True)
    
    main()
