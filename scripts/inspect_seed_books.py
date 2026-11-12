import re

with open("src/lib/data/seed-data.ts", "r", encoding="utf-8") as f:
    text = f.read()

start = text.find("export const SEED_BOOKS: Book[] = [")
end = text.find("export const SEED_BLOG_POSTS")
books_text = text[start:end]

book_blocks = re.split(r"\n  \{\s*\n\s*id:\s*'", books_text)
print(f"Total blocks split: {len(book_blocks)}")

for idx, b in enumerate(book_blocks[1:], 1):
    id_match = re.search(r"^([^']+)'", b)
    book_id = id_match.group(1) if id_match else "unknown"
    title_m = re.search(r"title:\s*\{\s*en:\s*['\"]([^'\"]+)['\"]", b)
    title = title_m.group(1) if title_m else "unknown"
    cover_m = re.search(r"cover_image_url:\s*['\"]([^'\"]+)['\"]", b)
    cover = cover_m.group(1) if cover_m else "unknown"
    pages_m = re.search(r"pages:\s*(\d+)", b)
    pages = pages_m.group(1) if pages_m else "unknown"
    isbn_m = re.search(r"isbn13:\s*['\"]([^'\"]+)['\"]", b)
    isbn = isbn_m.group(1) if isbn_m else "unknown"
    print(f"[{idx:02d}] ID: {book_id}")
    print(f"     Title: {title}")
    print(f"     Cover: {cover}")
    print(f"     ISBN: {isbn}, Pages: {pages}")
    print("-" * 60)
