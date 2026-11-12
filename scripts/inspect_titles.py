import json
from collections import defaultdict

with open("scripts/covers_ocr_data.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

print(f"Total entries: {len(data)}")

# Group by hash first
by_hash = defaultdict(list)
for item in data:
    by_hash[item['Hash']].append(item)

unique_items = [items[0] for items in by_hash.values()]
print(f"Unique files by hash: {len(unique_items)}")

for idx, item in enumerate(unique_items, 1):
    fn = item['FileName']
    w = item.get('Width')
    h = item.get('Height')
    sz = item.get('Size')
    lines = item.get('Lines', [])
    clean_lines = [l.strip() for l in lines if l.strip()]
    summary = " | ".join(clean_lines[:6])
    print(f"[{idx:02d}] {fn} ({w}x{h}, {sz}B): {summary[:120]}")
