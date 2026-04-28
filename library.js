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
      renderLibraryFiles(result.files || []);
      const count = Array.isArray(result.files) ? result.files.length : 0;
      setStatus(`${count} JSTO file${count === 1 ? "" : "s"} in the library.`);
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
  renderLibraryFiles(files);
  const count = files.length;
  const reason = originalError instanceof Error && originalError.message ? ` The upload service appears blocked on this network (${originalError.message}).` : "";
  setStatus(`${count} JSTO file${count === 1 ? "" : "s"} loaded from GitHub.${reason} Delete is unavailable from this network view.`);
}

function renderLoading() {
  listElement.innerHTML = '<div class="library-empty">Loading library contents...</div>';
}

function renderError(message) {
  setStatus(message);
  listElement.innerHTML = `<div class="library-empty">${escapeHtml(message)}</div>`;
}

function renderLibraryFiles(files) {
  if (!Array.isArray(files) || !files.length) {
    listElement.innerHTML = '<div class="library-empty">No JSTOs have been saved to the library yet.</div>';
    return;
  }

  listElement.innerHTML = files.map((file) => {
    const sizeLabel = formatBytes(file.size || 0);
    const viewUrl = escapeHtml(createLibraryFileViewUrl(file.viewUrl || file.downloadUrl || file.htmlUrl || "#"));
    const name = escapeHtml(file.name || "JSTO PDF");
    const pathValue = escapeHtml(file.path || "");
    const shaValue = escapeHtml(file.sha || "");
    const deleteAttributes = libraryDeleteAvailable
      ? `class="button danger delete-library-file" type="button" data-path="${pathValue}" data-sha="${shaValue}" data-name="${name}"`
      : 'class="button danger" type="button" disabled title="Delete is unavailable while the upload service is blocked on this network."';
    const deleteLabel = libraryDeleteAvailable ? "Delete" : "Delete Unavailable";

    return `
      <article class="library-item">
        <div class="library-item-copy">
          <h3>${name}</h3>
          <div class="library-item-meta">${sizeLabel}${file.path ? ` • ${pathValue}` : ""}</div>
        </div>
        <div class="library-item-actions">
          <a class="button" href="${viewUrl}" target="_blank" rel="noreferrer">Open PDF</a>
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

function createLibraryFileViewUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw === "#") {
    return "#";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `${LIBRARY_API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

async function handleDelete(button) {
  const fileName = button.dataset.name || "this JSTO";
  const filePath = button.dataset.path || "";
  const fileSha = button.dataset.sha || "";

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
