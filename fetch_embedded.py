import urllib.request
import re

url = "https://drive.google.com/embeddedfolderview?id=178oRX8akrUp6eqASCOQ5FafWfJi2RM4t#list"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        print(f"Fetched {len(content)} chars")
        with open("d:/yuva/embedded.html", "w", encoding="utf-8") as f:
            f.write(content)
        # Search for file names or links
        items = re.findall(r'href="([^"]+)"[^>]*>([^<]+)</a>', content)
        print("Links found:", len(items))
        for link, text in items[:30]:
            print(f"  {text.strip()} -> {link}")
except Exception as e:
    print("Error:", e)
