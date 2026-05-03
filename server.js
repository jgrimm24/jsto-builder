const http = require("http");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const port = process.env.PORT || 4173;
const host = process.env.HOST || "0.0.0.0";
const root = __dirname;
const githubToken = process.env.GITHUB_TOKEN || "";
const githubOwner = process.env.GITHUB_OWNER || "jgrimm24";
const githubRepo = process.env.GITHUB_REPO || "jsto-builder";
const githubBranch = process.env.GITHUB_BRANCH || "main";
const libraryPath = process.env.GITHUB_LIBRARY_PATH || "JSTO-Library";
const libraryDeleteToken = process.env.LIBRARY_DELETE_TOKEN || "";
const libraryAdminIdentities = process.env.LIBRARY_ADMIN_IDENTITIES || "";
const maxBodySize = 90 * 1024 * 1024;
const stylesCss = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const adminIdentitySet = new Set(
  String(libraryAdminIdentities || "")
    .split(",")
    .map((value) => normalizeIdentity(value))
    .filter(Boolean)
);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
  ".pdf": "application/pdf"
};

const assetMimeTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".avif": "image/avif"
};

function normalizeIdentity(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function isAdminIdentity(identity) {
  return adminIdentitySet.has(normalizeIdentity(identity));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Library-Delete-Token"
  });
  res.end(JSON.stringify(payload));
}

function sendPdf(res, filename, pdfBytes) {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Length": Buffer.byteLength(pdfBytes),
    "Content-Disposition": `attachment; filename="${String(filename || "jsto-export.pdf").replace(/"/g, "")}"`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Library-Delete-Token"
  });
  res.end(pdfBytes);
}

function sendInlinePdf(res, filename, pdfBytes) {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Length": Buffer.byteLength(pdfBytes),
    "Content-Disposition": `inline; filename="${String(filename || "jsto-library.pdf").replace(/"/g, "")}"`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Library-Delete-Token"
  });
  res.end(pdfBytes);
}

