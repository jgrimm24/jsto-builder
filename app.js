const defaultMeta = {
  unit: "",
  workCenter: "",
  officeSymbol: "",
  supervisor: "",
  reviewer: "",
  reviewDate: new Date().toISOString().slice(0, 10),
  effectiveDate: new Date().toISOString().slice(0, 10),
  description: "",
  references: "",
  jhaNotes: "",
  emergencyNumbers: "",
  medicalFacility: "",
  evacuationRoute: "",
  shelterInPlace: "",
  activeShooterMethods: "",
  adverseWeatherShelter: "",
  fireEquipmentNotes: "",
  safetyBoardLocation: "",
  trafficSafetyNotes: "",
  trafficContacts: "",
  annualReviewLog: "",
  documentNotes: "",
  exportBasename: "",
  uploadedBy: "",
  uploadedById: "",
  dafvaPostingLocation: ""
};

const moduleCatalog = [
  {
    id: "14.1.3.1",
    title: "Hazardous Energy Control",
    reference: "DAFMAN 91-203, Chapter 21; 29 CFR 1910.147",
    trainingRequirement: "Train authorized employees to recognize hazardous energy sources, the type and magnitude of energy present, and the methods and means for isolation and control. Train affected employees on the purpose and use of lockout/tagout procedures, and instruct all other employees on the prohibition against restarting locked or tagged equipment.",
    afTrainingRequirement: "Document initial and refresher training when job assignments, machines, processes, or energy control procedures change, or when inspections show employee knowledge gaps.",
    trainingBasis: "OSHA 2254 / Lockout-Tagout",
    afTrainingBasis: "DAFMAN 91-203 / Hazardous Energy Control"
  },
  {
    id: "14.1.3.2",
    title: "Hazard Communication",
    reference: "DAFI 90-821; 29 CFR 1910.1200",
    trainingRequirement: "Train personnel on hazardous chemicals in their work area, labeling systems, safety data sheets, and the measures they can take to protect themselves during normal operations and foreseeable emergencies.",
    afTrainingRequirement: "Provide HazCom training upon initial assignment, whenever a new chemical hazard is introduced, and when new tasks expose workers to different hazardous materials. Ensure workers know how to access local SDS information and labeling guidance.",
    trainingBasis: "OSHA 2254 / Hazard Communication",
    afTrainingBasis: "DAFMAN 91-203 / Hazard Communication"
  },
  {
    id: "14.1.3.3",
    title: "Bloodborne Pathogens",
    reference: "29 CFR 1910.1030",
    trainingRequirement: "Provide bloodborne pathogens training at initial assignment and at least annually thereafter, covering exposure control, modes of transmission, and protective measures.",
    afTrainingRequirement: "Enroll applicable workers in the local bloodborne pathogens program and ensure exposure control plan requirements, reporting actions, and PPE procedures are covered before task performance.",
    trainingBasis: "OSHA 2254 / Bloodborne Pathogens",
    afTrainingBasis: "DAFMAN 91-203 / Bloodborne Pathogens"
  },
  {
    id: "14.1.3.4",
    title: "Hearing Conservation",
    reference: "DAFI 48-127; 29 CFR 1910.95",
    trainingRequirement: "Train noise-exposed employees annually on the effects of noise, the purpose of hearing protectors, the advantages and disadvantages of various protectors, and the purpose of audiometric testing.",
    afTrainingRequirement: "Ensure workers enrolled in hearing conservation understand noise hazard areas, double-hearing protection requirements, and local follow-up actions tied to occupational health evaluations.",
    trainingBasis: "OSHA 2254 / Occupational Noise Exposure",
    afTrainingBasis: "DAFMAN 91-203 / Hearing Conservation"
  },
  {
    id: "14.1.3.5",
    title: "Confined Space Program",
    reference: "DAFMAN 91-203, Chapter 23; 29 CFR 1910.146",
    trainingRequirement: "Train entrants, attendants, supervisors, and rescue personnel so they understand their duties, hazards, signs and symptoms of exposure, communication procedures, and emergency actions before assignment.",
    afTrainingRequirement: "Provide duty-specific training for permit-required confined space roles, including monitor use, atmospheric hazards, entry permits, and rescue responsibilities before personnel participate in entries.",
    trainingBasis: "OSHA 2254 / Permit-Required Confined Spaces",
    afTrainingBasis: "DAFMAN 91-203 / Confined Spaces"
  },
  {
    id: "14.1.3.6",
    title: "Manual and Powered Hoists",
    reference: "DAFMAN 91-203, Chapter 35",
    trainingRequirement: "Provide task-specific training on safe use, load limits, inspections, and operating procedures before workers use hoists in material handling operations.",
    afTrainingRequirement: "Use local lesson plans or manufacturer instructions to cover pre-use inspections, operator limitations, suspended-load controls, and maintenance reporting requirements.",
    trainingBasis: "Local / Manufacturer Guidance",
    afTrainingBasis: "DAFMAN 91-203 / Material Handling Equipment"
  },
  {
    id: "14.1.3.7",
    title: "Respiratory Protection Program",
    reference: "DAFI 48-137; 29 CFR 1910.134",
    trainingRequirement: "Train users before respirator use and at least annually on why the respirator is necessary, how improper fit or maintenance can compromise protection, and how to inspect, don, doff, use, and store the respirator.",
    afTrainingRequirement: "Document fit testing and occupational health training on AF Form 2767 and ensure wearers understand emergency-use limits, cartridge change-out, cleaning, and medical qualification requirements.",
    trainingBasis: "OSHA 2254 / Respiratory Protection",
    afTrainingBasis: "DAFMAN 91-203 / Respiratory Protection"
  },
  {
    id: "14.1.3.8",
    title: "Vehicle Mounted Elevated Work Platforms",
    reference: "DAFMAN 91-203, Chapter 16",
    trainingRequirement: "Provide model-specific training, safe operating procedures, fall protection expectations, and emergency lowering actions before use of elevated work platforms.",
    afTrainingRequirement: "Use locally approved lesson plans with hands-on demonstration, written testing, and supervisor certification before operators use mobile elevating work platforms.",
    trainingBasis: "Local / Manufacturer Guidance",
    afTrainingBasis: "DAFMAN 91-203 / Mobile Elevating Work Platforms"
  },
  {
    id: "14.1.3.9",
    title: "Fall Arrest Systems",
    reference: "DAFMAN 91-203, Chapter 13; 29 CFR 1910.66; 29 CFR 1926.503",
    trainingRequirement: "Train employees exposed to fall hazards to recognize fall hazards and the procedures to minimize them, including use and inspection of fall arrest systems.",
    afTrainingRequirement: "Cover anchorage selection, rescue planning, and equipment inspections before personnel use personal fall arrest systems in assigned tasks.",
    trainingBasis: "OSHA 2254 / Walking-Working Surfaces and Fall Protection",
    afTrainingBasis: "DAFMAN 91-203 / Fall Protection"
  },
  {
    id: "14.1.3.10",
    title: "Forklift / Material Handling Equipment",
    reference: "DAFMAN 91-203, Chapter 35; 29 CFR 1910.178",
    trainingRequirement: "Train powered industrial truck operators in truck-related and workplace-related topics, evaluate performance, and conduct refresher training when unsafe operation, incidents, or workplace changes occur.",
    afTrainingRequirement: "Use approved lesson plans, hands-on evaluation, and recurring reevaluation before certifying operators. Cover spotter requirements, aircraft proximity rules, and local route restrictions.",
    trainingBasis: "OSHA 2254 / Powered Industrial Trucks",
    afTrainingBasis: "DAFMAN 91-203 / Material Handling Equipment"
  },
  {
    id: "14.1.3.11",
    title: "Explosives Safety Training",
    reference: "DESR6055.09_DAFMAN91-201; DAFI 91-202",
    trainingRequirement: "Use explosives-specific AF lesson plans and local operating instructions. OSHA 2254 includes transportation and explosives references, but the Air Force explosives program should remain the primary training basis for this module.",
    afTrainingRequirement: "Provide initial and task-specific explosives safety training using approved lesson plans, local instructions, and quantity-distance / compatibility controls before personnel work with explosives.",
    trainingBasis: "OSHA 2254 / Explosives and Transportation References",
    afTrainingBasis: "DESR6055.09_DAFMAN91-201 / local procedures"
  },
  {
    id: "14.1.3.12",
    title: "Pole / Tower Climbing",
    reference: "DAFMAN 91-203, Chapter 30",
    trainingRequirement: "Provide climbing safety, fall protection, rescue, and equipment inspection training before employees climb poles or towers.",
    afTrainingRequirement: "Ensure workers complete certification, recurring refresher training, and rescue requirements with records maintained for climbing qualification.",
    trainingBasis: "Local / Manufacturer Guidance",
    afTrainingBasis: "DAFMAN 91-203 / Communication Cable, Antenna, and Communication Systems"
  },
  {
    id: "14.1.3.13",
    title: "CPR Training",
    reference: "DAFMAN 91-203, Chapter 1",
    trainingRequirement: "Provide CPR and AED training before assignment where required, and refresh qualification before expiration.",
    afTrainingRequirement: "Ensure designated responders maintain current certification and understand location and use of local AED assets under the unit mishap prevention program.",
    trainingBasis: "Local / First Aid Program",
    afTrainingBasis: "DAFMAN 91-203 / Emergency Response and CPR"
  },
  {
    id: "14.1.3.14",
    title: "Flight Line Driving",
    reference: "DAFMAN 91-203, Chapter 24",
    trainingRequirement: "Provide local flight line driving rules, markings, vehicle lighting requirements, restricted areas, and aircraft hazard awareness before granting driving privileges.",
    afTrainingRequirement: "Use installation or unit-approved training and certification for airfield/fight line operations, to include local speed, spotter, and no-lone-zone requirements.",
    trainingBasis: "Local / Installation Guidance",
    afTrainingBasis: "DAFMAN 91-203 / Aircraft Flight Line – Ground Operations and Activities"
  },
  {
    id: "14.1.3.15",
    title: "Fetal Protection Program",
    reference: "DAFMAN 48-146",
    trainingRequirement: "Provide job-specific hazard awareness for reproductive health risks where occupational exposures may affect pregnant workers or fetuses.",
    afTrainingRequirement: "Use occupational and environmental health guidance to discuss declaration options, exposure review, and local work restriction procedures.",
    trainingBasis: "Local / Occupational Health Guidance",
    afTrainingBasis: "DAFMAN 48-146 / Fetal Protection"
  },
  {
    id: "14.1.3.16",
    title: "Medical Surveillance Examination",
    reference: "AFI 48-145",
    trainingRequirement: "Ensure workers understand when medical surveillance examinations are required, how they are scheduled, and why participation is tied to specific exposures.",
    afTrainingRequirement: "Cover local scheduling, reporting, and follow-up processes for required occupational and environmental health evaluations.",
    trainingBasis: "Local / Occupational Health Guidance",
    afTrainingBasis: "AFI 48-145 / Medical Surveillance"
  },
  {
    id: "14.1.3.17",
    title: "Electromagnetic Field Training",
    reference: "DAFI 48-109",
    trainingRequirement: "Provide task-specific training on electromagnetic field hazards, posting requirements, access controls, and reporting expectations where EMF sources are present.",
    afTrainingRequirement: "Use approved EMF hazard assessments and local instructions to brief workers on hazard zones, signs, and restrictions before exposure.",
    trainingBasis: "Local / EMF Program Guidance",
    afTrainingBasis: "DAFI 48-109 / EMF"
  },
  {
    id: "14.1.3.18",
    title: "Laser Safety Training",
    reference: "DAFI 48-139",
    trainingRequirement: "Provide laser hazard awareness, eyewear, posting, alignment, and beam-control training before personnel work with lasers or enter laser-controlled areas.",
    afTrainingRequirement: "Use local laser safety officer guidance and approved operating instructions to cover exposure limits, alignment procedures, and emergency actions.",
    trainingBasis: "Local / Laser Safety Guidance",
    afTrainingBasis: "DAFI 48-139 / Laser and Optical Radiation Protection"
  },
  {
    id: "14.1.3.19",
    title: "ALARA Ionizing Radiation Training",
    reference: "DAFI 48-148",
    trainingRequirement: "Train personnel on the ALARA concept, exposure minimization, posting requirements, and emergency actions before working with ionizing radiation sources.",
    afTrainingRequirement: "Use local radiation safety office guidance to cover dose control, exposure tracking, and access requirements for designated radiation areas.",
    trainingBasis: "OSHA 2254 / Ionizing Radiation",
    afTrainingBasis: "DAFI 48-148 / Ionizing Radiation Protection"
  },
  {
    id: "local-1",
    title: "Ladder Safety",
    reference: "DAFMAN 91-203, Chapter 7",
    trainingRequirement: "Train workers to inspect ladders before use, maintain three points of contact, set ladders on stable surfaces, and avoid overreaching or using damaged ladders.",
    afTrainingRequirement: "Provide hands-on ladder safety training at first assignment, including local storage, damaged-tag procedures, and fall prevention expectations.",
    trainingBasis: "OSHA 2254 / Walking-Working Surfaces",
    afTrainingBasis: "DAFMAN 91-203 / Ladders"
  },
  {
    id: "local-2",
    title: "Active Shooter Response",
    reference: "Installation emergency management guidance / local procedures",
    trainingRequirement: "Brief personnel on how to recognize an active shooter event, how to summon help, and how to apply local run-hide-fight guidance based on the facility layout.",
    afTrainingRequirement: "Use local emergency response procedures, shelter locations, and mass notification methods applicable to the duty location.",
    trainingBasis: "Local / Emergency Management Guidance",
    afTrainingBasis: "Installation / Unit Active Shooter Procedures"
  },
  {
    id: "local-3",
    title: "Government Vehicle / Utility Vehicle Use",
    reference: "DAFI 91-207; local procedures",
    trainingRequirement: "Train vehicle operators on seat belts, speed limits, local traffic hazards, spotter use while backing, and restrictions on electronic device use while driving.",
    afTrainingRequirement: "Brief operators on unit-specific government vehicle training requirements, local route restrictions, low-speed vehicle rules, and documentation of qualification.",
    trainingBasis: "OSHA 2254 / Vehicle and Mobile Equipment Concepts",
    afTrainingBasis: "DAFI 91-207 / local traffic safety procedures"
  },
  {
    id: "local-4",
    title: "Risk Management Fundamentals",
    reference: "DAFI 90-802; DAFPAM 90-803",
    trainingRequirement: "Train workers to identify hazards, assess risk, implement controls, supervise the task, and re-evaluate controls during and after operations.",
    afTrainingRequirement: "Use the DAF risk management process to discuss local hazard reporting, supervisor involvement, and integration into routine tasks.",
    trainingBasis: "Local / Risk Management Guidance",
    afTrainingBasis: "DAFI 90-802 / DAFPAM 90-803"
  },
  {
    id: "local-5",
    title: "Manual Lifting and Material Handling",
    reference: "DAFMAN 91-203, Chapter 20",
    trainingRequirement: "Train workers on proper lifting techniques, team lifting, load assessment, and use of lifting aids to reduce musculoskeletal injury risk.",
    afTrainingRequirement: "Provide verbal and written guidance on manual lifting, lifting devices, and local reporting actions for strain or overexertion symptoms.",
    trainingBasis: "OSHA 2254 / Ergonomics and Material Handling Concepts",
    afTrainingBasis: "DAFMAN 91-203 / Manual Materials Handling"
  },
  {
    id: "local-6",
    title: "Fire Protection and Prevention",
    reference: "DAFMAN 91-203; local fire prevention plan",
    trainingRequirement: "Train personnel on fire hazards, reporting procedures, extinguisher locations, evacuation routes, pull stations, and local emergency response actions.",
    afTrainingRequirement: "Use the JSTO and local fire prevention plan to brief workers on work-center fire hazards, alarm reporting, extinguisher use, and evacuation accountability.",
    trainingBasis: "OSHA 2254 / Fire Protection",
    afTrainingBasis: "DAFMAN 91-203 / Fire Prevention"
  },
  {
    id: "local-7",
    title: "Jewelry / Loose Articles Restrictions",
    reference: "Local procedures / equipment guidance",
    trainingRequirement: "Train workers on removing jewelry and securing loose articles when working around machinery, electrical hazards, rotating equipment, or snag hazards.",
    afTrainingRequirement: "Use local work-center restrictions and equipment guidance to define prohibited items and exceptions for mission-essential tasks.",
    trainingBasis: "Local / Equipment Guidance",
    afTrainingBasis: "Shop-specific safety restrictions"
  },
  {
    id: "custom-other",
    title: "Other",
    reference: "Local / Custom module",
    trainingRequirement: "Use this option when a unit-specific hazard, certification, or recurring training requirement is not already listed in the JSTO catalog.",
    afTrainingRequirement: "Document the governing reference, training location, and how completion is tracked for this custom module.",
    trainingBasis: "Custom / Local requirement",
    afTrainingBasis: "Custom / Local requirement"
  }
];

