const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 4173;
const host = process.env.HOST || "0.0.0.0";
const root = __dirname;
const githubToken = process.env.GITHUB_TOKEN || "";
const githubOwner = process.env.GITHUB_OWNER || "jgrimm24";
const githubRepo = process.env.GITHUB_REPO || "jsto-builder";
const githubBranch = process.env.GITHUB_BRANCH || "main";
const libraryPath = process.env.GITHUB_LIBRARY_PATH || "JSTO-Library";
const maxBodySize = 35 * 1024 * 1024;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function sanitizeSlug(value, fallback = "jsto") {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function createLibraryFilename(payload) {
  const unit = sanitizeSlug(payload.unit, "");
  const workCenter = sanitizeSlug(payload.workCenter, "");
  const submittedAt = sanitizeSlug(payload.submittedAt, "submission").replace(/-+/g, "-");
  const parts = [unit, workCenter, submittedAt].filter(Boolean);
  return `${parts.join("-") || "jsto-library-submission"}.json`;
}

async function saveLibrarySubmission(payload) {
  if (!githubToken) {
    throw new Error("The upload service is missing the GITHUB_TOKEN environment variable.");
  }

  const filename = createLibraryFilename(payload);
  const targetPath = `${libraryPath}/${filename}`;
  const body = {
    message: `Add JSTO library submission for ${payload.workCenter || payload.unit || "work center"}`,
    content: Buffer.from(JSON.stringify(payload, null, 2), "utf8").toString("base64"),
    branch: githubBranch
  };

  const response = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, "/")}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "jsto-builder-upload-service"
    },
    body: JSON.stringify(body)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "GitHub rejected the JSTO Library upload.");
  }

  return {
    filename,
    htmlUrl: result.content?.html_url || `https://github.com/${githubOwner}/${githubRepo}/tree/${githubBranch}/${libraryPath}`
  };
}

http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.url === "/api/save-library" && req.method === "POST") {
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
          throw new Error("Upload payload is missing.");
        }

        const saved = await saveLibrarySubmission(payload);
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
    });

    req.on("error", () => {
      sendJson(res, 500, {
        ok: false,
        error: "The JSTO upload request was interrupted."
      });
    });

    return;
  }

  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`JSTO Builder running at http://${host}:${port}`);
});