function sanitizeSlug(value, fallback = "jsto") {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function sanitizeLibraryFilename(value) {
  const stem = String(value || "")
    .trim()
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${stem || "jsto-library-submission"}.pdf`;
}

function createLibraryFilename(payload) {
  if (payload?.filename) {
    return sanitizeLibraryFilename(payload.filename);
  }

  const unit = sanitizeSlug(payload.unit, "");
  const workCenter = sanitizeSlug(payload.workCenter, "");
  const submittedAt = sanitizeSlug(payload.submittedAt, "submission").replace(/-+/g, "-");
  const parts = [unit, workCenter, submittedAt].filter(Boolean);
  return `${parts.join("-") || "jsto-library-submission"}.pdf`;
}

function extractPreviewMarkup(html) {
  const source = String(html || "");
  const previewById = source.match(/<article[^>]+id=["']preview["'][^>]*>([\s\S]*?)<\/article>/i);
  if (previewById) {
    return previewById[1];
  }

  const previewByClass = source.match(/<article[^>]+class=["'][^"']*\bpreview\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
  if (previewByClass) {
    return previewByClass[1];
  }

  return source;
}

function toAbsoluteAssetUrl(value, serviceBaseUrl) {
  const raw = String(value || "").trim();
  if (!raw || /^(?:[a-z]+:|\/\/|data:|blob:|#)/i.test(raw)) {
    return raw;
  }

  return new URL(raw, `${serviceBaseUrl}/`).toString();
}

function replaceLinksWithAbsoluteUrls(previewMarkup, serviceBaseUrl) {
  return previewMarkup.replace(/<a([^>]*?)\shref=(['"])([^'"]+)\2([^>]*?)>/gi, (match, before, quote, href, after) => {
    return `<a${before} href=${quote}${toAbsoluteAssetUrl(href, serviceBaseUrl)}${quote}${after}>`;
  });
}

function getContentTypeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return assetMimeTypes[ext] || mimeTypes[ext] || "application/octet-stream";
}

function validateLibraryPdfPath(value) {
  const targetPath = String(value || "").trim();
  if (!targetPath || !targetPath.startsWith(`${libraryPath}/`) || path.extname(targetPath).toLowerCase() !== ".pdf") {
    throw new Error("The requested JSTO library PDF could not be validated.");
  }

  return targetPath;
}

function validateLibraryJsonPath(value) {
  const targetPath = String(value || "").trim();
  if (!targetPath || !targetPath.startsWith(`${libraryPath}/`) || path.extname(targetPath).toLowerCase() !== ".json") {
    throw new Error("The requested JSTO editable package could not be validated.");
  }

  return targetPath;
}

function getAssetContentType(assetUrl, response) {
  const headerType = response.headers.get("content-type");
  if (headerType) {
    return headerType.split(";")[0].trim();
  }

  try {
    const pathname = new URL(assetUrl).pathname;
    return getContentTypeForPath(pathname);
  } catch {
    return "application/octet-stream";
  }
}

function getLocalAssetPath(assetUrl, serviceBaseUrl) {
  try {
    const asset = new URL(assetUrl);
    const serviceBase = new URL(serviceBaseUrl);
    if (asset.origin !== serviceBase.origin) {
      return "";
    }

    const normalizedPath = path.normalize(decodeURIComponent(asset.pathname)).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, normalizedPath);
    const relativePath = path.relative(root, filePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return "";
    }

    return filePath;
  } catch {
    return "";
  }
}

async function fetchAssetAsDataUrl(assetUrl, serviceBaseUrl) {
  const localPath = getLocalAssetPath(assetUrl, serviceBaseUrl);
  if (localPath && fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    const bytes = fs.readFileSync(localPath);
    return `data:${getContentTypeForPath(localPath)};base64,${bytes.toString("base64")}`;
  }

  const response = await fetch(assetUrl);
  if (!response.ok) {
    throw new Error(`Asset request failed with ${response.status} for ${assetUrl}`);
  }

  const contentType = getAssetContentType(assetUrl, response);
  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${bytes.toString("base64")}`;
}

async function replaceImageSrcWithDataUrls(previewMarkup, serviceBaseUrl) {
  const assetCache = new Map();
  const pattern = /<(img|source)([^>]*?)\ssrc=(['"])([^'"]+)\3([^>]*?)>/gi;
  let output = "";
  let lastIndex = 0;

  for (const match of previewMarkup.matchAll(pattern)) {
    const [fullMatch, tag, before, quote, rawSrc, after] = match;
    const matchIndex = match.index || 0;
    output += previewMarkup.slice(lastIndex, matchIndex);

    const absoluteSrc = toAbsoluteAssetUrl(rawSrc, serviceBaseUrl);
    let resolvedSrc = absoluteSrc;

    if (absoluteSrc && !/^(?:data:|blob:|#)/i.test(absoluteSrc)) {
      if (!assetCache.has(absoluteSrc)) {
        try {
          assetCache.set(absoluteSrc, await fetchAssetAsDataUrl(absoluteSrc, serviceBaseUrl));
        } catch {
          assetCache.set(absoluteSrc, absoluteSrc);
        }
      }

      resolvedSrc = assetCache.get(absoluteSrc) || absoluteSrc;
    }

    output += `<${tag}${before} src=${quote}${resolvedSrc}${quote}${after}>`;
    lastIndex = matchIndex + fullMatch.length;
  }

  output += previewMarkup.slice(lastIndex);
  return output;
}

async function normalizePreviewHtml(previewHtml, serviceBaseUrl) {
  const withoutScripts = extractPreviewMarkup(previewHtml).replace(/<script[\s\S]*?<\/script>/gi, "");
  const withAbsoluteLinks = replaceLinksWithAbsoluteUrls(withoutScripts, serviceBaseUrl);
  return replaceImageSrcWithDataUrls(withAbsoluteLinks, serviceBaseUrl);
}

async function buildPdfHtml(payload, serviceBaseUrl) {
  const title = [payload.unit, payload.workCenter].filter(Boolean).join(" - ") || "Job Safety Training Outline";
  const previewMarkup = await normalizePreviewHtml(payload.previewHtml, serviceBaseUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${serviceBaseUrl}/">
  <title>${title}</title>
  <style>${stylesCss}</style>
  <style>
    body {
      padding: 0;
      background: white;
    }

    .pdf-shell {
      max-width: 960px;
      margin: 0 auto;
    }

    .preview {
      box-shadow: none;
      border: 0;
      border-radius: 0;
      min-height: auto;
    }
  </style>
</head>
<body>
  <main class="pdf-shell">
    <article class="preview">${previewMarkup}</article>
  </main>
</body>
</html>`;
}

async function renderLibraryPdf(payload, serviceBaseUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 1810, deviceScaleFactor: 1 });
    await page.setContent(await buildPdfHtml(payload, serviceBaseUrl), {
      waitUntil: "domcontentloaded",
      timeout: 0
    });

    await page.evaluate(async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const imagePromises = Array.from(document.images || []).map((img) => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        });
      });

      await Promise.race([
        Promise.all(imagePromises),
        wait(5000)
      ]);

      if (document.fonts?.ready) {
        await Promise.race([document.fonts.ready, wait(2000)]);
      }

      await wait(250);
    });

    return await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.4in",
        right: "0.4in",
        bottom: "0.4in",
        left: "0.4in"
      }
    });
  } finally {
    await browser.close();
  }
}

function createGitHubHeaders(extraHeaders = {}) {
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "jsto-builder-upload-service",
    ...extraHeaders
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  return headers;
}

async function fetchGitHubJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: createGitHubHeaders(options.headers || {})
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || "GitHub request failed.");
    error.statusCode = response.status;
    throw error;
  }

  return result;
}

async function fetchExistingGitHubFileSha(targetPath) {
  const response = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(githubBranch)}`, {
    headers: createGitHubHeaders()
  });

  if (response.status === 404) {
    return "";
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "GitHub request failed.");
  }

  return result.sha || "";
}

async function createGitHubFile(targetPath, content, message) {
  if (!githubToken) {
    throw new Error("The upload service is missing the GITHUB_TOKEN environment variable.");
  }

  const existingSha = await fetchExistingGitHubFileSha(targetPath);
  const body = {
    message,
    content,
    branch: githubBranch
  };

  if (existingSha) {
    body.sha = existingSha;
  }

  return fetchGitHubJson(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, "/")}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

async function listLibraryItems() {
  const items = await fetchGitHubJson(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(libraryPath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(githubBranch)}`);
  const files = Array.isArray(items) ? items : [];

  return files
    .filter((item) => item && item.type === "file")
    .map((item) => ({
      name: item.name,
      path: item.path,
      sha: item.sha,
      size: item.size,
      htmlUrl: item.html_url,
      downloadUrl: item.download_url,
      viewUrl: `/api/library-file?path=${encodeURIComponent(item.path)}`,
      gitUrl: item.git_url
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchLibraryPdf(targetPath) {
  const result = await fetchGitHubJson(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(githubBranch)}`);

  if (result?.content) {
    return Buffer.from(String(result.content).replace(/\s/g, ""), "base64");
  }

  if (result?.download_url) {
    const response = await fetch(result.download_url, {
      headers: createGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error(`The JSTO library PDF request failed with ${response.status}.`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  throw new Error("The JSTO library PDF could not be loaded.");
}

async function fetchLibraryJson(targetPath) {
  const result = await fetchGitHubJson(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(githubBranch)}`);

  if (result?.content) {
    const jsonText = Buffer.from(String(result.content).replace(/\s/g, ""), "base64").toString("utf8");
    return JSON.parse(jsonText);
  }

  if (result?.download_url) {
    const response = await fetch(result.download_url, {
      headers: createGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error(`The JSTO editable package request failed with ${response.status}.`);
    }

    return response.json();
  }

  throw new Error("The JSTO editable package could not be loaded.");
}

async function fetchLibraryJsonIfExists(targetPath) {
  try {
    return await fetchLibraryJson(targetPath);
  } catch (error) {
    if (error?.statusCode === 404 || /could not be loaded/i.test(String(error?.message || ""))) {
      return null;
    }
    throw error;
  }
}

function getOwnershipFromState(state) {
  const libraryMeta = state?.libraryMeta || {};
  const meta = state?.meta || {};
  const uploadedBy = String(libraryMeta.uploadedBy || meta.uploadedBy || "").trim();
  const uploadedById = normalizeIdentity(libraryMeta.uploadedById || meta.uploadedById || uploadedBy);
  return { uploadedBy, uploadedById };
}

function canManageLibraryItem(uploadedById, identity) {
  const normalizedIdentity = normalizeIdentity(identity);
  if (!normalizedIdentity) {
    return false;
  }

  if (isAdminIdentity(normalizedIdentity)) {
    return true;
  }

  return Boolean(uploadedById) && normalizedIdentity === uploadedById;
}

function createForbiddenError(message) {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

async function getPackageOwnershipForPath(targetPath) {
  const trimmedPath = String(targetPath || "").trim();
  const extension = path.extname(trimmedPath).toLowerCase();
  const statePath = extension === ".json"
    ? trimmedPath
    : extension === ".pdf"
      ? trimmedPath.replace(/\.pdf$/i, ".json")
      : "";

  if (!statePath) {
    return {
      uploadedBy: "",
      uploadedById: "",
      statePath: "",
      state: null
    };
  }

  const state = await fetchLibraryJsonIfExists(statePath);
  const ownership = getOwnershipFromState(state || {});
  return {
    ...ownership,
    statePath,
    state
  };
}

async function buildLibraryPackages(identity) {
  const files = await listLibraryItems();
  const packageMap = new Map();

  files.forEach((file) => {
    const extension = path.extname(String(file.path || "")).toLowerCase();
    if (![".pdf", ".json"].includes(extension)) {
      return;
    }

    const key = String(file.path || "").replace(/\.(pdf|json)$/i, "");
    const existing = packageMap.get(key) || { key };
    if (extension === ".pdf") {
      existing.pdf = file;
    }
    if (extension === ".json") {
      existing.json = file;
    }
    packageMap.set(key, existing);
  });

  const packages = [];
  for (const item of packageMap.values()) {
    if (!item.pdf) {
      continue;
    }

    const ownership = item.json ? await getPackageOwnershipForPath(item.json.path) : { uploadedBy: "", uploadedById: "" };
    packages.push({
      key: item.key,
      pdf: item.pdf,
      json: item.json || null,
      uploadedBy: ownership.uploadedBy || "",
      canEdit: Boolean(item.json && canManageLibraryItem(ownership.uploadedById, identity)),
      canDelete: canManageLibraryItem(ownership.uploadedById, identity)
    });
  }

  return packages.sort((a, b) => String(a.pdf?.name || "").localeCompare(String(b.pdf?.name || "")));
}

function ensureDeleteAuthorized(deleteToken) {
  if (!libraryDeleteToken) {
    return;
  }

  if (String(deleteToken || "") !== libraryDeleteToken) {
    const error = new Error("A valid JSTO Library delete code is required.");
    error.statusCode = 401;
    throw error;
  }
}

async function ensureLibraryStateAuthorized(targetPath, identity) {
  const ownership = await getPackageOwnershipForPath(targetPath);
  if (canManageLibraryItem(ownership.uploadedById, identity)) {
    return ownership;
  }

  if (!ownership.uploadedById && isAdminIdentity(identity)) {
    return ownership;
  }

  throw createForbiddenError("Only the original uploader or an admin can open this editable JSTO package.");
}

async function deleteLibraryFile(payload) {
  if (!githubToken) {
    throw new Error("The upload service is missing the GITHUB_TOKEN environment variable.");
  }

  const targetPath = String(payload?.path || "").trim();
  const sha = String(payload?.sha || "").trim();
  const identity = String(payload?.identity || "").trim();
  ensureDeleteAuthorized(payload?.deleteToken);

  if (!targetPath || !sha || !targetPath.startsWith(`${libraryPath}/`)) {
    throw new Error("The requested JSTO library file could not be validated.");
  }

  const ownership = await getPackageOwnershipForPath(targetPath);
  if (!canManageLibraryItem(ownership.uploadedById, identity)) {
    if (!(isAdminIdentity(identity) && !ownership.uploadedById)) {
      throw createForbiddenError("Only the original uploader or an admin can delete this JSTO.");
    }
  }

  await fetchGitHubJson(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, "/")}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Delete JSTO library file ${path.basename(targetPath)} [skip render]`,
      sha,
      branch: githubBranch
    })
  });
}

async function saveLibrarySubmission(payload, serviceBaseUrl) {
  const uploadedBy = String(payload?.uploadedBy || payload?.state?.meta?.uploadedBy || "").trim();
  const uploadedById = normalizeIdentity(payload?.uploadedById || payload?.state?.meta?.uploadedById || uploadedBy);
  if (!uploadedBy || !uploadedById) {
    throw new Error("Uploader name is required before saving to the JSTO Library.");
  }

  const filename = createLibraryFilename(payload);
  const targetPath = `${libraryPath}/${filename}`;
  const stateFilename = filename.replace(/\.pdf$/i, ".json");
  const stateTargetPath = `${libraryPath}/${stateFilename}`;
  const pdfBytes = await renderLibraryPdf(payload, serviceBaseUrl);
  const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
  await createGitHubFile(
    targetPath,
    pdfBase64,
    `Add JSTO library PDF for ${payload.workCenter || payload.unit || "work center"} [skip render]`
  );

  if (payload.state && typeof payload.state === "object") {
    const savedAt = new Date().toISOString();
    const statePayload = {
      ...payload.state,
      savedLibraryPdf: targetPath,
      savedAt,
      libraryMeta: {
        uploadedBy,
        uploadedById,
        savedLibraryPdf: targetPath,
        savedAt
      }
    };
    statePayload.meta = {
      ...(statePayload.meta || {}),
      uploadedBy,
      uploadedById
    };

    await createGitHubFile(
      stateTargetPath,
      Buffer.from(JSON.stringify(statePayload, null, 2), "utf8").toString("base64"),
      `Add JSTO editable package for ${payload.workCenter || payload.unit || "work center"} [skip render]`
    );
  }

  return {
    filename,
    stateFilename,
    htmlUrl: `${serviceBaseUrl.replace(/\/$/, "")}/library.html`
  };
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBodySize) {
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || `127.0.0.1:${port}`}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Library-Delete-Token"
    });
    res.end();
    return;
  }

  if (requestUrl.pathname === "/api/library-files" && req.method === "GET") {
    try {
      const identity = requestUrl.searchParams.get("identity") || "";
      const packages = await buildLibraryPackages(identity);
      sendJson(res, 200, {
        ok: true,
        requiresDeleteToken: Boolean(libraryDeleteToken),
        packages
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to load JSTO Library files."
      });
    }
    return;
  }

  if (requestUrl.pathname === "/api/library-file" && req.method === "GET") {
    try {
      const targetPath = validateLibraryPdfPath(requestUrl.searchParams.get("path"));
      const pdfBytes = await fetchLibraryPdf(targetPath);
      sendInlinePdf(res, path.basename(targetPath), pdfBytes);
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to open JSTO library PDF."
      });
    }

    return;
  }

  if (requestUrl.pathname === "/api/library-state" && req.method === "GET") {
    try {
      const targetPath = validateLibraryJsonPath(requestUrl.searchParams.get("path"));
      const identity = requestUrl.searchParams.get("identity") || "";
      await ensureLibraryStateAuthorized(targetPath, identity);
      const state = await fetchLibraryJson(targetPath);
      sendJson(res, 200, {
        ok: true,
        state
      });
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to load JSTO editable package."
      });
    }

    return;
  }

  if (requestUrl.pathname === "/api/library-files" && req.method === "DELETE") {
    try {
      const body = await readRequestBody(req);
      const payload = JSON.parse(body || "{}");
      await deleteLibraryFile(payload);
      sendJson(res, 200, {
        ok: true
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.statusCode ? error.statusCode : 500;
      sendJson(res, statusCode, {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to delete JSTO Library file."
      });
    }
    return;
  }

  if (requestUrl.pathname === "/api/save-library" && req.method === "POST") {
    try {
      const body = await readRequestBody(req);
      const payload = JSON.parse(body || "{}");
      if (!payload || typeof payload !== "object") {
        throw new Error("Upload payload is missing.");
      }

      const forwardedProto = req.headers["x-forwarded-proto"] || "http";
      const hostHeader = req.headers.host || `127.0.0.1:${port}`;
      const serviceBaseUrl = `${forwardedProto}://${hostHeader}`;
      const saved = await saveLibrarySubmission(payload, serviceBaseUrl);
      sendJson(res, 200, {
        ok: true,
        filename: saved.filename,
        libraryUrl: saved.htmlUrl
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "JSTO Library upload failed."
      });
    }
    return;
  }

  if (requestUrl.pathname === "/api/export-pdf" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBodySize) {
        req.destroy();
      }
    });

    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        if (!payload || typeof payload !== "object") {
          throw new Error("Export payload is missing.");
        }

        const forwardedProto = req.headers["x-forwarded-proto"] || "http";
        const hostHeader = req.headers.host || `127.0.0.1:${port}`;
        const serviceBaseUrl = `${forwardedProto}://${hostHeader}`;
        const filename = createLibraryFilename(payload);
        const pdfBytes = await renderLibraryPdf(payload, serviceBaseUrl);
        sendPdf(res, filename, pdfBytes);
      } catch (error) {
        sendJson(res, 500, {
          ok: false,
          error: error instanceof Error ? error.message : "PDF export failed."
        });
      }
    });

    req.on("error", () => {
      sendJson(res, 500, {
        ok: false,
        error: "The PDF export request was interrupted."
      });
    });

    return;
  }

  const requestPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`JSTO Builder running at http://${host}:${port}`);
});