const defaultState = {
  meta: { ...defaultMeta },
  unitImage: {
    name: "",
    dataUrl: ""
  },
  dafsmsImage: {
    name: "",
    dataUrl: ""
  },
  evacuationImage: {
    name: "",
    dataUrl: ""
  },
  emergencyEquipmentFiles: [],
  mishapReportingFiles: [],
  gvoRiskFiles: [],
  form1118Files: [],
  bioSurvey: {
    name: "",
    dataUrl: "",
    type: ""
  },
  moduleReferences: [
    {
      code: "14.1.2.1",
      title: "Workplace Hazards"
    },
    {
      code: "14.1.2.2",
      title: "Personal Protective Equipment"
    },
    {
      code: "14.1.2.3",
      title: "Emergency Action and Fire Prevention"
    },
    {
      code: "14.1.2.4",
      title: "Reporting Unsafe Equipment, Conditions, or Procedures"
    },
    {
      code: "14.1.2.5",
      title: "Mishap, Occupational Injury, and Illness Reporting"
    },
    {
      code: "14.1.2.6",
      title: "CA-10 and LS-201"
    },
    {
      code: "14.1.2.7",
      title: "DAF Traffic Safety Program"
    },
    {
      code: "14.1.2.8",
      title: "DAFVA 91-209 Location and Content"
    },
    {
      code: "14.1.2.9",
      title: "DAFSMS Responsibilities"
    }
  ],
  selectedModules: []
};

