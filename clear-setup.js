const CLEAR_SETUP_FILE_INPUT_IDS = [
  "unit-image",
  "upload-json",
  "evacuation-image",
  "emergency-equipment-files",
  "gvo-risk-files",
  "form-1118-files",
  "bio-survey-file",
  "custom-module-title",
  "custom-module-reference"
];

function cloneDefaultSetupState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function clearSetupTransientInputs() {
  CLEAR_SETUP_FILE_INPUT_IDS.forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.value = "";
    }
  });

  const moduleSelect = document.getElementById("module-select");
  if (moduleSelect) {
    moduleSelect.value = "";
  }

  const fieldEditorText = document.getElementById("field-editor-text");
  if (fieldEditorText) {
    fieldEditorText.value = "";
  }

  const fieldEditorModal = document.getElementById("field-editor-modal");
  if (fieldEditorModal) {
    fieldEditorModal.hidden = true;
  }

  document.body.classList.remove("modal-open");
}

function clearCurrentSetup() {
  const confirmed = window.confirm(
    "Clear the current JSTO setup and attachments? This will remove the current form contents, selected modules, and uploaded files from this browser session."
  );

  if (!confirmed) {
    return;
  }

  applyImportedState(cloneDefaultSetupState());
  clearSetupTransientInputs();

  if (typeof ensureExportField === "function") {
    const form = document.getElementById("jsto-form");
    const exportField = form ? ensureExportField(form) : null;
    if (exportField) {
      exportField.value = "";
    }
  }

  if (typeof updateExportPlaceholder === "function") {
    const form = document.getElementById("jsto-form");
    const exportField = form?.elements?.namedItem("exportBasename");
    if (form && exportField) {
      updateExportPlaceholder(exportField, form);
    }
  }

  if (typeof applyPublicationTitlesPatch === "function") {
    applyPublicationTitlesPatch();
  }
}

function initClearSetupButton() {
  const clearButton = document.getElementById("clear-setup");
  if (!clearButton) {
    return;
  }

  clearButton.addEventListener("click", clearCurrentSetup);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClearSetupButton, { once: true });
} else {
  initClearSetupButton();
}
