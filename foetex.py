import re
import pdfplumber

PDF_PATH = "/mnt/c/Users/emilo/Downloads/Uge_23.pdf"  # or "/mnt/data/Uge_23.pdf"

CATEGORIES = {
    "flour": [r"\bmel\b", r"\bhvedemel\b", r"\bfuldkornsmel\b", r"\bbageblanding\b"],
    "eggs": [r"\bæg\b", r"\bægg\b", r"\bægge\b"],
    "pasta": [r"\bpasta\b", r"\bgnocchi\b", r"\bspaghetti\b", r"\bpenne\b", r"\blasagne\b", r"\bpastasauce\b"],
    "skyr": [r"\bskyr\b"],
    "meat": [r"\bkylling\b", r"\bgris\b", r"\bokse\b", r"\bkød\b", r"\bpølse\b", r"\bmedister\b", r"\bskinke\b"],
}

NOISE = re.compile(
    r"(FFOOTT_|PAGE|side\s+\d+|Gælder|Spar|føtex\.dk|Avisen|%|\b\d{1,2}/\d{1,2}/\d{4}\b)",
    re.IGNORECASE,
)

def extract_lines(pdf_path: str) -> list[str]:
    lines = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            txt = page.extract_text() or ""
            for ln in txt.splitlines():
                ln = re.sub(r"\s+", " ", ln).strip()
                if ln:
                    lines.append(ln)
    return lines

def foodish_lines(lines: list[str]) -> list[str]:
    out = []
    for ln in lines:
        if NOISE.search(ln):
            continue
        if len(ln) < 4:
            continue
        if re.fullmatch(r"[\d\W_]+", ln):  # only numbers/symbols
            continue
        # "food-ish" heuristic: lines near unit/price words
        if re.search(r"\b(g|kg|stk)\b|Pr\.\s*(kg|stk)|Flere varianter|,-", ln, re.IGNORECASE):
            # avoid pure price/unit lines
            if re.match(r"^Pr\.\s*(kg|stk)\b", ln, re.IGNORECASE):
                continue
            out.append(ln)
    return out

def match_categories(lines: list[str], categories=CATEGORIES) -> dict[str, list[str]]:
    hits = {k: [] for k in categories}
    for ln in lines:
        low = ln.lower()
        for cat, pats in categories.items():
            if any(re.search(p, low, re.IGNORECASE) for p in pats):
                hits[cat].append(ln)
    # de-dup while preserving order
    for k in hits:
        seen = set()
        hits[k] = [x for x in hits[k] if not (x in seen or seen.add(x))]
    return hits

if __name__ == "__main__":
    lines = extract_lines(PDF_PATH)
    all_food = foodish_lines(lines)
    hits = match_categories(all_food)

    print(f"All food-ish lines found: {len(all_food)}\n")

    for cat in ["flour", "eggs", "pasta", "skyr", "meat"]:
        items = hits.get(cat, [])
        print(f"== {cat.upper()} ({len(items)}) ==")
        for it in items:
            print("-", it)
        print()

    # If you truly want EVERYTHING it thinks is food items:
    # for it in all_food: print(it)