const STORAGE_KEY = "jsto-outline-builder-v20260503-1";
const fieldEditorModal = document.getElementById("field-editor-modal");
const fieldEditorTitle = document.getElementById("field-editor-title");
const fieldEditorText = document.getElementById("field-editor-text");
const fieldEditorSave = document.getElementById("field-editor-save");
const fieldEditorCancel = document.getElementById("field-editor-cancel");
const fieldEditorClose = document.getElementById("field-editor-close");
const expandableFieldNames = new Set([
  "emergencyNumbers",
  "medicalFacility",
  "evacuationRoute",
  "shelterInPlace",
  "activeShooterMethods",
  "adverseWeatherShelter",
  "safetyBoardLocation"
]);
let activeExpandableField = null;
let state = loadState();
const form = document.getElementById("outline-form");
const preview = document.getElementById("preview");
const selectedModulesContainer = document.getElementById("selected-modules");
const moduleTemplate = document.getElementById("module-template");
const moduleSelect = document.getElementById("module-select");
const addModuleButton = document.getElementById("add-module");
const customModuleFields = document.getElementById("custom-module-fields");
const customModuleTitleInput = document.getElementById("custom-module-title");
const customModuleReferenceInput = document.getElementById("custom-module-reference");
const addCustomModuleButton = document.getElementById("add-custom-module");
const unitImageInput = document.getElementById("unit-image-file");
const unitImageStatus = document.getElementById("unit-image-status");
const removeUnitImageButton = document.getElementById("remove-unit-image");
const unitImageStage = document.getElementById("unit-image-stage");
const dafsmsImageInput = document.getElementById("dafsms-image-file");
const dafsmsImageStatus = document.getElementById("dafsms-image-status");
const removeDafsmsImageButton = document.getElementById("remove-dafsms-image");
const evacuationImageInput = document.getElementById("evacuation-image-file");
const evacuationImageStatus = document.getElementById("evacuation-image-status");
const removeEvacuationImageButton = document.getElementById("remove-evacuation-image");
const emergencyEquipmentFilesInput = document.getElementById("emergency-equipment-files");
const emergencyEquipmentFilesStatus = document.getElementById("emergency-equipment-files-status");
const removeEmergencyEquipmentFilesButton = document.getElementById("remove-emergency-equipment-files");
const mishapReportingFilesInput = document.getElementById("mishap-reporting-files");
const mishapReportingFilesStatus = document.getElementById("mishap-reporting-files-status");
const removeMishapReportingFilesButton = document.getElementById("remove-mishap-reporting-files");
const gvoRiskFilesInput = document.getElementById("gvo-risk-files");
const gvoRiskFilesStatus = document.getElementById("gvo-risk-files-status");
const removeGvoRiskFilesButton = document.getElementById("remove-gvo-risk-files");
const form1118FilesInput = document.getElementById("form-1118-files");
const form1118Status = document.getElementById("form-1118-status");
const removeForm1118FilesButton = document.getElementById("remove-form-1118-files");
const bioSurveyInput = document.getElementById("bio-survey-file");
const bioSurveyStatus = document.getElementById("bio-survey-status");
const removeBioSurveyButton = document.getElementById("remove-bio-survey");
const libraryIdentityInput = document.getElementById("library-identity");
const LIBRARY_IDENTITY_KEY = "jsto-library-identity-v1";
const renderedPdfPageCache = new Map();
const libraryOwnership = window.__jstoLibraryOwnership || {
  normalizeIdentity(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  },
  normalizeIdentityKey(value) {
    return this.normalizeIdentity(value)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }
};
const storageIdentity = readLibraryIdentity();
if (!state.meta.uploadedBy && storageIdentity) {
  state.meta.uploadedBy = storageIdentity;
}
state.meta.uploadedById = normalizeLibraryIdentity(state.meta.uploadedBy);
const LIBRARY_UPLOAD_URL = String(window.JSTO_LIBRARY_UPLOAD_URL || "").trim().replace(/\/$/, "");

initialize();

function initialize() {
  populateModuleSelect();
  hydrateForm();
  syncLibraryIdentityField();
  renderSelectedModules();
  renderUnitImageStatus();
  renderUnitImagePreview();
  renderDafsmsImageStatus();
  renderEvacuationImageStatus();
  renderEmergencyEquipmentFilesStatus();
  renderMishapReportingFilesStatus();
  renderGvoRiskStatus();
  renderForm1118Status();
  renderBioSurveyStatus();
  renderPreview();
  wireEvents();
  loadLibraryStateFromUrl();
}

function normalizeLoadedState(rawState) {
  const container = rawState && typeof rawState === "object" ? rawState : {};
  const parsed = container.state && typeof container.state === "object" ? container.state : container;
  const parsedSelectedModules = Array.isArray(parsed.selectedModules) ? parsed.selectedModules : [];
  const migratedRiskManagementModule = parsedSelectedModules.find((module) => module?.id === "local-4");

  return {
    ...parsed,
    meta: {
      ...defaultState.meta,
      ...(parsed.meta || {}),
      riskManagementNotes: parsed?.meta?.riskManagementNotes || migratedRiskManagementModule?.notes || defaultState.meta.riskManagementNotes
    },
    unitImage: {
      ...defaultState.unitImage,
      ...(parsed.unitImage || {})
    },
    dafsmsImage: {
      ...defaultState.dafsmsImage,
      ...(parsed.dafsmsImage || {})
    },
    evacuationImage: {
      ...defaultState.evacuationImage,
      ...(parsed.evacuationImage || {})
    },
    emergencyEquipmentFiles: Array.isArray(parsed.emergencyEquipmentFiles) ? parsed.emergencyEquipmentFiles : [],
    mishapReportingFiles: Array.isArray(parsed.mishapReportingFiles) ? parsed.mishapReportingFiles : [],
    gvoRiskFiles: Array.isArray(parsed.gvoRiskFiles) ? parsed.gvoRiskFiles : [],
    form1118Files: Array.isArray(parsed.form1118Files) ? parsed.form1118Files : [],
    bioSurvey: {
      ...defaultState.bioSurvey,
      ...(parsed.bioSurvey || {})
    },
    moduleReferences: Array.isArray(parsed.moduleReferences) ? parsed.moduleReferences : [],
    selectedModules: parsedSelectedModules.filter((module) => module?.id !== "local-4")
  };
}

function loadState() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return JSON.parse(JSON.stringify(defaultState));
  }

  try {
    const parsed = JSON.parse(stored);
    return normalizeLoadedState(parsed);
  } catch {
    return JSON.parse(JSON.stringify(defaultState));
  }
}

