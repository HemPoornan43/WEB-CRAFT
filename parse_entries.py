import re
import json

with open("d:/yuva/embedded.html", "r", encoding="utf-8") as f:
    html = f.read()

entries = re.findall(r'<div class="flip-entry" id="entry-([^"]+)".*?<img src="([^"]+)".*?<div class="flip-entry-title">([^<]+)</div>', html)

print(f"Found {len(entries)} entries:")
data = []
for fid, thumb, title in entries:
    print(f"Title: {title}, ID: {fid}")
    # Replace =s190 with =w1600 for crisp readable view
    high_res_thumb = re.sub(r'=s\d+$', '=w1400', thumb)
    data.append({
        "id": fid,
        "title": title,
        "thumb": high_res_thumb
    })

with open("d:/yuva/timetable_metadata.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
print("Saved timetable_metadata.json")
