import json
import urllib.request
import os

with open("d:/yuva/timetable_metadata.json", "r", encoding="utf-8") as f:
    items = json.load(f)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for idx, item in enumerate(items):
    safe_name = item['title'].replace('.pdf', '').replace(' ', '_') + '.jpg'
    out_file = f"d:/yuva/timetables/{safe_name}"
    if os.path.exists(out_file) and os.path.getsize(out_file) > 10000:
        print(f"Skipping {safe_name}, already exists ({os.path.getsize(out_file)} bytes)")
        continue
    url = item['thumb'].replace('=w1400', '=w900')
    print(f"Downloading {idx+1}/{len(items)}: {safe_name}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            with open(out_file, 'wb') as out:
                out.write(data)
        print(f"  Success: {len(data)} bytes")
    except Exception as e:
        print(f"  Failed: {e}")

print("Done!")