function saveState() {
  if (!state.meta.uploadedBy) {
    state.meta.uploadedBy = readLibraryIdentity();
  }
  state.meta.uploadedById = normalizeLibraryIdentity(state.meta.uploadedBy);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function readLibraryIdentity() {
  try {
    return String(window.localStorage.getItem(LIBRARY_IDENTITY_KEY) || "").trim();
  } catch {
    return "";
  }
}

function writeLibraryIdentity(value) {
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

function normalizeLibraryIdentity(value) {
  return libraryOwnership.normalizeIdentityKey
    ? libraryOwnership.normalizeIdentityKey(value)
    : libraryOwnership.normalizeIdentity(value);
}

function syncLibraryIdentityField() {
  if (!libraryIdentityInput) {
    return;
  }

  const fallbackIdentity = readLibraryIdentity();
  if (!state.meta.uploadedBy && fallbackIdentity) {
    state.meta.uploadedBy = fallbackIdentity;
  }

  libraryIdentityInput.value = state.meta.uploadedBy || "";
}

function populateModuleSelect() {
  moduleCatalog.forEach((module) => {
    const option = document.createElement("option");
    option.value = module.id;
    option.textContent = module.title;
    moduleSelect.append(option);
  });
}

function hydrateForm() {
  const elements = Array.from(form.elements).filter((field) => field.name);
  elements.forEach((field) => {
    field.value = state.meta[field.name] || "";
  });
}

function renderSelectedModules() {
  if (!state.selectedModules.length) {
    selectedModulesContainer.innerHTML = "";
    return;
  }

  selectedModulesContainer.innerHTML = "";

  state.selectedModules.forEach((module, index) => {
    const fragment = moduleTemplate.content.cloneNode(true);
    const article = fragment.querySelector(".module-card");
    article.dataset.index = String(index);
    fragment.querySelector(".module-title").textContent = module.title;
    fragment.querySelector(".module-reference").textContent = module.reference;
    const trainingSource = fragment.querySelector(".module-training-source");
    const trainingRequirement = fragment.querySelector(".module-training-requirement");
    const afSource = fragment.querySelector(".module-af-source");
    const afRequirement = fragment.querySelector(".module-af-requirement");
    trainingSource.textContent = `Training basis: ${module.trainingBasis}`;
    trainingRequirement.textContent = module.trainingRequirement;
    afSource.textContent = `DAF basis: ${module.afTrainingBasis}`;
    afRequirement.textContent = module.afTrainingRequirement;
    fragment.querySelector(".module-notes").value = module.notes || "";
    fragment.querySelector(".module-link").value = module.link || "";
    selectedModulesContainer.append(fragment);
  });
}

function renderPreview() {
  preview.innerHTML = `
    <div class="preview-header">
      <div>
        <h1>Job Safety Training Outline</h1>
        <p class="muted">Built to align with DAFI 91-202 paragraph 14.1 requirements.</p>
      </div>
      ${renderUnitImageForPreview()}
    </div>

    <div class="preview-grid two-up compact">
      <p><strong>Unit:</strong> ${escapeHtml(state.meta.unit || "Not entered")}</p>
      <p><strong>Work Center:</strong> ${escapeHtml(state.meta.workCenter || "Not entered")}</p>
      <p><strong>Work Area / Office Symbol:</strong> ${escapeHtml(state.meta.officeSymbol || "Not entered")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(state.meta.phone || "Not entered")}</p>
      <p><strong>Supervisor:</strong> ${escapeHtml(state.meta.supervisor || "Not entered")}</p>
      <p><strong>Reviewer:</strong> ${escapeHtml(state.meta.reviewer || "Not entered")}</p>
      <p><strong>Review Date:</strong> ${escapeHtml(state.meta.reviewDate || "Not entered")}</p>
      <p><strong>Effective Date:</strong> ${escapeHtml(state.meta.effectiveDate || "Not entered")}</p>
    </div>

    <section>
      <h2>Work Center Overview</h2>
      <p>${formatText(state.meta.description, "Describe the mission, operating area, and the tasks covered by this JSTO.")}</p>
    </section>

    <section>
      <h2>Required Training Topics</h2>
      <div class="pill-grid">
        ${state.moduleReferences.map((item) => `<span class="pill">${escapeHtml(item.title)}</span>`).join("")}
      </div>
      <ul>
        <li><strong>Workplace hazards:</strong> Describe crushing, burn, chemical, ladder, weather, flight line, and noise hazards specific to the work center, plus the technical orders, JHAs, and instructions workers must follow.</li>
        <li><strong>Personal protective equipment:</strong> Train employees on required PPE, including donning, doffing, cleaning, maintenance, storage, disposal, and reporting contact-lens or medical issues that could affect wear.</li>
        <li><strong>Emergency action and fire prevention:</strong> Cover alarms, AEDs, extinguishers, evacuation routes, shelter locations, and response procedures tied to the work center.</li>
        <li><strong>Reporting unsafe conditions:</strong> Instruct personnel to report unsafe equipment, conditions, procedures, and injuries without fear of reprisal, including use of DAF Form 457 and applicable reporting channels.</li>
        <li><strong>Mishap / injury / illness reporting:</strong> Explain on-duty and off-duty reporting requirements, medical treatment procedures, and emergency response contacts.</li>
        <li><strong>Traffic safety:</strong> Brief seat belt, speed limit, spotter, electronic device, and motorcycle safety requirements applicable to the work center.</li>
        <li><strong>DAFVA 91-209 and DAFSMS:</strong> Review the location of DAFVA 91-209 and how workers contribute to the unit safety management system.</li>
      </ul>
      ${renderHierarchyOfControls()}
      ${renderActiveShooterSection()}
      ${renderDafsmsSection()}
    </section>

    <section>
      <h2>Job-Specific A La Carte Modules</h2>
      <p>${state.selectedModules.length ? "The following modules apply to this work center and should be reviewed with trainees before task performance." : "No job-specific modules selected yet."}</p>
      <div class="pill-grid">
        ${state.selectedModules.map((module) => `<span class="pill secondary">${escapeHtml(module.title)}</span>`).join("") || '<span class="pill ghost">No modules selected</span>'}
      </div>
      ${renderOptionalModuleDetails()}
    </section>

    <section>
      <h2>References</h2>
      <p>${formatText(state.meta.references, "Enter TOs, JHAs, DAFIs, DAFMANs, local guidance, and manufacturer instructions used by this work center.")}</p>
    </section>

    <section>
      <h2>Required Documents</h2>
      ${renderRequiredDocuments()}
    </section>

    <section>
      <h2>Emergency Information</h2>
      <ul>
        <li><strong>Emergency Numbers:</strong> ${formatText(state.meta.emergencyNumbers, "Not entered")}</li>
        <li><strong>Medical Facility / Treatment:</strong> ${formatText(state.meta.medicalFacility, "Not entered")}</li>
        <li><strong>Evacuation / Muster Point:</strong> ${formatText(state.meta.evacuationRoute, "Not entered")}</li>
        <li><strong>Shelter in Place:</strong> ${formatText(state.meta.shelterInPlace, "Not entered")}</li>
        <li><strong>Active Shooter Response Methods:</strong> ${formatText(state.meta.activeShooterMethods, "Not entered")}</li>
        <li><strong>Adverse Weather Shelter:</strong> ${formatText(state.meta.adverseWeatherShelter, "Not entered")}</li>
      </ul>
      ${renderEvacuationImageForPreview()}
    </section>

    <section>
      <h2>Emergency Equipment and Safety Board</h2>
      <p><strong>Safety Bulletin Board Location:</strong> ${formatText(state.meta.safetyBoardLocation, "Not entered")}</p>
      <p>${formatText(state.meta.fireEquipmentNotes, "List fire pull stations, extinguishers, power cutoffs, eyewash stations, AEDs, foam systems, and any local fire/emergency equipment notes.")}</p>
      ${renderEmergencyEquipmentFilesPreview()}
    </section>

    <section>
      <h2>Traffic Safety Program</h2>
      ${renderTrafficSafetyProgram()}
    </section>

    <section>
      <h2>Reporting Unsafe Equipment, Conditions, or Procedures</h2>
      <p>Notify the supervisor immediately when unsafe equipment, conditions, or procedures are identified. Personnel may report hazards without fear of retaliation, coercion, discrimination, or reprisal.</p>
      <ul>
        <li><strong>DAF Form 457:</strong> Use to document and elevate unsafe conditions, equipment, or processes.</li>
        <li><strong>SAFEREP:</strong> Use the approved mishap or hazard reporting channel for additional reporting when directed by local procedures.</li>
      </ul>
      <div class="unsafe-tag-gallery">
        <img src="assets/AF Form 979.jpg?v=20260603-1" alt="Danger tag reference">
        <img src="assets/AF Form 980.jpg?v=20260603-1" alt="Caution tag reference">
        <img src="assets/AF Form 981.jpg?v=20260603-1" alt="Out of order tag reference">
        <img src="assets/AF Form 982.png?v=20260603-1" alt="Do not start tag reference">
      </div>
      ${renderMishapReportingFilesPreview()}
    </section>

    <section>
      <h2>Documentation and Review</h2>
      <p>${formatText(state.meta.documentNotes, "Document initial, refresher, and task-specific training in the work center record, review annually or when work conditions change, and maintain records per local records management requirements.")}</p>
      ${renderBioSurveyPreview()}
      <p><strong>Annual Review Log:</strong><br>${formatText(state.meta.annualReviewLog, "Record the supervisor annual review history here.")}</p>
      ${renderAnnualReviewLogTable()}
    </section>
  `;

  renderEmbeddedPdfPages();
}

function renderAnnualReviewLogTable() {
  return `
    <div class="annual-review-table-wrap">
      <table class="annual-review-table">
        <thead>
          <tr>
            <th>Trainee Name</th>
            <th>Employee ID / Last 4</th>
            <th>Date Trained</th>
            <th>Trainer / Supervisor</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: 6 }).map(() => `
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTrafficSafetyProgram() {
  return `
    <div class="traffic-safety-block">
      <p><strong>DAF Traffic Safety Program (DAFI 91-207):</strong> Train personnel on mandatory use of seat belts and helmets, speed limits, local traffic hazards, spotters while backing, vehicle training requirements, and restrictions on electronic device use while operating vehicles on- or off-base.</p>
      <p><strong>Seat Belts / Occupant Restraints:</strong> All persons operating or riding in motor vehicles must wear installed restraint systems as prescribed by the manufacturer. Drivers are responsible for ensuring all passengers are briefed on and use required restraints.</p>
      <p><strong>Motorcycle / ATV Training:</strong> Personnel must complete required safety training before riding a motorcycle, and local units should address required PPE, licensing, refresher training, and safety representative contacts.</p>
      <p><strong>Pedestrian / Bicycle Awareness:</strong> Emphasize local roadway crossing hazards, visibility requirements, spotter use, and other pedestrian or bicycle precautions specific to the installation.</p>
      <p><strong>Local Traffic Hazards / Vehicle Notes:</strong><br>${formatText(state.meta.trafficSafetyNotes, "Enter local gate hazards, base-specific traffic concerns, spotter rules, and where vehicle training is documented.")}</p>
      <p><strong>Motorcycle Safety Representatives / Traffic Contacts:</strong><br>${formatText(state.meta.trafficContacts, "List unit or group motorcycle safety representatives, traffic safety contacts, and local rider briefing requirements.")}</p>
      <div class="traffic-safety-image-wrap">
        <img class="traffic-safety-image" src="assets/motorcycle.png?v=20260603-1" alt="Motorcycle safety reference image">
      </div>
      ${renderGvoRiskPreview()}
    </div>
  `;
}

function renderDafsmsSection() {
  const pillarImageMarkup = state.dafsmsImage.dataUrl
    ? `
      <figure class="dafsms-reference-image-wrap">
        <img class="dafsms-reference-image" src="${state.dafsmsImage.dataUrl}" alt="DAFSMS reference image">
      </figure>
    `
    : `
      <figure class="dafsms-reference-image-wrap">
        <img class="dafsms-reference-image" src="assets/dafsms-pillars.png?v=20260504-1" alt="Department of the Air Force Safety Management System pillars">
      </figure>
    `;

  return `
    <div class="dafsms-block">
      <div class="dafsms-header">
        <h4>DAFSMS Framework</h4>
        <p>DAFSMS uses four pillars and the DAFSMS framework to structure the mishap prevention program through continuous improvement and the Plan-Do-Check-Act model.</p>
      </div>
      ${pillarImageMarkup}
      <div class="dafsms-pillars-grid">
        <article class="dafsms-pillar-card">
          <h5>Policy and Leadership</h5>
          <p>Safety policy provides the structure for a proactive mishap prevention program. Active leadership involvement at every level is critical to implementation and sustained execution.</p>
        </article>
        <article class="dafsms-pillar-card">
          <h5>Risk Management</h5>
          <p>Integrate risk management into all safety-related activities so hazards are identified early, controls are implemented, and the safety culture stays proactive.</p>
        </article>
        <article class="dafsms-pillar-card">
          <h5>Assurance</h5>
          <p>Use evaluations, monitoring, and review processes to measure conformance to standards and drive continuous improvement across the mishap prevention program.</p>
        </article>
        <article class="dafsms-pillar-card">
          <h5>Promotion, Education, and Training</h5>
          <p>Provide safety awareness, embed ongoing training, implement effective controls, and keep airmen and guardians actively engaged in mishap prevention.</p>
        </article>
      </div>
      <div class="dafsms-framework-detail">
        <h5>Department of the Air Force SMS Framework</h5>
        <div class="dafsms-framework-grid">
          <article>
            <h6>Policy and Leadership</h6>
            <ul>
              <li>Leadership planning, organization, direction, and control</li>
              <li>Management roles, responsibilities, and relationships</li>
              <li>Procedures and controls that are developed, documented, maintained, and monitored</li>
              <li>Safety and quality balance, integration, and goal setting</li>
            </ul>
          </article>
          <article>
            <h6>Risk Management</h6>
            <ul>
              <li>Hazard identification through mission/task analysis and hazard lists</li>
              <li>Hazard assessment using exposure, probability, severity, and risk level</li>
              <li>Control options, effects, prioritization, selection, and decisions</li>
              <li>Implementation, communication, accountability, support, supervision, and feedback</li>
            </ul>
          </article>
          <article>
            <h6>Assurance</h6>
            <ul>
              <li>Performance requirements, expectations, and control effectiveness</li>
              <li>Continuous monitoring, self-inspections, internal and external inspections</li>
              <li>Mishap and event investigation, reporting, metrics, and improvement opportunities</li>
              <li>Change management and continuous improvement actions</li>
            </ul>
          </article>
          <article>
            <h6>Promotion, Education, and Training</h6>
            <ul>
              <li>Culture built on informed, flexible, learning, just, and reporting behaviors</li>
              <li>Competency through training and education</li>
              <li>Awareness through internal communication, external communication, and information access</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderHierarchyOfControls() {
  return `
    <div class="hoc-block">
      <div class="hoc-header">
        <h4>Hierarchy of Controls</h4>
        <p>Apply these controls from most effective to least effective when reducing workplace hazards under DAFI 91-202 paragraph 14.1.2.1.4.</p>
      </div>
      <figure class="hoc-image-wrap">
        <img class="hoc-image" src="assets/HOC.png?v=20260603-1" alt="Hierarchy of Controls reference image">
      </figure>
      <div class="hoc-notes compact">
        <p><strong>Use the highest level of control feasible first.</strong> PPE should protect workers only after elimination, substitution, engineering, and administrative controls have been considered.</p>
      </div>
    </div>
  `;
}

function renderActiveShooterSection() {
  return `
    <div class="active-shooter-block">
      <div class="active-shooter-header">
        <h4>Active Shooter Response</h4>
        <p>In the event of an active shooter, individuals should employ the <strong>Avoid, Deny, Defend</strong> response method. This strategy is adaptable to the specific situation and environment.</p>
      </div>
      <figure class="active-shooter-image-wrap">
        <img class="active-shooter-image" src="assets/AS.png?v=20260603-1" alt="Active shooter response reference image">
      </figure>
      <div class="active-shooter-copy">
        <p><strong>Avoid (Run):</strong> The first and preferred course of action is to evacuate the area if a safe route is available. Maintain awareness of your surroundings and have an escape route planned. Leave your belongings, evacuate regardless of whether others follow, and do not attempt to move wounded people. Once you have reached a safe location, call 911 and provide any information you have.</p>
        <p><strong>Deny (Hide):</strong> If you cannot evacuate, your next priority is to deny the attacker access to your location. This involves more than just hiding; it means securing your position. Lock and blockade doors with heavy furniture, turn off lights, silence your phone, and remain out of the shooter's view. Remember that concealment only hides you, while cover can offer protection from bullets.</p>
        <p><strong>Defend (Fight):</strong> As a last resort, when your life is in immediate danger, you must be prepared to defend yourself. Act aggressively, improvise weapons from your surroundings, and commit fully to your actions. Taking action may be risky, but it could be your best or only chance for survival.</p>
        <p><strong>When law enforcement arrives:</strong> Remain calm, follow all instructions, keep your hands visible with fingers spread, and be prepared to provide information about the shooter’s location, number, and description.</p>
      </div>
    </div>
  `;
}

function renderUploadedAsset(file, fallbackLabel, fallbackAlt) {
  if (!file || !file.dataUrl) {
    return `<span class="muted">${escapeHtml(fallbackLabel || "No file uploaded")}</span>`;
  }

  const fileName = file.name || fallbackLabel || "Uploaded file";
  const safeName = escapeHtml(fileName);
  const safeHref = escapeHtml(file.dataUrl);
  const safeAlt = escapeHtml(fallbackAlt || fileName);
  const isImage = (file.type || "").startsWith("image/") || /^data:image\//i.test(file.dataUrl);
  const isPdf = (file.type || "") === "application/pdf" || /^data:application\/pdf/i.test(file.dataUrl);

  if (isImage) {
    return `
      <figure class="uploaded-asset uploaded-asset-image">
        <img class="uploaded-asset-preview" src="${safeHref}" alt="${safeAlt}">
        <figcaption class="uploaded-asset-name">${safeName}</figcaption>
      </figure>
    `;
  }

  if (isPdf) {
    return `
      <div class="uploaded-asset uploaded-asset-pdf">
        <p class="uploaded-asset-name">${safeName}</p>
        <div class="uploaded-asset-pdf-pages" data-pdf-src="${safeHref}" data-pdf-name="${safeName}">
          <div class="uploaded-asset-pdf-loading">Preparing PDF preview...</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="uploaded-asset uploaded-asset-link">
      <a href="${safeHref}" target="_blank" rel="noreferrer">${safeName}</a>
    </div>
  `;
}

function renderEvacuationImageForPreview() {
  if (!state.evacuationImage.dataUrl) {
    return `<p class="muted">No evacuation route image uploaded.</p>`;
  }

  return `
    <div class="preview-upload-wrap">
      <strong>Emergency Evacuation Route Image:</strong>
      ${renderUploadedAsset(state.evacuationImage, state.evacuationImage.name || "Emergency evacuation route image", "Emergency evacuation route image")}
    </div>
  `;
}

function renderEmergencyEquipmentFilesPreview() {
  if (!state.emergencyEquipmentFiles.length) {
    return `<p class="muted">No emergency equipment maps or location photos uploaded.</p>`;
  }

  const items = state.emergencyEquipmentFiles.map((file, index) => `
      <li>${renderUploadedAsset(file, `Emergency equipment file ${index + 1}`, "Emergency equipment location map or photo")}</li>
    `).join("");

  return `
    <div class="emergency-equipment-files-preview">
      <strong>Emergency Equipment Maps / AED & Fire Extinguisher Location Photos:</strong>
      <ul>${items}</ul>
    </div>
  `;
}

function renderMishapReportingFilesPreview() {
  if (!state.mishapReportingFiles.length) {
    return "";
  }

  const items = state.mishapReportingFiles.map((file, index) => `
      <li>${renderUploadedAsset(file, `Reporting attachment ${index + 1}`, "Reporting unsafe equipment reference")}</li>
    `).join("");

  return `
    <div class="mishap-reporting-files-preview">
      <strong>Reporting Unsafe Equipment Reference Files:</strong>
      <ul>${items}</ul>
    </div>
  `;
}

function renderGvoRiskPreview() {
  if (!state.gvoRiskFiles.length) {
    return `<p class="muted">No routine-use GVO risk assessment files uploaded.</p>`;
  }

  const items = state.gvoRiskFiles.map((file, index) => `
      <li>${renderUploadedAsset(file, `GVO risk assessment ${index + 1}`, "Routine-use GVO risk assessment")}</li>
    `).join("");

  return `
    <div class="gvo-risk-files-preview">
      <strong>Risk Assessment for Routine Use of GVOs in Traffic, Industrial, or Pedestrian Environments:</strong>
      <ul>${items}</ul>
    </div>
  `;
}

async function renderEmbeddedPdfPages(rootElement = preview) {
  if (!window.pdfjsLib || !rootElement) {
    return;
  }

  const pdfContainers = Array.from(rootElement.querySelectorAll(".uploaded-asset-pdf-pages"));
  for (const container of pdfContainers) {
    const pdfSrc = container.dataset.pdfSrc || "";
    if (!pdfSrc || container.dataset.rendered === "true") {
      continue;
    }

    await renderPdfPagesIntoContainer(container, pdfSrc);
  }
}

async function renderPdfPagesIntoContainer(container, pdfSrc) {
  if (!window.pdfjsLib || !container || !pdfSrc) {
    return;
  }

  container.dataset.rendered = "pending";

  try {
    let pages = renderedPdfPageCache.get(pdfSrc);
    if (!pages) {
      pages = await renderPdfDataUrlToImages(pdfSrc);
      renderedPdfPageCache.set(pdfSrc, pages);
    }

    if (!container.isConnected) {
      return;
    }

    const pdfName = container.dataset.pdfName || "PDF attachment";
    container.innerHTML = pages.map((pageSrc, index) => `
      <figure class="uploaded-asset-pdf-page">
        <img
          class="uploaded-asset-pdf-page-image"
          src="${pageSrc}"
          alt="${escapeHtml(pdfName)} page ${index + 1}"
        >
        <figcaption class="uploaded-asset-name">Page ${index + 1} of ${pages.length}</figcaption>
      </figure>
    `).join("");
    container.dataset.rendered = "true";
  } catch (error) {
    console.warn("Unable to render embedded PDF pages.", error);
    if (container.isConnected) {
      container.dataset.rendered = "error";
      container.innerHTML = '<div class="uploaded-asset-pdf-loading">Unable to render this PDF inline.</div>';
    }
  }
}

async function renderPdfDataUrlToImages(pdfSrc) {
  const bytes = dataUrlToUint8Array(pdfSrc);
  const pdfDocument = await window.pdfjsLib.getDocument({ data: bytes }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.7 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    pages.push(canvas.toDataURL("image/jpeg", 0.92));
  }

  return pages;
}

function dataUrlToUint8Array(dataUrl) {
  const [, base64 = ""] = String(dataUrl).split(",");
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function renderRequiredDocuments() {
  const docs = [
    {
      label: "CA-10",
      href: "required-docs/CA-10.pdf",
      description: "What a Federal Employee Should Do When Injured at Work. Use this as the workplace reference for employee injury reporting and follow-up actions."
    },
    {
      label: "DAF Form 457",
      href: "required-docs/daf457.pdf",
      description: "Hazard Report. Use this form to identify, document, and elevate unsafe conditions, equipment, or procedures in the workplace."
    },
    {
      label: "DAFVA 91-209",
      href: "https://static.e-publishing.af.mil/production/1/af_se/publication/dafva91-209/dafva91-209.pdf",
      description: "Department of the Air Force Occupational Safety and Health Program visual aid. Keep this available so personnel know the core safety rights, responsibilities, and reporting expectations.",
      note: "UNITS MUST FILL OUT THEIR OWN LOCATION POSTED"
    },
    {
      label: "LS-201",
      href: "required-docs/ls-201.pdf",
      description: "Notice of Employee’s Injury or Death (Non-Appropriated Funds). Use this when applicable for NAF employee injury or death reporting."
    }
  ];

  const items = docs.map((doc) => {
    const postingLocation = doc.label === "DAFVA 91-209"
      ? `<br><strong>Location Posted:</strong> ${formatText(state.meta.dafvaPostingLocation, "Enter where DAFVA 91-209 is posted for this work center.")}`
      : "";

    return `
    <li>
      <a href="${doc.href}" target="_blank" rel="noreferrer">${doc.label}</a>${doc.note ? ` <span class="required-doc-inline-note">${doc.note}</span>` : ""}<br>
      <span class="muted">${doc.description}</span>
      ${postingLocation}
    </li>
  `;
  }).join("");

  return `<ul>${items}</ul>`;
}

function renderOptionalModuleDetails() {
  if (!state.selectedModules.length) {
    return "";
  }

  const items = state.selectedModules.map((module) => `
    <li>
      <strong>${escapeHtml(module.title)}:</strong>
      ${escapeHtml(module.notes || buildModuleSummary(module))}
      ${renderModuleLink(module)}
    </li>
  `).join("");

  return `<ul>${items}</ul>`;
}

function renderModuleLink(module) {
  if (!module.link) {
    return "";
  }

  const safeLink = escapeHtml(module.link);
  return `<br><strong>Link to training:</strong> <a href="${safeLink}" target="_blank" rel="noreferrer">${safeLink}</a>`;
}

function buildModuleSummary(module) {
  const parts = [
    module.afTrainingRequirement,
    module.trainingRequirement,
    module.reference
  ].filter(Boolean);

  return parts.join(" ");
}

function uploadUnitImage(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state.unitImage = {
      name: file.name,
      dataUrl: String(reader.result || "")
    };
    saveState();
    renderUnitImageStatus();
    renderUnitImagePreview();
    renderPreview();
  };
  reader.readAsDataURL(file);
}

function removeUnitImage() {
  state.unitImage = { ...defaultState.unitImage };
  unitImageInput.value = "";
  saveState();
  renderUnitImageStatus();
  renderUnitImagePreview();
  renderPreview();
}

function renderUnitImageStatus() {
  if (!state.unitImage.dataUrl) {
    unitImageStatus.textContent = "No unit image uploaded yet.";
    return;
  }

  unitImageStatus.textContent = `Loaded unit image: ${state.unitImage.name || "uploaded image"}`;
}

function renderUnitImagePreview() {
  if (!state.unitImage.dataUrl) {
    unitImageStage.innerHTML = "Unit image will appear here.";
    unitImageStage.classList.add("muted");
    return;
  }

  const markup = `<img src="${state.unitImage.dataUrl}" alt="Unit image preview">`;
  unitImageStage.classList.remove("muted");
  unitImageStage.innerHTML = markup;
}

function renderUnitImageForPreview() {
  if (!state.unitImage.dataUrl) {
    return "";
  }

  return `
    <div class="preview-unit-image-wrap">
      <img class="preview-unit-image" src="${state.unitImage.dataUrl}" alt="Unit emblem or image">
    </div>
  `;
}

function uploadDafsmsImage(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state.dafsmsImage = {
      name: file.name,
      dataUrl: String(reader.result || "")
    };
    saveState();
    renderDafsmsImageStatus();
    renderPreview();
  };
  reader.readAsDataURL(file);
}

function removeDafsmsImage() {
  state.dafsmsImage = { ...defaultState.dafsmsImage };
  if (dafsmsImageInput) {
    dafsmsImageInput.value = "";
  }
  saveState();
  renderDafsmsImageStatus();
  renderPreview();
}

function renderDafsmsImageStatus() {
  if (!dafsmsImageStatus) {
    return;
  }

  if (!state.dafsmsImage.dataUrl) {
    dafsmsImageStatus.textContent = "";
    return;
  }

  dafsmsImageStatus.textContent = `Loaded DAFSMS reference image: ${state.dafsmsImage.name || "uploaded image"}`;
}

function wireEvents() {
  form.addEventListener("input", handleMetaInput);
  form.addEventListener("change", handleMetaInput);
  addModuleButton.addEventListener("click", handleAddModule);
  if (moduleSelect) {
    moduleSelect.addEventListener("change", handleModuleSelectChange);
  }
  if (customModuleTitleInput) {
    customModuleTitleInput.addEventListener("keydown", handleCustomModuleKeydown);
  }
  if (customModuleReferenceInput) {
    customModuleReferenceInput.addEventListener("keydown", handleCustomModuleKeydown);
  }
  addCustomModuleButton.addEventListener("click", handleAddCustomModule);
  selectedModulesContainer.addEventListener("click", handleModuleListClick);
  selectedModulesContainer.addEventListener("input", handleModuleListInput);
  if (unitImageInput) {
    unitImageInput.addEventListener("change", uploadUnitImage);
  }
  if (removeUnitImageButton) {
    removeUnitImageButton.addEventListener("click", removeUnitImage);
  }
  if (dafsmsImageInput) {
    dafsmsImageInput.addEventListener("change", uploadDafsmsImage);
  }
  if (removeDafsmsImageButton) {
    removeDafsmsImageButton.addEventListener("click", removeDafsmsImage);
  }
  if (evacuationImageInput) {
    evacuationImageInput.addEventListener("change", uploadEvacuationImage);
  }
  if (removeEvacuationImageButton) {
    removeEvacuationImageButton.addEventListener("click", removeEvacuationImage);
  }
  if (emergencyEquipmentFilesInput) {
    emergencyEquipmentFilesInput.addEventListener("change", uploadEmergencyEquipmentFiles);
  }
  if (removeEmergencyEquipmentFilesButton) {
    removeEmergencyEquipmentFilesButton.addEventListener("click", removeEmergencyEquipmentFiles);
  }
  if (mishapReportingFilesInput) {
    mishapReportingFilesInput.addEventListener("change", uploadMishapReportingFiles);
  }
  if (removeMishapReportingFilesButton) {
    removeMishapReportingFilesButton.addEventListener("click", removeMishapReportingFiles);
  }
  if (gvoRiskFilesInput) {
    gvoRiskFilesInput.addEventListener("change", uploadGvoRiskFiles);
  }
  if (removeGvoRiskFilesButton) {
    removeGvoRiskFilesButton.addEventListener("click", removeGvoRiskFiles);
  }
  if (form1118FilesInput) {
    form1118FilesInput.addEventListener("change", uploadForm1118Files);
  }
  if (removeForm1118FilesButton) {
    removeForm1118FilesButton.addEventListener("click", removeForm1118Files);
  }
  if (bioSurveyInput) {
    bioSurveyInput.addEventListener("change", uploadBioSurvey);
  }
  if (removeBioSurveyButton) {
    removeBioSurveyButton.addEventListener("click", removeBioSurvey);
  }
  const saveButton = document.getElementById("save-state");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      saveState();
      window.alert("Saved in this browser.");
    });
  }
  const saveLibraryButton = document.getElementById("save-library");
  if (saveLibraryButton) {
    saveLibraryButton.addEventListener("click", saveToLibrary);
  }
  const downloadButton = document.getElementById("download-state");
  if (downloadButton) {
    downloadButton.addEventListener("click", downloadState);
  }
  const uploadButton = document.getElementById("upload-state-trigger");
  const uploadInput = document.getElementById("upload-state");
  if (uploadButton && uploadInput) {
    uploadButton.addEventListener("click", () => uploadInput.click());
    uploadInput.addEventListener("change", uploadState);
  }
  const printButton = document.getElementById("print-pdf");
  if (printButton) {
    printButton.addEventListener("click", exportPdf);
  }
  if (fieldEditorSave) {
    fieldEditorSave.addEventListener("click", saveFieldEditor);
  }
  if (fieldEditorCancel) {
    fieldEditorCancel.addEventListener("click", closeFieldEditor);
  }
  if (fieldEditorClose) {
    fieldEditorClose.addEventListener("click", closeFieldEditor);
  }
  if (fieldEditorModal) {
    fieldEditorModal.addEventListener("click", (event) => {
      if (event.target === fieldEditorModal) {
        closeFieldEditor();
      }
    });
  }
  if (fieldEditorText) {
    fieldEditorText.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFieldEditor();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        saveFieldEditor();
      }
    });
  }
  form.querySelectorAll("textarea[name], input[name]").forEach((field) => {
    if (expandableFieldNames.has(field.name)) {
      field.addEventListener("focus", () => openFieldEditor(field.name));
      field.addEventListener("click", () => openFieldEditor(field.name));
    }
  });
  if (libraryIdentityInput) {
    libraryIdentityInput.addEventListener("input", handleLibraryIdentityInput);
  }
}

function handleMetaInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  if (!target.name) {
    return;
  }

  state.meta[target.name] = target.value;
  if (target.name === "uploadedBy") {
    handleUploadedByChange(target.value);
  }
  saveState();
  renderPreview();
}

function handleLibraryIdentityInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  handleUploadedByChange(target.value);
  saveState();
  renderPreview();
}

function handleUploadedByChange(value) {
  const normalizedValue = String(value || "").trim();
  state.meta.uploadedBy = normalizedValue;
  state.meta.uploadedById = normalizeLibraryIdentity(normalizedValue);
  writeLibraryIdentity(normalizedValue);

  if (libraryIdentityInput && libraryIdentityInput.value !== normalizedValue) {
    libraryIdentityInput.value = normalizedValue;
  }

  const uploadedByField = form.elements.namedItem("uploadedBy");
  if (uploadedByField instanceof HTMLInputElement && uploadedByField.value !== normalizedValue) {
    uploadedByField.value = normalizedValue;
  }
}

function handleAddModule() {
  const selectedId = moduleSelect.value;
  if (!selectedId) {
    return;
  }

  if (selectedId === "custom-other") {
    if (customModuleFields) {
      customModuleFields.hidden = false;
    }
    if (customModuleTitleInput) {
      customModuleTitleInput.focus();
    }
    return;
  }

  const template = moduleCatalog.find((item) => item.id === selectedId);
  if (!template) {
    return;
  }

  state.selectedModules.push({
    ...template,
    notes: "",
    link: ""
  });
  moduleSelect.value = "";
  if (customModuleFields) {
    customModuleFields.hidden = true;
  }
  renderSelectedModules();
  renderPreview();
  saveState();
}

function handleModuleSelectChange() {
  if (!customModuleFields) {
    return;
  }

  const selectedId = moduleSelect?.value || "";
  customModuleFields.hidden = selectedId !== "custom-other";
  if (selectedId === "custom-other" && customModuleTitleInput) {
    customModuleTitleInput.focus();
  }
}

function handleCustomModuleKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleAddCustomModule();
  }
}

function handleAddCustomModule() {
  const title = String(customModuleTitleInput?.value || "").trim();
  const reference = String(customModuleReferenceInput?.value || "").trim();

  if (!title) {
    window.alert("Enter a custom module title first.");
    customModuleTitleInput?.focus();
    return;
  }

  state.selectedModules.push({
    id: `custom-${Date.now()}`,
    title,
    reference: reference || "Local / Custom module",
    trainingRequirement: "Describe the unit-specific hazard, certification, or recurring training requirement that applies to this work center.",
    afTrainingRequirement: "Document the governing reference, training location, and how completion is tracked for this custom module.",
    trainingBasis: "Custom / Local requirement",
    afTrainingBasis: "Custom / Local requirement",
    notes: "",
    link: ""
  });

  if (customModuleTitleInput) {
    customModuleTitleInput.value = "";
  }
  if (customModuleReferenceInput) {
    customModuleReferenceInput.value = "";
  }
  if (customModuleFields) {
    customModuleFields.hidden = true;
  }
  if (moduleSelect) {
    moduleSelect.value = "";
  }

  renderSelectedModules();
  renderPreview();
  saveState();
}

function handleModuleListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const article = target.closest(".module-card");
  if (!article) {
    return;
  }

  const index = Number(article.dataset.index);
  if (Number.isNaN(index)) {
    return;
  }

  if (target.closest(".remove-module")) {
    state.selectedModules.splice(index, 1);
    renderSelectedModules();
    renderPreview();
    saveState();
  }
}

function handleModuleListInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) {
    return;
  }

  const article = target.closest(".module-card");
  if (!article) {
    return;
  }

  const index = Number(article.dataset.index);
  if (Number.isNaN(index)) {
    return;
  }

  if (target.classList.contains("module-notes")) {
    state.selectedModules[index].notes = target.value;
  }

  if (target.classList.contains("module-link")) {
    state.selectedModules[index].link = target.value;
  }

  saveState();
  renderPreview();
}

function openFieldEditor(fieldName) {
  if (!expandableFieldNames.has(fieldName) || !fieldEditorModal || !fieldEditorText) {
    return;
  }

  if (document.activeElement === fieldEditorText && activeExpandableField === fieldName) {
    return;
  }

  activeExpandableField = fieldName;
  const field = form.elements.namedItem(fieldName);
  if (!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement)) {
    return;
  }

  const label = field.closest("label")?.childNodes?.[0]?.textContent?.trim() || "Edit Field";
  if (fieldEditorTitle) {
    fieldEditorTitle.textContent = label;
  }
  fieldEditorText.value = state.meta[fieldName] || "";
  fieldEditorText.placeholder = field.placeholder || "Enter one item per line.";
  fieldEditorModal.hidden = false;
  document.body.classList.add("modal-open");
  window.requestAnimationFrame(() => {
    fieldEditorText.focus();
    fieldEditorText.setSelectionRange(fieldEditorText.value.length, fieldEditorText.value.length);
  });
}

function closeFieldEditor() {
  if (!fieldEditorModal) {
    return;
  }
  fieldEditorModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeExpandableField = null;
}

function saveFieldEditor() {
  if (!activeExpandableField || !fieldEditorText) {
    closeFieldEditor();
    return;
  }

  const value = fieldEditorText.value;
  state.meta[activeExpandableField] = value;
  const field = form.elements.namedItem(activeExpandableField);
  if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
    field.value = value;
  }
  saveState();
  renderPreview();
  closeFieldEditor();
}

function downloadState() {
  saveState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = createStateFilename();
  link.click();
  URL.revokeObjectURL(url);
}

function buildLibraryDeleteHeaders(deleteToken = "") {
  const headers = {
    "Content-Type": "application/json"
  };
  if (deleteToken) {
    headers["X-Library-Delete-Token"] = deleteToken;
  }
  return headers;
}

function buildLibraryIdentityHeaders() {
  const identity = String(state.meta.uploadedBy || readLibraryIdentity() || "").trim();
  return identity ? { "X-Library-User": identity } : {};
}

async function exportPdfFromService(payload) {
  const response = await fetch(`${LIBRARY_UPLOAD_URL}/api/export-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || "PDF export failed.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = createExportPdfFilename();
  link.click();
  URL.revokeObjectURL(url);
}

async function exportPdf() {
  saveState();
  if (!LIBRARY_UPLOAD_URL) {
    window.alert("The PDF export service is not configured yet. Add your Render service URL in index.html before using this button.");
    return;
  }

  const exportButton = document.getElementById("print-pdf");
  const originalLabel = exportButton.textContent;
  exportButton.disabled = true;
  exportButton.textContent = "Preparing...";

  try {
    await renderEmbeddedPdfPages();
    await exportPdfFromService(createPdfPayload());
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF export failed.";
    window.alert(message);
  } finally {
    exportButton.disabled = false;
    exportButton.textContent = originalLabel;
  }
}

function createPrintWindow() {
  return window.open("", "_blank", "noopener,noreferrer");
}

async function waitForPrintWindowAssets(printWindow) {
  const printDocument = printWindow.document;
  const imagePromises = Array.from(printDocument.images).map((img) => {
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const done = () => resolve();
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  });

  const timeout = new Promise((resolve) => window.setTimeout(resolve, 4000));
  await Promise.race([Promise.all(imagePromises), timeout]);
}

async function exportPdfWithPrintWindow() {
  const printWindow = createPrintWindow();
  if (!printWindow) {
    throw new Error("The browser blocked the print window. Allow pop-ups for this site and try again.");
  }

  const previewMarkup = preview.innerHTML;
  const title = [state.meta.unit, state.meta.workCenter].filter(Boolean).join(" - ") || "Job Safety Training Outline";
  const printDocument = printWindow.document;
  printDocument.open();
  printDocument.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${document.getElementById("app-styles")?.textContent || ""}</style>
  <style>
    body { background: #fff; padding: 24px; }
    .page-shell, .layout-grid, .page-shell > *:not(.preview), .page-shell > header, .page-shell > section, .page-shell > .library-banner { display: none !important; }
    .preview, .preview * { visibility: visible; }
    .preview { display: block !important; max-width: none; box-shadow: none; border: 0; }
  </style>
</head>
<body>
  <article class="preview">${previewMarkup}</article>
</body>
</html>`);
  printDocument.close();

  await waitForPrintWindowAssets(printWindow);
  await new Promise((resolve) => window.setTimeout(resolve, 250));
  printWindow.focus();
  printWindow.print();
}

function createDataUrlFileRecord(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        dataUrl: String(reader.result || ""),
        type: file.type || ""
      });
    };
    reader.readAsDataURL(file);
  });
}

async function saveToLibrary() {
  saveState();
  if (!LIBRARY_UPLOAD_URL) {
    window.alert("The JSTO Library upload service is not configured yet. Add your Render service URL in index.html before using this button.");
    return;
  }

  const uploadedBy = String(state.meta.uploadedBy || readLibraryIdentity() || "").trim();
  if (!uploadedBy) {
    window.alert("Enter the uploader name before saving to the JSTO Library.");
    const uploadedByField = form.elements.namedItem("uploadedBy");
    if (uploadedByField instanceof HTMLInputElement) {
      uploadedByField.focus();
    }
    return;
  }

  state.meta.uploadedBy = uploadedBy;
  state.meta.uploadedById = normalizeLibraryIdentity(uploadedBy);
  writeLibraryIdentity(uploadedBy);

  const saveLibraryButton = document.getElementById("save-library");
  const originalLabel = saveLibraryButton.textContent;
  saveLibraryButton.disabled = true;
  saveLibraryButton.textContent = "Saving...";

  try {
    await renderEmbeddedPdfPages();
    const payload = {
      ...createPdfPayload(),
      uploadedBy,
      uploadedById: state.meta.uploadedById
    };
    const response = await fetch(`${LIBRARY_UPLOAD_URL}/api/save-library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildLibraryIdentityHeaders()
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "JSTO Library upload failed.");
    }

    window.alert("JSTO PDF uploaded to the JSTO Library. Use the Library Manager to open or delete it.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "JSTO Library upload failed.";
    window.alert(`${message} You can still use Save in Browser as a backup.`);
  } finally {
    saveLibraryButton.disabled = false;
    saveLibraryButton.textContent = originalLabel;
  }
}

function uploadEvacuationImage(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  if (!(file.type || "").startsWith("image/")) {
    window.alert("Please upload an image file for the evacuation route, such as PNG or JPEG.");
    evacuationImageInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state.evacuationImage = {
      name: file.name,
      dataUrl: String(reader.result || "")
    };
    saveState();
    renderEvacuationImageStatus();
    renderPreview();
  };
  reader.readAsDataURL(file);
}

function removeEvacuationImage() {
  state.evacuationImage = { ...defaultState.evacuationImage };
  evacuationImageInput.value = "";
  saveState();
  renderEvacuationImageStatus();
  renderPreview();
}

async function uploadEmergencyEquipmentFiles(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    return;
  }

  const loadedFiles = await Promise.all(files.map(createDataUrlFileRecord));

  state.emergencyEquipmentFiles = [...state.emergencyEquipmentFiles, ...loadedFiles];
  emergencyEquipmentFilesInput.value = "";
  saveState();
  renderEmergencyEquipmentFilesStatus();
  renderPreview();
}

function removeEmergencyEquipmentFiles() {
  state.emergencyEquipmentFiles = [];
  emergencyEquipmentFilesInput.value = "";
  saveState();
  renderEmergencyEquipmentFilesStatus();
  renderPreview();
}

async function uploadMishapReportingFiles(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    return;
  }

  const loadedFiles = await Promise.all(files.map(createDataUrlFileRecord));

  state.mishapReportingFiles = [...state.mishapReportingFiles, ...loadedFiles];
  mishapReportingFilesInput.value = "";
  saveState();
  renderMishapReportingFilesStatus();
  renderPreview();
}

