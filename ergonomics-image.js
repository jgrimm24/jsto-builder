const ERGONOMICS_MODULE_ID = "local-8";
const ERGONOMICS_IMAGE_VERSION = "20260506-1";

installErgonomicsImagePreview();

function installErgonomicsImagePreview() {
  if (typeof renderOptionalModuleDetails !== "function") {
    return;
  }

  injectErgonomicsImageStyles();

  const originalRenderOptionalModuleDetails = renderOptionalModuleDetails;
  renderOptionalModuleDetails = function renderOptionalModuleDetailsWithErgonomicsImage() {
    const moduleDetails = originalRenderOptionalModuleDetails.apply(this, arguments);

    if (!isErgonomicsModuleSelected()) {
      return moduleDetails;
    }

    return `${moduleDetails}${renderErgonomicsImageBlock()}`;
  };

  window.setTimeout(() => {
    if (typeof renderPreview === "function" && isErgonomicsModuleSelected()) {
      renderPreview();
    }
  }, 0);
}

function isErgonomicsModuleSelected() {
  try {
    return Array.isArray(state?.selectedModules) && state.selectedModules.some((module) => (
      module?.id === ERGONOMICS_MODULE_ID || /ergonomics/i.test(String(module?.title || ""))
    ));
  } catch {
    return false;
  }
}

function renderErgonomicsImageBlock() {
  const imageUrl = new URL(`assets/ergonomic.png?v=${ERGONOMICS_IMAGE_VERSION}`, window.location.href).href;

  return `
    <div class="ergonomics-image-block">
      <strong>Ergonomics Workstation Posture Guide:</strong>
      <figure class="ergonomics-image-wrap">
        <img
          class="ergonomics-image"
          src="${imageUrl}"
          alt="Ergonomics workstation posture guide"
          loading="eager"
        >
        <figcaption class="muted">Use this guide while briefing office and administrative workstation setup.</figcaption>
      </figure>
    </div>
  `;
}

function injectErgonomicsImageStyles() {
  if (document.getElementById("ergonomics-image-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "ergonomics-image-styles";
  style.textContent = `
    .ergonomics-image-block {
      display: grid;
      gap: 12px;
      margin-top: 16px;
      padding: 18px;
      border: 1px solid rgba(31, 42, 42, 0.12);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.88);
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .ergonomics-image-wrap {
      display: grid;
      gap: 8px;
      margin: 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .ergonomics-image {
      width: 100%;
      max-width: 720px;
      display: block;
      border-radius: 16px;
      border: 1px solid rgba(31, 42, 42, 0.12);
      background: white;
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;
  document.head.appendChild(style);
}
