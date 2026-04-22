(() => {
  const EXPORT_STORAGE_KEY = "jsto-builder-state-v1";
  const EXPORT_LIBRARY_URL = "https://github.com/jgrimm24/jsto-builder/tree/main/JSTO-Library";
  const EXPORT_LIBRARY_UPLOAD_URL = String(window.JSTO_LIBRARY_UPLOAD_URL || "").trim().replace(/\/$/, "");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExportNaming, { once: true });
  } else {
    initExportNaming();
  }

  function initExportNaming() {
    const form = document.getElementById("jsto-form");
    if (!form) {
      return;
    }

    const exportInput = ensureExportField(form);
    hydrateExportField(exportInput, form);
    bindExportField(exportInput, form);
    overrideSaveActions(exportInput, form);
  }

  function ensureExportField(form) {
    let input = form.querySelector('input[name="exportBasename"]');
    if (input) {
      return input;
    }

    const workCenterInput = form.querySelector('input[name="workCenter"]');
    const workCenterLabel = workCenterInput?.closest("label");
    const formGrid = workCenterLabel?.parentElement;

    const label = document.createElement("label");
    label.innerHTML = [
      "Export File Name",
      '<input id="export-basename" name="exportBasename" type="text" placeholder="e.g. 123d MXS - AGE Shop JSTO">',
      '<span class="muted">Used for JSON downloads and JSTO Library file names. PDF save dialogs usually suggest this title.</span>'
    ].join("");

    if (workCenterLabel && formGrid) {
      workCenterLabel.insertAdjacentElement("afterend", label);
    } else {
      form.prepend(label);
    }

    input = label.querySelector('input[name="exportBasename"]');
    return input;
  }

  function hydrateExportField(exportInput, form) {
    const state = readStoredState();
    const storedName = sanitizeFilenameStem(state?.meta?.exportBasename || "");
    exportInput.value = storedName;
    updateExportPlaceholder(exportInput, form);
  }

  function bindExportField(exportInput, form) {
    exportInput.addEventListener("input", () => {
      syncExportState(exportInput, form);
    });

    ["unit", "workCenter"].forEach((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      if (!field) {
        return;
      }

      field.addEventListener("input", () => {
        updateExportPlaceholder(exportInput, form);
        if (!String(exportInput.value || "").trim()) {
          syncExportState(exportInput, form);
        }
      });
    });
  }

  function overrideSaveActions(exportInput, form) {
    interceptButton("save-browser", async (event) => {
      event.preventDefault();
      syncExportState(exportInput, form);
      downloadStateSnapshot(exportInput, form);
    });

    interceptButton("print-pdf", async (event) => {
      event.preventDefault();
      syncExportState(exportInput, form);
      await printPreviewWithFilename(exportInput, form);
    });

    interceptButton("save-library", async (event, button) => {
      event.preventDefault();
      syncExportState(exportInput, form);
      await saveToLibraryWithFilename(exportInput, form, button);
    });
  }

  function interceptButton(id, handler) {
    const button = document.getElementById(id);
    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      async (event) => {
        event.stopImmediatePropagation();
        await handler(event, button);
      },
      { capture: true }
    );
  }

  function readStoredState() {
    try {
      const raw = window.localStorage.getItem(EXPORT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function writeStoredState(state) {
    try {
      window.localStorage.setItem(EXPORT_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failures and keep export actions working with live form data.
    }
  }

  function syncExportState(exportInput, form) {
    const state = readStoredState();
    state.meta = state.meta || {};

    const currentName = sanitizeFilenameStem(exportInput.value);
    if (currentName) {
      state.meta.exportBasename = currentName;
    } else {
      delete state.meta.exportBasename;
    }

    syncKnownMetaFields(state.meta, form);
    writeStoredState(state);
  }

  function syncKnownMetaFields(meta, form) {
    ["unit", "workCenter", "officeSymbol"].forEach((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      if (field) {
        meta[fieldName] = String(field.value || "");
      }
    });
  }

  function updateExportPlaceholder(exportInput, form) {
    exportInput.placeholder = getDefaultFilenameStem(form);
  }

  function getDefaultFilenameStem(form) {
    const unit = String(form.elements.namedItem("unit")?.value || "").trim();
    const workCenter = String(form.elements.namedItem("workCenter")?.value || "").trim();
    return [unit, workCenter, "JSTO"].filter(Boolean).join(" - ") || "JSTO Outline";
  }

  function getExportFilenameStem(exportInput, form) {
    return sanitizeFilenameStem(exportInput.value) || sanitizeFilenameStem(getDefaultFilenameStem(form)) || "JSTO Outline";
  }

  function sanitizeFilenameStem(value) {
    return String(value || "")
      .trim()
      .replace(/\.(json|pdf)$/i, "")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
      .replace(/\s+/g, " ")
      .replace(/-+/g, "-")
      .replace(/[. ]+$/g, "")
      .trim();
  }

  function downloadStateSnapshot(exportInput, form) {
    const state = readStoredState();
    state.meta = state.meta || {};
    syncKnownMetaFields(state.meta, form);

    const exportName = sanitizeFilenameStem(exportInput.value);
    if (exportName) {
      state.meta.exportBasename = exportName;
    }

    const filename = `${getExportFilenameStem(exportInput, form)}.json`;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function printPreviewWithFilename(exportInput, form) {
    const preview = document.getElementById("preview");
    if (!preview) {
      return;
    }

    const title = getExportFilenameStem(exportInput, form);
    const stylesheetHref = document.querySelector('link[href*="styles.css"]')?.href || "styles.css";
    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1000,height=900");

    if (!printWindow) {
      const originalTitle = document.title;
      document.title = title;
      window.print();
      document.title = originalTitle;
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="${stylesheetHref}">
    <style>
      body {
        background: white;
        padding: 24px;
      }

      .preview {
        max-width: 900px;
        margin: 0 auto;
        box-shadow: none;
        border: 0;
        background: white;
        padding: 0;
      }
    </style>
  </head>
  <body>
    ${preview.outerHTML}
  </body>
</html>`);
    printWindow.document.close();

    await waitForPrintWindow(printWindow);
    printWindow.focus();
    printWindow.print();
    printWindow.addEventListener("afterprint", () => printWindow.close(), { once: true });
  }

  async function waitForPrintWindow(printWindow) {
    await new Promise((resolve) => {
      if (printWindow.document.readyState === "complete") {
        resolve();
        return;
      }

      printWindow.addEventListener("load", () => resolve(), { once: true });
    });

    const images = Array.from(printWindow.document.images);
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            const done = () => {
              img.removeEventListener("load", done);
              img.removeEventListener("error", done);
              resolve();
            };

            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          })
      )
    );
  }

  async function saveToLibraryWithFilename(exportInput, form, button) {
    if (!EXPORT_LIBRARY_UPLOAD_URL) {
      window.alert("The JSTO Library upload service is not configured yet. Add your Render service URL in index.html before using this button.");
      return;
    }

    const preview = document.getElementById("preview");
    if (!preview) {
      return;
    }

    const originalLabel = button?.textContent || "Save to JSTO Library";
    if (button) {
      button.disabled = true;
      button.textContent = "Saving...";
    }

    try {
      const response = await fetch(`${EXPORT_LIBRARY_UPLOAD_URL}/api/save-library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          libraryVersion: 1,
          filename: `${getExportFilenameStem(exportInput, form)}.pdf`,
          unit: String(form.elements.namedItem("unit")?.value || ""),
          workCenter: String(form.elements.namedItem("workCenter")?.value || ""),
          officeSymbol: String(form.elements.namedItem("officeSymbol")?.value || ""),
          previewHtml: preview.innerHTML
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "JSTO Library upload failed.");
      }

      window.alert("JSTO PDF uploaded to the JSTO Library.");
      window.open(result.libraryUrl || EXPORT_LIBRARY_URL, "_blank", "noreferrer");
    } catch (error) {
      const message = error instanceof Error ? error.message : "JSTO Library upload failed.";
      window.alert(`${message} You can still use Save in Browser as a backup.`);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
