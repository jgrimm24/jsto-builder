const PUBLICATION_REFERENCE_MAP = [
  {
    match: /DESR6055\.09_DAFMAN91-201/g,
    replacement: "DESR 6055.09_DAFMAN 91-201 - Explosives Safety Standards"
  },
  {
    match: /DAFMAN 91-203/g,
    replacement: "DAFMAN 91-203 - Air Force Occupational Safety, Fire and Health Standards"
  },
  {
    match: /DAFI 91-202/g,
    replacement: "DAFI 91-202 - The Department of the Air Force \(DAF\) Mishap Prevention Program"
  },
  {
    match: /AFI 90-821/g,
    replacement: "AFI 90-821 - Hazard Communication \(HAZCOM\) Program"
  },
  {
    match: /AFI 48-109/g,
    replacement: "AFI 48-109 - Electromagnetic Field Radiation \(EMFR\) Occupational and Environmental Health Program"
  },
  {
    match: /AFI 48-127/g,
    replacement: "AFI 48-127 - Occupational Noise and Hearing Conservation Program"
  },
  {
    match: /AFI 48-137/g,
    replacement: "DAFI 48-137 - Respiratory Protection Program"
  },
  {
    match: /AFI 48-139/g,
    replacement: "AFI 48-139 - Laser and Optical Radiation Protection Program"
  },
  {
    match: /AFI 48-145/g,
    replacement: "DAFI 48-145 - Occupational and Environmental Health Program"
  },
  {
    match: /AFI 48-148/g,
    replacement: "AFMAN 48-148 - Ionizing Radiation Protection"
  },
  {
    match: /AFMAN 48-146/g,
    replacement: "DAFMAN 48-146 - Occupational Health Program Management"
  },
  {
    match: /AFRCI 41-104/g,
    replacement: "AFRCI 41-104 - Professional Board and National Certification Examinations"
  },
  {
    match: /AF Form 2767/g,
    replacement: "AF Form 2767 - Occupational Health Training & Protective Equipment Fit Testing"
  }
];

function expandPublicationTitles(value) {
  let nextValue = String(value || "");
  PUBLICATION_REFERENCE_MAP.forEach(({ match, replacement }) => {
    nextValue = nextValue.replace(match, replacement);
  });
  return nextValue;
}

function patchModuleReferenceFields(module) {
  if (!module || typeof module !== "object") {
    return;
  }

  ["reference", "trainingSource", "afTrainingSource"].forEach((key) => {
    if (typeof module[key] === "string" && module[key]) {
      module[key] = expandPublicationTitles(module[key]);
    }
  });
}

function patchModuleCollection(collection) {
  if (!Array.isArray(collection)) {
    return;
  }

  collection.forEach((module) => {
    patchModuleReferenceFields(module);
  });
}

function patchStateReferences() {
  if (typeof state !== "object" || !state) {
    return;
  }

  patchModuleCollection(state.selectedModules);

  if (Array.isArray(state.moduleReferences)) {
    state.moduleReferences = state.moduleReferences.map((entry) => {
      if (typeof entry === "string") {
        return expandPublicationTitles(entry);
      }

      if (entry && typeof entry === "object") {
        const nextEntry = { ...entry };
        ["label", "value", "reference", "text", "title"].forEach((key) => {
          if (typeof nextEntry[key] === "string") {
            nextEntry[key] = expandPublicationTitles(nextEntry[key]);
          }
        });
        return nextEntry;
      }

      return entry;
    });
  }

  if (state.meta && typeof state.meta.references === "string") {
    state.meta.references = expandPublicationTitles(state.meta.references);
  }
}

function patchReferenceTextarea() {
  const form = document.getElementById("jsto-form");
  const referencesField = form?.elements?.namedItem("references");
  if (!referencesField || typeof referencesField.value !== "string") {
    return;
  }

  referencesField.value = expandPublicationTitles(referencesField.value);
}

function applyPublicationTitlesPatch() {
  if (typeof OPTIONAL_MODULES !== "undefined") {
    patchModuleCollection(OPTIONAL_MODULES);
  }

  if (typeof REQUIRED_MODULES !== "undefined") {
    patchModuleCollection(REQUIRED_MODULES);
  }

  patchStateReferences();
  patchReferenceTextarea();

  if (typeof renderSelectedModules === "function") {
    renderSelectedModules();
  }

  if (typeof renderPreview === "function") {
    renderPreview();
  }

  if (typeof saveState === "function") {
    saveState();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyPublicationTitlesPatch, { once: true });
} else {
  applyPublicationTitlesPatch();
}
