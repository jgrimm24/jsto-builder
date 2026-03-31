# JSTO Builder

This project is a lightweight Job Safety Training Outline builder aligned to `DAFI 91-202`, paragraph `14.1`.

## What it does

- Includes the mandatory JSTO topics from `14.1.2`
- Lets you add job-specific items from the `14.1.3` list using a dropdown-driven a la carte builder
- Includes an OSHA 2254 crosswalk for dropdown modules when a matching OSHA training standard exists
- Saves progress in the browser
- Lets you download and reload JSTO data as JSON
- Opens a print-friendly layout so you can save the finished JSTO as a PDF

## Run locally

```bash
npm start
```

Then open `http://localhost:4173`.

## Publish with GitHub

Because this is a static site, it works well with GitHub Pages.

1. Create a repository in your GitHub account.
2. Push the contents of this folder to that repository.
3. In GitHub `Settings > Pages`, set the source to `GitHub Actions`.
4. Push to `main` and the included workflow will publish the site automatically.
5. Open the published site, complete the JSTO, and use `Export PDF`.

## PDF output

Use the `Export PDF` button, then choose `Save as PDF` in the browser print dialog.

For best results:

- Use portrait orientation
- Turn off headers and footers if the browser adds them
- Keep background graphics on if you want the styled version

## Notes

- The app includes the required subject areas from `14.1.2` by default.
- The optional catalog is based on the job-specific items in `14.1.3`.
- OSHA 2254 crosswalk text is included for modules with direct or partial OSHA training matches; Air Force and local requirements still control where OSHA does not map cleanly.
- You can tailor each added module with local notes, references, hazards, and procedural requirements.
