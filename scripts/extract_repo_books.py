import glob, re, json

titles = set()
for sql in glob.glob('supabase/**/*.sql', recursive=True):
    with open(sql, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        # Find books insert statements
        for m in re.finditer(r"INSERT INTO public\.books[^(]+\(([^)]+)\)\s+VALUES\s*\(([^;]+)\);", content, re.DOTALL):
            cols = [c.strip() for c in m.group(1).split(',')]
            val_str = m.group(2)
            # find title index
            if 'title' in cols:
                title_idx = cols.index('title')
                # Extract quoted strings or simple tokens
                parts = re.findall(r"'(?:''|[^'])*'|\bNULL\b|\btrue\b|\bfalse\b|\d+", val_str)
                if len(parts) > title_idx:
                    raw_title = parts[title_idx].strip("'").replace("''", "'")
                    titles.add(raw_title)

# Also check seed-data.ts
for ts in glob.glob('src/**/*.ts', recursive=True):
    with open(ts, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if 'title:' in line and 'en:' in line:
                m = re.search(r"en:\s*'([^']+)'", line)
                if m:
                    titles.add(m.group(1))

print(f"Found {len(titles)} titles in repo:")
for t in sorted(titles):
    print(" - ", t)
