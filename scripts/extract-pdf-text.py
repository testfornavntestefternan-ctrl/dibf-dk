from pathlib import Path

from pypdf import PdfReader

docs = Path(r"D:\Site\DIBF\site\public\docs")
out = Path(r"D:\Site\DIBF\site\scripts\pdf-extract")
out.mkdir(exist_ok=True)

for p in sorted(docs.glob("*.pdf")):
    r = PdfReader(str(p))
    chunks = [f"# {p.name}\npages={len(r.pages)}\n"]
    for i, page in enumerate(r.pages):
        t = (page.extract_text() or "").replace("\x00", "")
        chunks.append(f"\n\n===== PAGE {i + 1} ({len(t)} chars) =====\n{t}")
    target = out / f"{p.stem}.txt"
    target.write_text("".join(chunks), encoding="utf-8")
    print(f"wrote {target.name} pages={len(r.pages)} chars={sum(len(c) for c in chunks)}")
