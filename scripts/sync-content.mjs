import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const sourceRoot = path.resolve(projectRoot, "..")

const mappings = [
  {
    from: path.join(sourceRoot, "Sebia_Atlas_Hemoglobin_Cases_Complete_88.json"),
    to: path.join(projectRoot, "data", "Sebia_Atlas_Hemoglobin_Cases_Complete_88.json"),
  },
  {
    from: path.join(sourceRoot, "BioRad_HPLC_Chromatogram_Cases_Complete_232.json"),
    to: path.join(projectRoot, "data", "BioRad_HPLC_Chromatogram_Cases_Complete_232.json"),
  },
  {
    from: path.join(sourceRoot, "Haemoglobin D Variants.md"),
    to: path.join(projectRoot, "content", "teaching", "Haemoglobin D Variants.md"),
  },
  {
    from: path.join(sourceRoot, "Hb_Abruzzo_Clinical_Teaching_Document.md"),
    to: path.join(projectRoot, "content", "teaching", "Hb_Abruzzo_Clinical_Teaching_Document.md"),
  },
]

for (const mapping of mappings) {
  if (!fs.existsSync(mapping.from)) {
    console.warn(`Skipping missing source: ${mapping.from}`)
    continue
  }

  fs.mkdirSync(path.dirname(mapping.to), { recursive: true })
  fs.copyFileSync(mapping.from, mapping.to)
  console.log(`Synced ${path.basename(mapping.to)}`)
}
