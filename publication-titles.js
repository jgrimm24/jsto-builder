const PUBLICATION_REFERENCE_MAP = [
  {
    match: /DESR6055\.09_DAFMAN91-201/g,
    canonical: "DESR 6055.09_DAFMAN 91-201",
    title: "Explosives Safety Standards"
  },
  {
    match: /DAFMAN 91-203/g,
    canonical: "DAFMAN 91-203",
    title: "Air Force Occupational Safety, Fire and Health Standards"
  },
  {
    match: /DAFI 91-202/g,
    canonical: "DAFI 91-202",
    title: "The Department of the Air Force (DAF) Mishap Prevention Program"
  },
  {
    match: /AFI 90-821/g,
    canonical: "AFI 90-821",
    title: "Hazard Communication (HAZCOM) Program"
  },
  {
    match: /AFI 48-109/g,
    canonical: "AFI 48-109",
    title: "Electromagnetic Field Radiation (EMFR) Occupational and Environmental Health Program"
  },
  {
    match: /AFI 48-127/g,
    canonical: "AFI 48-127",
    title: "Occupational Noise and Hearing Conservation Program"
  },
  {
    match: /AFI 48-137/g,
    canonical: "DAFI 48-137",
    title: "Respiratory Protection Program"
  },
  {
    match: /AFI 48-139/g,
    canonical: "AFI 48-139",
    title: "Laser and Optical Radiation Protection Program"
  },
  {
    match: /AFI 48-145/g,
    canonical: "DAFI 48-145",
    title: "Occupational and Environmental Health Program"
  },
  {
    match: /AFI 48-148/g,
    canonical: "AFMAN 48-148",
    title: "Ionizing Radiation Protection"
  },
  {
    match: /AFMAN 48-146/g,
    canonical: "DAFMAN 48-146",
    title: "Occupational Health Program Management"
  },
  {
    match: /AFRCI 41-104/g,
    canonical: "AFRCI 41-104",
    title: "Professional Board and National Certification Examinations"
  },
  {
    match: /AF Form 2767/g,
    canonical: "AF Form 2767",
    title: "Occupational Health Training & Protective Equipment Fit Testing"
  },
  {
    match: /OSHA 2254/g,
    canonical: "OSHA 2254",
    title: "Training Requirements in OSHA Standards"
  },
  {
    match: /(?:OSHA 1910|29 CFR Part 1910|29 CFR 1910)(?!\.\d)/g,
    canonical: "29 CFR Part 1910",
    title: "Occupational Safety and Health Standards (General Industry Standards)"
  },
  {
    match: /(?:OSHA 1926|29 CFR Part 1926|29 CFR 1926)(?!\.\d)/g,
    canonical: "29 CFR Part 1926",
    title: "Safety and Health Regulations for Construction"
  }
];

function expandPublicationTitles(value) {
  let nextValue = String(value || "");

  PUBLICATION_REFERENCE_MAP.forEach(({ match, canonical, title }) => {
    const fullText = `${canonical} - ${title}`;
    nextValue = nextValue.replace(match, (matchedValue, offset, source) => {
      return source.slice(offset).startsWith(fullText) ? matchedValue : fullText;
    });
  });

  return nextValue;
}

function patchString(value) {
  if (typeof value !== "string" || !value) {
    return { value, changed: false };
  }

  const nextValue = expandPublicationTitles(value);
  return {
    value: nextValue,
    changed: nextValue !== value
  };
}

function patchModuleReferenceFields(module) {
  if (!module || typeof module !== "object") {
    return false;
  }

  let changed = false;
  ["reference", "trainingSource", "afTrainingSource"].forEach((key) => {
    const result = patchString(module[key]);
    if (result.changed) {
      module[key] = result.value;
      changed = true;
    }
  });

  return changed;
}

function patchModuleCollection(collection) {
  if (!Array.isArray(collection)) {
    return false;
  }

  let changed = false;
  collection.forEach((module) => {
    if (patchModuleReferenceFields(module)) {
      changed = true;
    }
  });

  return changed;
}

