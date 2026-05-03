(() => {
  const LIBRARY_IDENTITY_KEY = "jsto-library-identity-v1";
  const LIBRARY_UPLOAD_URL = String(window.JSTO_LIBRARY_UPLOAD_URL || "").trim().replace(/\/$/, "");

  patchLibraryStateRequests();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLibraryOwnership, { once: true });
  } else {
    initLibraryOwnership();
  }

  function initLibraryOwnership() {
    const form = document.getElementById("jsto-form");
    if (!form) {
      return;
    }

    const uploaderInput = ensureUploaderField(form);
    hydrateUploaderField(uploaderInput);
    bindUploaderField(uploaderInput);
    interceptLibrarySave(uploaderInput);
  }

  function patchLibraryStateRequests() {
    if (!LIBRARY_UPLOAD_URL || typeof window.fetch !== "function") {
      return;
    }

    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const identity = getIdentityFromUrlOrStorage();
      if (!identity) {
        return originalFetch(input, init);
      }

      try {
        const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : String(input?.url || "");
        if (!rawUrl.startsWith(`${LIBRARY_UPLOAD_URL}/api/library-state`)) {
          return originalFetch(input, init);
        }

        const url = new URL(rawUrl);
        if (!url.searchParams.get("identity")) {
          url.searchParams.set("identity", identity);
        }
        return originalFetch(url.toString(), init);
      } catch {
        return originalFetch(input, init);
      }
    };
  }

  function ensureUploaderField(form) {
    let input = form.querySelector('input[name="uploadedBy"]');
    if (input) {
      return input;
    }

    const exportInput = typeof ensureExportField === "function"
      ? ensureExportField(form)
      : form.querySelector('input[name="exportBasename"]');
    const exportLabel = exportInput?.closest("label");
    const formGrid = exportLabel?.parentElement;

    const label = document.createElement("label");
    label.innerHTML = [
      "Uploaded By",
      '<span class="library-ownership-callout"><strong>Important:</strong> Enter the name you want tied to this JSTO. Only the original uploader or an admin can edit or delete it later.</span>',
      '<input id="uploaded-by" name="uploadedBy" type="text" placeholder="Your name">',
      '<span class="muted">Use the same name later in the Library Manager to unlock your own JSTOs.</span>'
    ].join("");

    if (exportLabel && formGrid) {
      exportLabel.insertAdjacentElement("afterend", label);
    } else {
      form.prepend(label);
    }

    input = label.querySelector('input[name="uploadedBy"]');
    return input;
  }

  function hydrateUploaderField(input) {
    const value = getIdentityFromUrlOrStorage();
    input.value = value;
    if (value) {
      writeStoredIdentity(value);
    }
  }

  function bindUploaderField(input) {
    input.addEventListener("input", () => {
      writeStoredIdentity(input.value);
    });
  }

  function interceptLibrarySave(uploaderInput) {
    const button = document.getElementById("save-library");
    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        await saveToLibraryWithOwnership(uploaderInput, button);
      },
      { capture: true }
    );
  }

  async function saveToLibraryWithOwnership(uploaderInput, button) {
    if (!LIBRARY_UPLOAD_URL) {
      window.alert("The JSTO Library upload service is not configured yet. Add your Render service URL in index.html before using this button.");
      return;
    }

    const uploadedBy = String(uploaderInput?.value || "").trim();
    if (!uploadedBy) {
      window.alert("Enter your name in Uploaded By before saving to the JSTO Library.");
      uploaderInput?.focus();
      return;
    }

    writeStoredIdentity(uploadedBy);

    if (typeof saveState === "function") {
      saveState();
    }

    const originalLabel = button?.textContent || "Save to JSTO Library";
    if (button) {
      button.disabled = true;
      button.textContent = "Saving...";
    }

    try {
      if (typeof renderEmbeddedPdfPages === "function") {
        await renderEmbeddedPdfPages();
      }

      const payload = typeof createPdfPayload === "function"
        ? createPdfPayload()
        : buildFallbackPayload();

      payload.uploadedBy = uploadedBy;
      payload.uploadedById = normalizeIdentity(uploadedBy);
      payload.state = payload.state && typeof payload.state === "object" ? payload.state : {};
      payload.state.meta = payload.state.meta && typeof payload.state.meta === "object" ? payload.state.meta : {};
      payload.state.meta.uploadedBy = uploadedBy;
      payload.state.meta.uploadedById = payload.uploadedById;

      const response = await fetch(`${LIBRARY_UPLOAD_URL}/api/save-library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "JSTO Library upload failed.");
      }

      window.alert("JSTO PDF uploaded to the JSTO Library. Only the original uploader or an admin can edit or delete it.");
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

  function buildFallbackPayload() {
    const preview = document.getElementById("preview");
    const form = document.getElementById("jsto-form");
    return {
      submittedAt: new Date().toISOString(),
      libraryVersion: 1,
      filename: "jsto-library-package.pdf",
      unit: String(form?.elements?.namedItem("unit")?.value || ""),
      workCenter: String(form?.elements?.namedItem("workCenter")?.value || ""),
      officeSymbol: String(form?.elements?.namedItem("officeSymbol")?.value || ""),
      previewHtml: preview?.innerHTML || "",
      state: {}
    };
  }

  function getIdentityFromUrlOrStorage() {
    const params = new URLSearchParams(window.location.search);
    const queryIdentity = String(params.get("libraryIdentity") || "").trim();
    return queryIdentity || readStoredIdentity();
  }

  function normalizeIdentity(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function readStoredIdentity() {
    try {
      return String(window.localStorage.getItem(LIBRARY_IDENTITY_KEY) || "").trim();
    } catch {
      return "";
    }
  }

  function writeStoredIdentity(value) {
    try {
      const normalized = String(value || "").trim();
      if (normalized) {
        window.localStorage.setItem(LIBRARY_IDENTITY_KEY, normalized);
      } else {
        window.localStorage.removeItem(LIBRARY_IDENTITY_KEY);
      }
    } catch {
      // Ignore storage failures.
    }
  }
})();
