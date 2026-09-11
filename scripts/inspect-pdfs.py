from pathlib import Path
from pypdf import PdfReader

docs = Path(r"D:\Site\DIBF\site\public\docs")
for p in sorted(docs.glob("*.pdf")):
    r = PdfReader(str(p))
    print(f"\n===== {p.name} pages={len(r.pages)} encrypted={r.is_encrypted} =====")
    for i, page in enumerate(r.pages[:2]):
        t = page.extract_text() or ""
        print(f"--- page {i + 1} ({len(t)} chars) ---")
        print(t[:1200].replace("\x00", ""))
