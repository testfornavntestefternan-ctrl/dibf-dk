from pathlib import Path

import fitz

docs = Path(r"D:\Site\DIBF\site\public\docs")
out = Path(r"D:\Site\DIBF\site\scripts\pdf-brand\preview")
out.mkdir(exist_ok=True)

for name in [
    "DIBSGF2026.pdf",
    "DIBSVedtaegter2026.pdf",
    "DIBSRegnskab2025.pdf",
    "Ref2022.pdf",
    "INDSAMLINGSREGNSKAB.pdf",
]:
    doc = fitz.open(docs / name)
    print(f"{name}: pages={doc.page_count} size={(docs/name).stat().st_size}")
    page = doc[0]
    pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
    dest = out / f"{Path(name).stem}-p1.png"
    pix.save(dest)
    print(" ", dest)
    doc.close()