function removeMishapReportingFiles() {
  state.mishapReportingFiles = [];
  mishapReportingFilesInput.value = "";
  saveState();
  renderMishapReportingFilesStatus();
  renderPreview();
}

async function uploadGvoRiskFiles(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    return;
  }

  const loadedFiles = await Promise.all(files.map(createDataUrlFileRecord));

  state.gvoRiskFiles = [...state.gvoRiskFiles, ...loadedFiles];
  gvoRiskFilesInput.value = "";
  saveState();
  renderGvoRiskStatus();
  renderPreview();
}

function removeGvoRiskFiles() {
  state.gvoRiskFiles = [];
  gvoRiskFilesInput.value = "";
  saveState();
  renderGvoRiskStatus();
  renderPreview();
}

async function uploadForm1118Files(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    return;
  }

  const loadedFiles = await Promise.all(files.map(createDataUrlFileRecord));

  state.form1118Files = [...state.form1118Files, ...loadedFiles];
  form1118FilesInput.value = "";
  saveState();
  renderForm1118Status();
  renderPreview();
}

function removeForm1118Files() {
  state.form1118Files = [];
  form1118FilesInput.value = "";
  saveState();
  renderForm1118Status();
  renderPreview();
}

function uploadBioSurvey(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  createDataUrlFileRecord(file).then((record) => {
    state.bioSurvey = record;
    saveState();
    renderBioSurveyStatus();
    renderPreview();
  });
}

