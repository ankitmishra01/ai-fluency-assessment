# AI Fluency Assessment

A prototype AI fluency assessment: two parallel forms, four dimensions, scored out of 800.
Built by Ankit Mishra. Pilot item bank, illustrative scoring bands, not a validated instrument.

## Layout

- `app/` — Next.js App Router application (TypeScript). This is the Vercel root directory.
- `app/src/lib/items.ts` — generated item bank. Do not edit by hand.
- `app/src/lib/scoring.ts` — dimensions, bands and the scoring arithmetic.
- `tools/parse_docx.py` — parses the source `.docx` test documents into `parsed.json`.
- `tools/emit_items.py` — turns `parsed.json` into the typed `items.ts`.

## Regenerating the item bank

```
python3 tools/parse_docx.py "<Test 1 .docx>" "<Test 2 .docx>" parsed.json
python3 tools/emit_items.py parsed.json app/src/lib/items.ts
```

The parser reports any block it could not turn into an item. Two source defects are
handled explicitly: one item whose options are mislabelled (A, C, C, D) is relabelled by
position, and one double-keyed item is excluded by the `EXCLUDE` list in `emit_items.py`.

## Development

```
cd app
npm install
npm run typecheck
npm run build
npm run dev
```

## Data handling

No backend, no database, no accounts, no analytics. Answers live in the browser tab's
session storage and are scored on the device.
