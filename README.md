# BloodDoctor Haemoglobinopathies UI

Clinician-educator teaching hub for haemoglobin variants and Bio-Rad case review, built with `Next.js`, `shadcn/ui`, and a standardized dashboard-block layout.

## What’s Included

- `Dashboard`: overview metrics, quick-launch cards, and embedded teaching topics
- `Variant Explorer`: searchable Sebia Atlas records with compare support
- `Case Atlas`: searchable Bio-Rad teaching cases with structured filters
- `Detail Views`: variant and case pages with key facts, summaries, and teaching markdown
- `Compare Workspace`: side-by-side review for two variants or two cases

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Runtime Data

The deployed app is self-contained. Runtime files live in:

- `data/Sebia_Atlas_Hemoglobin_Cases_Complete_88.json`
- `data/BioRad_HPLC_Chromatogram_Cases_Complete_232.json`
- `content/teaching/Haemoglobin D Variants.md`
- `content/teaching/Hb_Abruzzo_Clinical_Teaching_Document.md`

If the source material is updated in the parent haemoglobinopathies workspace, resync the app copies with:

```bash
npm run sync:content
```

## Deployment

This app is ready for Vercel deployment from the `web/` directory.

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output: default Next.js output
- No runtime secrets are required for the current read-only version

## Notes

- The app intentionally treats spreadsheets, PDFs, and DOCX files as source assets rather than runtime dependencies.
- Compare mode supports `variant vs variant` and `case vs case` only in v1.
- The UI is optimized for clinician educators and trainees.