function patchStateReferences() {
  if (typeof state !== "object" || !state) {
    return false;
  }

  let changed = false;

  if (patchModuleCollection(state.selectedModules)) {
    changed = true;
  }

  if (Array.isArray(state.moduleReferences)) {
    let referencesChanged = false;
    const nextReferences = state.moduleReferences.map((entry) => {
      if (typeof entry === "string") {
        const result = patchString(entry);
        if (result.changed) {
          referencesChanged = true;
        }
        return result.value;
      }

      if (entry && typeof entry === "object") {
        let entryChanged = false;
        const nextEntry = { ...entry };
        ["label", "value", "reference", "text", "title"].forEach((key) => {
          const result = patchString(nextEntry[key]);
          if (result.changed) {
            nextEntry[key] = result.value;
            entryChanged = true;
          }
        });

        if (entryChanged) {
          referencesChanged = true;
        }
        return nextEntry;
      }

      return entry;
    });

    if (referencesChanged) {
      state.moduleReferences = nextReferences;
      changed = true;
    }
  }

  if (state.meta) {
    const referencesResult = patchString(state.meta.references);
    if (referencesResult.changed) {
      state.meta.references = referencesResult.value;
      changed = true;
    }
  }

  return changed;
}

function patchReferenceTextarea() {
  const form = document.getElementById("jsto-form");
  const referencesField = form?.elements?.namedItem("references");
  if (!referencesField || typeof referencesField.value !== "string") {
    return false;
  }

  const result = patchString(referencesField.value);
  if (!result.changed) {
    return false;
  }

  referencesField.value = result.value;
  if (typeof state === "object" && state?.meta) {
    state.meta.references = result.value;
  }
  return true;
}

function patchRenderedModuleCards() {
  const selectedModules = document.getElementById("selected-modules");
  if (!selectedModules) {
    return false;
  }

  let changed = false;
  selectedModules.querySelectorAll(".module-reference, .module-training-source, .module-af-source, .module-training-requirement, .module-af-requirement").forEach((element) => {
    const result = patchString(element.textContent);
    if (result.changed) {
      element.textContent = result.value;
      changed = true;
    }
  });

  return changed;
}

function applyPublicationTitlesPatch() {
  let stateChanged = false;

  if (typeof OPTIONAL_MODULES !== "undefined") {
    if (patchModuleCollection(OPTIONAL_MODULES)) {
      stateChanged = true;
    }
  }

  if (typeof REQUIRED_MODULES !== "undefined") {
    if (patchModuleCollection(REQUIRED_MODULES)) {
      stateChanged = true;
    }
  }

  if (patchStateReferences()) {
    stateChanged = true;
  }

  if (patchReferenceTextarea()) {
    stateChanged = true;
  }

  patchRenderedModuleCards();

  if (stateChanged && typeof renderPreview === "function") {
    renderPreview();
  }

  if (stateChanged && typeof saveState === "function") {
    saveState();
  }
}

let publicationTitlesPatchTimer = 0;

function schedulePublicationTitlesPatch(delay = 0) {
  window.clearTimeout(publicationTitlesPatchTimer);
  publicationTitlesPatchTimer = window.setTimeout(() => {
    applyPublicationTitlesPatch();
  }, delay);
}

function installPublicationTitlesWatchers() {
  ["add-module", "add-custom-module", "save-browser", "print-pdf", "save-library"].forEach((id) => {
    const button = document.getElementById(id);
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      schedulePublicationTitlesPatch(50);
    });
  });

  const selectedModules = document.getElementById("selected-modules");
  if (selectedModules) {
    selectedModules.addEventListener("click", () => {
      schedulePublicationTitlesPatch(50);
    });

    const observer = new MutationObserver(() => {
      schedulePublicationTitlesPatch(50);
    });
    observer.observe(selectedModules, { childList: true, subtree: true });
  }

  const referencesField = document.getElementById("jsto-form")?.elements?.namedItem("references");
  if (referencesField) {
    referencesField.addEventListener("blur", () => {
      schedulePublicationTitlesPatch(0);
    });
  }
}

function initPublicationTitlesPatch() {
  applyPublicationTitlesPatch();
  installPublicationTitlesWatchers();
  schedulePublicationTitlesPatch(100);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPublicationTitlesPatch, { once: true });
} else {
  initPublicationTitlesPatch();
}
