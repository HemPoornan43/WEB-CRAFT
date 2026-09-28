import json
import urllib.request
import os
import time

with open("d:/yuva/timetable_metadata.json", "r", encoding="utf-8") as f:
    items = json.load(f)

os.makedirs("d:/yuva/timetables", exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for idx, item in enumerate(items):
    safe_name = item['title'].replace('.pdf', '').replace(' ', '_') + '.jpg'
    out_file = f"d:/yuva/timetables/{safe_name}"
    # Use =w1000 for good readability and fast download
    url = item['thumb'].replace('=w1400', '=w1000')
    print(f"Downloading {idx+1}/{len(items)}: {safe_name}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=25) as resp, open(out_file, 'wb') as out:
            out.write(resp.read())
        size = os.path.getsize(out_file)
        print(f"  Done ({size} bytes)")
    except Exception as e:
        print(f"  Error: {e}")
    time.sleep(0.2)

print("All downloads finished!")
