const LIBRARY_API_BASE = String(window.JSTO_LIBRARY_UPLOAD_URL || "").trim().replace(/\/$/, "");
const DELETE_TOKEN_KEY = "jsto-library-delete-token";
const GITHUB_LIBRARY_API = "https://api.github.com/repos/jgrimm24/jsto-builder/contents/JSTO-Library?ref=main";

const statusElement = document.getElementById("library-status");
const listElement = document.getElementById("library-list");
const refreshButton = document.getElementById("refresh-library");
let libraryDeleteAvailable = Boolean(LIBRARY_API_BASE);

if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    loadLibraryFiles();
  });
}

loadLibraryFiles();

async function loadLibraryFiles() {
  setStatus("Loading JSTO library files...");
  renderLoading();

  if (LIBRARY_API_BASE) {
    try {
      const response = await fetch(`${LIBRARY_API_BASE}/api/library-files`);
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Unable to load JSTO Library files.");
      }

      libraryDeleteAvailable = true;
      const packages = groupLibraryPackages(result.files || []);
      renderLibraryFiles(packages);
      const count = packages.length;
      setStatus(`${count} JSTO package${count === 1 ? "" : "s"} in the library.`);
      return;
    } catch (error) {
      try {
        await loadLibraryFilesFromGitHub(error);
        return;
      } catch (fallbackError) {
        renderError(fallbackError instanceof Error ? fallbackError.message : "Unable to load JSTO Library files.");
        return;
      }
    }
  }

  try {
    await loadLibraryFilesFromGitHub();
  } catch (error) {
    renderError(error instanceof Error ? error.message : "Unable to load JSTO Library files.");
  }
}

async function loadLibraryFilesFromGitHub(originalError) {
  const response = await fetch(GITHUB_LIBRARY_API, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load JSTO Library files from GitHub.");
  }

  const files = Array.isArray(result)
    ? result
        .filter((item) => item && item.type === "file")
        .map((item) => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size,
          downloadUrl: item.download_url,
          htmlUrl: item.html_url
        }))
    : [];

  libraryDeleteAvailable = false;
  const packages = groupLibraryPackages(files);
  renderLibraryFiles(packages);
  const count = packages.length;
  const reason = originalError instanceof Error && originalError.message ? ` The upload service appears blocked on this network (${originalError.message}).` : "";
  setStatus(`${count} JSTO package${count === 1 ? "" : "s"} loaded from GitHub.${reason} Delete and Edit are unavailable from this network view.`);
}

function renderLoading() {
  listElement.innerHTML = '<div class="library-empty">Loading library contents...</div>';
}

function renderError(message) {
  setStatus(message);
  listElement.innerHTML = `<div class="library-empty">${escapeHtml(message)}</div>`;
}

function groupLibraryPackages(files) {
  const packages = new Map();
  (Array.isArray(files) ? files : []).forEach((file) => {
    const pathValue = String(file?.path || "");
    const extension = pathValue.split(".").pop()?.toLowerCase() || "";
    if (!["pdf", "json"].includes(extension)) {
      return;
    }

    const packageKey = pathValue.replace(/\.(pdf|json)$/i, "");
    const existing = packages.get(packageKey) || { key: packageKey };
    existing[extension] = file;
    packages.set(packageKey, existing);
  });

  return Array.from(packages.values())
    .filter((item) => item.pdf)
    .sort((a, b) => String(a.pdf.name || "").localeCompare(String(b.pdf.name || "")));
}