function removeBioSurvey() {
  state.bioSurvey = { ...defaultState.bioSurvey };
  bioSurveyInput.value = "";
  saveState();
  renderBioSurveyStatus();
  renderPreview();
}

function applyImportedState(parsed) {
  state = normalizeLoadedState(parsed);
  hydrateForm();
  syncLibraryIdentityField();
  renderSelectedModules();
  renderUnitImageStatus();
  renderUnitImagePreview();
  renderDafsmsImageStatus();
  renderEvacuationImageStatus();
  renderEmergencyEquipmentFilesStatus();
  renderMishapReportingFilesStatus();
  renderGvoRiskStatus();
  renderForm1118Status();
  renderBioSurveyStatus();
  renderPreview();
  saveState();
}

async function loadLibraryStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const statePath = params.get("libraryState");
  if (!statePath) {
    return;
  }

  if (!LIBRARY_UPLOAD_URL) {
    window.alert("The JSTO Library service URL is not configured for this page.");
    return;
  }

  try {
    const forwardedIdentity = String(params.get("libraryIdentity") || readLibraryIdentity() || "").trim();
    if (forwardedIdentity) {
      handleUploadedByChange(forwardedIdentity);
      saveState();
    }

    const identityQuery = forwardedIdentity
      ? `&identity=${encodeURIComponent(forwardedIdentity)}`
      : "";
    const response = await fetch(`${LIBRARY_UPLOAD_URL}/api/library-state?path=${encodeURIComponent(statePath)}${identityQuery}`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || "Unable to load JSTO editable package.");
    }

    applyImportedState(result);
    const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
    window.history.replaceState({}, document.title, cleanUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load JSTO editable package.";
    window.alert(message);
  }
}

function uploadState(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      applyImportedState(parsed);
    } catch {
      window.alert("That JSON file could not be loaded.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}
