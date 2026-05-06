const PREVIEW_HEADING_RENAMES = new Map([
  ["JOB-SPECIFIC A LA CARTE MODULES", "Job Specific Training Items"],
  ["Job-Specific A La Carte Modules", "Job Specific Training Items"]
]);

installPreviewLabelRenames();

function installPreviewLabelRenames() {
  const preview = document.getElementById("preview");
  if (!preview) {
    return;
  }

  renamePreviewHeadings(preview);

  const observer = new MutationObserver(() => {
    renamePreviewHeadings(preview);
  });

  observer.observe(preview, { childList: true, subtree: true, characterData: true });
}

function renamePreviewHeadings(root) {
  root.querySelectorAll("h1, h2, h3, h4").forEach((heading) => {
    const currentText = heading.textContent.trim();
    const replacement = PREVIEW_HEADING_RENAMES.get(currentText.toUpperCase()) || PREVIEW_HEADING_RENAMES.get(currentText);

    if (replacement && currentText !== replacement) {
      heading.textContent = replacement;
    }
  });
}
