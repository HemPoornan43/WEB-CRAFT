import urllib.request
import os
import time

files = [
    ("1JnDLNxsnS6LOX4RWUimHBnTEO1Bj3raS", "I_year_Time_Table_SEEE.pdf"),
    ("1vCwzm01rF70s51s8aR2QltpeVVqaW0v4", "II_BME.pdf"),
    ("1kR2BvbUY2GfA834kk58V-qyiLvJq2Tfk", "II_ECE_DS_A.pdf"),
    ("1e4aGqk3URjyMnlAddUTytYxm4ibS-n9L", "II_ECE_DS_B.pdf"),
    ("1XWL7bYPj_lNCmrpq9cZq0hJfB-rWfOPK", "III_BME.pdf"),
    ("1xB69LRja7tliYOGoUytJ2-mYjgy-MIdV", "III_ECE_A.pdf"),
    ("1p5324HhvWx21N8arcTbNgDh62OmfeHE9", "III_ECE_B.pdf"),
    ("1nAtXDTl9UsCHsIrL8N6qqFsXuASs-3LE", "III_ECE_DS.pdf"),
    ("1XjCykSKGuy6F6gPHZqkSTcfebNlBbsD5", "IV_ECE_A.pdf"),
    ("1AAZ7OoaW6hIZqjPBc2J90qW0ITxfBgdJ", "IV_ECE_B.pdf"),
]

os.makedirs("d:/yuva/timetables", exist_ok=True)

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

for fid, fname in files:
    outpath = f"d:/yuva/timetables/{fname}"
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download"
    try:
        urllib.request.urlretrieve(url, outpath)
        size = os.path.getsize(outpath)
        print(f"Downloaded {fname}: {size} bytes")
    except Exception as e:
        print(f"Error {fname}: {e}")
    time.sleep(0.5)