function renderLibraryFiles(packages) {
  if (!Array.isArray(packages) || !packages.length) {
    listElement.innerHTML = '<div class="library-empty">No JSTOs have been saved to the library yet.</div>';
    return;
  }

  listElement.innerHTML = packages.map((jstoPackage) => {
    const pdfFile = jstoPackage.pdf || {};
    const jsonFile = jstoPackage.json || null;
    const sizeLabel = formatBytes(pdfFile.size || 0);
    const downloadUrl = escapeHtml(createLibraryFileDownloadUrl(pdfFile.downloadUrl || pdfFile.viewUrl || pdfFile.htmlUrl || "#"));
    const editUrl = jsonFile && libraryDeleteAvailable ? escapeHtml(createBuilderEditUrl(jsonFile.path || "")) : "";
    const name = escapeHtml(pdfFile.name || "JSTO PDF");
    const pathValue = escapeHtml(pdfFile.path || "");
    const shaValue = escapeHtml(pdfFile.sha || "");
    const jsonPathValue = escapeHtml(jsonFile?.path || "");
    const jsonShaValue = escapeHtml(jsonFile?.sha || "");
    const deleteAttributes = libraryDeleteAvailable
      ? `class="button danger delete-library-file" type="button" data-path="${pathValue}" data-sha="${shaValue}" data-json-path="${jsonPathValue}" data-json-sha="${jsonShaValue}" data-name="${name}"`
      : 'class="button danger" type="button" disabled title="Delete is unavailable while the upload service is blocked on this network."';
    const deleteLabel = libraryDeleteAvailable ? "Delete" : "Delete Unavailable";

    return `
      <article class="library-item">
        <div class="library-item-copy">
          <h3>${name}</h3>
          <div class="library-item-meta">${sizeLabel}${pdfFile.path ? ` • ${pathValue}` : ""}</div>
        </div>
        <div class="library-item-actions">
          <a class="button" href="${downloadUrl}" download>Download PDF</a>
          ${editUrl ? `<a class="button" href="${editUrl}">Edit</a>` : ""}
          <button ${deleteAttributes}>${deleteLabel}</button>
        </div>
      </article>
    `;
  }).join("");

  if (!libraryDeleteAvailable) {
    return;
  }

  listElement.querySelectorAll(".delete-library-file").forEach((button) => {
    button.addEventListener("click", () => {
      handleDelete(button);
    });
  });
}

function createLibraryFileDownloadUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw === "#") {
    return "#";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `${LIBRARY_API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function createBuilderEditUrl(statePath) {
  return `index.html?v=20260429-1&libraryState=${encodeURIComponent(statePath)}`;
}

async function handleDelete(button) {
  const fileName = button.dataset.name || "this JSTO";
  const filePath = button.dataset.path || "";
  const fileSha = button.dataset.sha || "";
  const jsonPath = button.dataset.jsonPath || "";
  const jsonSha = button.dataset.jsonSha || "";

  if (!filePath || !fileSha) {
    window.alert("That JSTO file is missing the information needed for deletion. Refresh the page and try again.");
    return;
  }

  const confirmed = window.confirm(`Delete ${fileName} from the JSTO Library? This cannot be undone.`);
  if (!confirmed) {
    return;
  }

  button.disabled = true;
  const originalLabel = button.textContent;
  button.textContent = "Deleting...";

  try {
    await deleteLibraryFile({ path: filePath, sha: fileSha });
    if (jsonPath && jsonSha) {
      await deleteLibraryFile({ path: jsonPath, sha: jsonSha });
    }
    setStatus(`${fileName} was removed from the JSTO Library.`);
    await loadLibraryFiles();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete JSTO file.";
    window.alert(message);
    button.disabled = false;
    button.textContent = originalLabel;
  }
}

async function deleteLibraryFile(payload) {
  const deleteToken = window.sessionStorage.getItem(DELETE_TOKEN_KEY) || "";
  let response = await fetch(`${LIBRARY_API_BASE}/api/library-files`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...payload,
      deleteToken
    })
  });

  if (response.status === 401) {
    const promptedToken = window.prompt("Enter the JSTO Library delete code.", deleteToken);
    if (promptedToken === null) {
      throw new Error("Deletion canceled.");
    }

    const normalizedToken = String(promptedToken || "").trim();
    window.sessionStorage.setItem(DELETE_TOKEN_KEY, normalizedToken);

    response = await fetch(`${LIBRARY_API_BASE}/api/library-files`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...payload,
        deleteToken: normalizedToken
      })
    });
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "Unable to delete JSTO file.");
  }
}

function setStatus(message) {
  if (statusElement) {
    statusElement.textContent = message;
  }
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
