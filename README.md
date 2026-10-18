# AI Fluency Assessment

A prototype adaptive AI fluency assessment for workplace learning and development:
a 200-item bank, a 32-question adaptive path, four dimensions, and a score out of 800. Results include an
evidence-led capability profile and a printable six-week learning plan generated
from the employee's two lowest-scoring dimensions.

Live prototype: <https://ai-fluency-assessment-prototype.vercel.app/>

Built by Ankit Mishra. Pilot item bank, illustrative scoring bands, not a validated instrument.

## Layout

- `app/` — Next.js App Router application (TypeScript). This is the Vercel root directory.
- `app/src/lib/item-bank.ts` — 200-item adaptive workplace question bank.
- `app/src/lib/adaptive.ts` — adaptive routing and difficulty-aware scoring.
- `app/src/lib/scoring.ts` — dimensions, bands, and legacy-form compatibility.
- `tools/parse_docx.py` — parses the source `.docx` test documents into `parsed.json`.
- `tools/emit_items.py` — turns `parsed.json` into the typed `items.ts`.

## Source-form archive

```
python3 tools/parse_docx.py "<Test 1 .docx>" "<Test 2 .docx>" parsed.json
python3 tools/emit_items.py parsed.json app/src/lib/items.ts
```

The original 67-item parallel-form bank remains in `app/src/lib/items.ts` for
backward compatibility with older browser sessions. The parser reports any block it could not turn into an item. Two source defects are
handled explicitly: one item whose options are mislabelled (A, C, C, D) is relabelled by
position, and one double-keyed item is excluded by the `EXCLUDE` list in `emit_items.py`.

## Development

```
cd app
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## Data handling

No backend, no database, no accounts, no analytics. Answers live in the browser tab's
session storage and are scored on the device.
