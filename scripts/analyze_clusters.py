import json

with open("scripts/duplicate_clusters.json", "r", encoding="utf-8-sig") as f:
    clusters = json.load(f)

with open("scripts/covers_ocr_data.json", "r", encoding="utf-8-sig") as f:
    ocr_data = json.load(f)

ocr_by_name = {item['FileName']: item for item in ocr_data}

print(f"Total visual clusters: {len(clusters)}")
for c in clusters:
    idx = c['ClusterIndex']
    keep = c['Keep']
    dupes_cnt = c['DuplicateCount']
    dupes = c['Duplicates']
    item = ocr_by_name.get(keep, {})
    lines = item.get('Lines', [])
    text = " // ".join([l.strip() for l in lines if l.strip()])
    print(f"Cluster #{idx:02d} (Keep: {keep}, Dupes: {dupes_cnt}):")
    print(f"   Resolution: {c['Resolution']}, Size: {c['Size']}")
    print(f"   OCR Text: {text}")
    if dupes:
        print(f"   Dupes: {dupes}")
    print("-" * 80)
