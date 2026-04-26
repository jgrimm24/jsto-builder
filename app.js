const STORAGE_KEY = "jsto-builder-state-v1";
const LIBRARY_UPLOAD_URL = String(window.JSTO_LIBRARY_UPLOAD_URL || "").trim().replace(/\/$/, "");

const REQUIRED_MODULES = [
  {
    id: "14.1.2.1",
    title: "Workplace Hazards",
    reference: "Describe hazards of the job, environment-specific hazards, governing guidance, and hierarchy of controls."
  },
  {
    id: "14.1.2.2",
    title: "Personal Protective Equipment",
    reference: "Cover required PPE, donning, doffing, cleaning, maintenance, storage, disposal, and supervisor notification requirements."
  },
  {
    id: "14.1.2.3",
    title: "Emergency Action and Fire Prevention",
    reference: "Address emergency plans, fire prevention plans, alarms, AEDs, extinguishers, and workplace response actions."
  },
  {
    id: "14.1.2.4",
    title: "Reporting Unsafe Conditions",
    reference: "Explain immediate reporting expectations, anti-retaliation protections, DAF Form 457, and SAFEREP access."
  },
  {
    id: "14.1.2.5",
    title: "Reporting Mishaps and Occupational Injury/Illness",
    reference: "Include treatment procedures, emergency numbers, evacuation, shelter, active shooter response, and event reporting."
  },
  {
    id: "14.1.2.6",
    title: "CA-10 and LS-201",
    reference: "Identify the purpose and location of CA-10 and LS-201 if applicable."
  },
  {
    id: "14.1.2.7",
    title: "DAF Traffic Safety Program",
    reference: "Cover seat belts, helmets, speed limits, local traffic hazards, spotters, electronic device restrictions, and motorcycle training."
  },
  {
    id: "14.1.2.8",
    title: "DAFVA 91-209",
    reference: "Identify the location and content of DAF Occupational Safety and Health Program visual aid."
  },
  {
    id: "14.1.2.9",
    title: "DAFSMS Responsibilities",
    reference: "Explain how leaders, supervisors, and airmen participate in the unit safety management system and continual improvement."
  }
];

const OPTIONAL_MODULES = [
  {
    id: "14.1.3.1",
    title: "Hazardous Energy Control",
    reference: "DAFMAN 91-203 Chapter 21; 29 CFR 1910.147",
    trainingRequirement: "Train authorized employees on hazardous energy sources, magnitude, and isolation methods; affected employees on the purpose and use of procedures; and other nearby employees on restart/reenergization prohibitions. Retrain when assignments, equipment, processes, or procedures change, or when inspections show gaps.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.147",
    afTrainingRequirement: "DAFMAN 91-203 establishes a formal Hazardous Energy Control Program with dedicated training, documented procedures, and periodic self-inspections before servicing or maintenance work is performed.",
    afTrainingSource: "DAFMAN 91-203 Chapter 21"
  },
  {
    id: "14.1.3.2",
    title: "Hazard Communication",
    reference: "AFI 90-821; 29 CFR 1910.1200",
    trainingRequirement: "Provide effective training at initial assignment and whenever a new chemical hazard is introduced. Cover where hazardous chemicals are present, the written program, labels and SDS access, how releases are detected, hazard types, protective measures, emergency procedures, and required PPE.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.1200",
    afTrainingRequirement: "Employees potentially exposed to chemical hazards must complete HAZCOM training upon initial assignment and whenever a new hazard or chemical is introduced or new tasks create new hazards. Supervisors must ensure SDS access for chemicals used in the work process.",
    afTrainingSource: "DAFMAN 91-203 para. 28.2.5 and para. 28.3.3"
  },
  {
    id: "14.1.3.3",
    title: "Bloodborne Pathogens",
    reference: "29 CFR 1910.1030",
    trainingRequirement: "Train exposed employees at initial assignment and at least annually, with additional training when tasks or procedures create new exposure. Cover disease signs and transmission, the exposure control plan, task recognition, engineering controls, work practices, PPE use and disposal, and Hepatitis B vaccine information.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.1030",
    afTrainingRequirement: "Any person whose duties involve reasonably anticipated exposure to blood or other potentially infectious material must be trained and enrolled in the Bloodborne Pathogen Program. Supervisors of affected workplaces must establish a written exposure control plan and conduct training.",
    afTrainingSource: "DAFMAN 91-203 para. 1.9"
  },
  {
    id: "14.1.3.4",
    title: "Hearing Conservation",
    reference: "AFI 48-127",
    trainingRequirement: "Provide a hearing conservation training program for employees exposed at or above the action level, repeat it annually, and update it when equipment or work processes change. Cover hearing effects, protector selection and care, and the purpose of audiometric testing.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.95",
    afTrainingRequirement: "Hazardous noise concerns must be evaluated and controls recommended through the occupational health risk assessment process. Use the AF Hearing Conservation Program as the training and control basis when shop noise hazards are identified.",
    afTrainingSource: "DAFMAN 91-203 para. 2.2.2"
  },
  {
    id: "14.1.3.5",
    title: "Confined Space Program",
    reference: "DAFMAN 91-203 Chapter 23; 29 CFR 1910.146",
    trainingRequirement: "Train affected employees before first assignment, before duty changes, when permit-space operations introduce new hazards, and when deviations or inadequate knowledge are identified. Training must establish proficiency and be documented by employee, trainer, and date.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.146",
    afTrainingRequirement: "Employees entering confined spaces must be trained to safely accomplish assigned duties and rescue procedures for the specific permit-required space entered. Safety observers and attendants must also be trained on rescue procedures for each type of permit-required confined space.",
    afTrainingSource: "DAFMAN 91-203 para. 28.2.9 and para. 28.3.2"
  },
  {
    id: "14.1.3.6",
    title: "Manual and Powered Hoists",
    reference: "DAFMAN 91-203 Chapter 35",
    trainingRequirement: "When hoisting operations involve overhead or gantry cranes, instruct personnel involved in multi-crane lifts on positioning, rigging, and movement coordination under a qualified person, and ensure operators are familiar with the operation and care of fire extinguishers provided. For crawler, locomotive, and truck cranes, make operating and maintenance personnel familiar with extinguisher use and local crane procedures.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.179 and 1910.180",
    afTrainingRequirement: "MHE operator qualification and training must be provided by the responsible organization using lesson plans for each equipment type that include formal instruction, hands-on demonstrations, practical exercises, and evaluation. Forklift operators must be evaluated at least once every three years and retrained after unsafe operation, accidents, different equipment assignments, or workplace changes.",
    afTrainingSource: "DAFMAN 91-203 para. 12.6.1 through 12.6.5"
  },
  {
    id: "14.1.3.7",
    title: "Respiratory Protection Program",
    reference: "AFI 48-137; AF Form 2767",
    trainingRequirement: "Provide comprehensive, understandable respirator training before use and at least annually thereafter. Cover why the respirator is needed, limitations, emergency use, inspection, donning and seal checks, maintenance and storage, and symptoms that may limit safe use.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.134",
    afTrainingRequirement: "Respiratory hazards must be evaluated by Bioenvironmental Engineering and respiratory protection used where required by the occupational health assessment. Use the AF Respiratory Protection Program for controls, fit testing, and local training requirements.",
    afTrainingSource: "DAFMAN 91-203 para. 2.2.4 and para. 28.2.11"
  },
  {
    id: "14.1.3.8",
    title: "Elevated Work Platforms",
    reference: "DAFMAN 91-203 Chapter 16",
    trainingRequirement: "Only allow operation by personnel proficient in the operation, safe use, and inspection of the specific platform being used. If a personal fall arrest system is part of the setup, train users on safe system use before first use and after system changes.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.66",
    afTrainingRequirement: "All lift training must be performed by a qualified trainer/supervisor and documented by model. Training plans must include classroom and hands-on proficiency training, inspection requirements, hazard recognition, safety devices, workplace/site inspection, spotter duties, written testing, and model-specific authorization.",
    afTrainingSource: "DAFMAN 91-203 Attachment 3, A3.1 through A3.4.1"
  },
  {
    id: "14.1.3.9",
    title: "Fall Arrest Systems",
    reference: "DAFMAN 91-203 Chapter 13; 29 CFR 1910.66; 29 CFR 1926.503",
    trainingRequirement: "Train personnel in safe personal fall arrest system use before use and after any component or system change. Pair this with the AF and local fall protection requirements for inspection, anchorage, rescue, and user limitations.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.66",
    afTrainingRequirement: "Any work above four feet requires a fall protection program and appropriate safety gear. Use the local fall protection program, rescue procedures, and chapter-specific AF requirements for application-level training.",
    afTrainingSource: "DAFMAN 91-203 para. 28.2.7 and Chapter 13"
  },
  {
    id: "14.1.3.10",
    title: "Forklift / Material Handling Equipment",
    reference: "DAFMAN 91-203 Chapter 35; 29 CFR 1910.178",
    trainingRequirement: "Ensure each operator is trained and evaluated before operating independently. Training must combine formal instruction, practical training, and workplace evaluation, cover truck-specific and site-specific hazards, and include refresher training after unsafe operation, incidents, assignment to a different truck, or workplace changes.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.178",
    afTrainingRequirement: "MHE training must follow equipment-specific lesson plans with formal instruction, hands-on demonstrations, exercises, and evaluation. Around aircraft, only licensed drivers will operate forklifts and hi-lift trucks, special training is required for hi-lift operators, and spotters must be used when maneuvering close to aircraft or raising and lowering cargo beds.",
    afTrainingSource: "DAFMAN 91-203 para. 12.6.1 through 12.6.5 and para. 24.13.10"
  },
  {
    id: "14.1.3.11",
    title: "Explosives Safety Training",
    reference: "DESR6055.09_DAFMAN91-201; DAFI 91-202",
    trainingRequirement: "Use explosives-specific AF lesson plans and local operating instructions. OSHA 2254 includes transportation and explosives references, but the Air Force explosives program should remain the primary training basis for this module.",
    trainingSource: "DESR6055.09_DAFMAN91-201 / local procedures"
  },
  {
    id: "14.1.3.12",
    title: "Pole / Tower Climbing",
    reference: "DAFMAN 91-203 Chapter 30",
    trainingRequirement: "Use AF and manufacturer guidance for climbing systems, fall protection, rescue, and communications. The nearest OSHA 2254 crosswalk is telecommunications work under 29 CFR 1910.268, which expects employees to use required protective equipment and follow task-specific safe practices, but it does not provide a complete tower-climbing lesson plan by itself.",
    trainingSource: "Partial OSHA 2254 crosswalk / 29 CFR 1910.268 plus AF guidance"
  },
  {
    id: "14.1.3.13",
    title: "CPR Training",
    reference: "DAFMAN 91-203 Chapter 1",
    trainingRequirement: "Where work conditions require trained first-aid responders, ensure personnel are adequately trained and available. OSHA 2254 links first-aid and CPR availability to certain work settings, but local mission risk and AF requirements should define who must hold current CPR credentials.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.151 and 1910.269; DAFMAN 91-203",
    afTrainingRequirement: "Initial first aid and CPR training must be completed before assigning duties that require it, refresher training must occur before certification expires, and CPR training must include PAD instruction. Remote or high-risk work must have an immediate medical response plan.",
    afTrainingSource: "DAFMAN 91-203 para. 1.8"
  },
  {
    id: "14.1.3.14",
    title: "Flight Line Driving",
    reference: "DAFMAN 91-203 Chapter 24",
    trainingRequirement: "Use flight-line-specific AF lesson plans and local airfield driving rules. OSHA 2254 does not provide a direct flight-line driving training excerpt for this module.",
    trainingSource: "DAFMAN 91-203 / local procedures",
    afTrainingRequirement: "Use Chapter 24 flightline vehicle operations rules and local licensing programs. For specialized equipment like forklifts and hi-lifts around aircraft, only licensed drivers may operate and the owning organization must provide special training with spotter support as required.",
    afTrainingSource: "DAFMAN 91-203 para. 24.13 and para. 24.13.10"
  },
  {
    id: "14.1.3.15",
    title: "Fetal Protection Program",
    reference: "AFMAN 48-146; AFRCI 41-104 as applicable",
    trainingRequirement: "Use AF occupational and public health guidance to brief reproductive hazards, reporting expectations, and referral procedures. No direct OSHA 2254 module is mapped here.",
    trainingSource: "AFMAN 48-146 / local procedures"
  },
  {
    id: "14.1.3.16",
    title: "Medical Surveillance Examination",
    reference: "AFI 48-145",
    trainingRequirement: "Tie this module to the specific exposure program and explain when surveillance is required, how scheduling works, and what triggers follow-up. OSHA 2254 aligns most directly where laboratory or substance-specific standards require information on exposure limits, signs and symptoms, and protective measures, but the AF medical surveillance program should remain the primary driver.",
    trainingSource: "Partial OSHA 2254 alignment with 29 CFR 1910.1450 and exposure-specific standards",
    afTrainingRequirement: "Use the occupational health risk assessment and exposure-specific program requirements to decide who needs surveillance, what triggers enrollment, and what training or briefings must accompany the surveillance requirement.",
    afTrainingSource: "DAFMAN 91-203 para. 2.2 and AFI 48-145"
  },
  {
    id: "14.1.3.17",
    title: "Electromagnetic Field Training",
    reference: "AFI 48-109",
    trainingRequirement: "Use AF EMF program guidance for source identification, posted restrictions, exposure boundaries, and work controls. The closest OSHA 2254 crosswalk is electrical safety training for employees exposed to shock or electrical hazards and the electric power standard’s job-assignment-specific safety practices and emergency procedures.",
    trainingSource: "Partial OSHA 2254 crosswalk / 29 CFR 1910.332 and 1910.269",
    afTrainingRequirement: "Employees with implanted medical devices must notify their supervisors before work and seek medical assessment before duties in EMF environments. Use AF EMF program controls and local work restrictions as the training basis.",
    afTrainingSource: "DAFMAN 91-203 para. 28.2.4.1"
  },
  {
    id: "14.1.3.18",
    title: "Laser Safety Training",
    reference: "AFI 48-139",
    trainingRequirement: "Use AF laser program guidance for laser classes, beam hazards, eyewear selection, alignment controls, and access restrictions. No direct OSHA 2254 module is mapped here.",
    trainingSource: "AFI 48-139"
  },
  {
    id: "14.1.3.19",
    title: "ALARA Ionizing Radiation Training",
    reference: "AFI 48-148",
    trainingRequirement: "Inform personnel working in or frequenting radiation areas about the presence of radiation or radioactive materials, related safety problems, the precautions and devices used to minimize exposure, and how to obtain exposure reports.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.1096; AFI 48-148",
    afTrainingRequirement: "Communications and electronics personnel must understand the hazards of broken radioactive tubes, reporting expectations, packaging and handling controls, and the need to notify the supervisor and radiation safety office after exposure. Use AF radiation program requirements with the OSHA standard.",
    afTrainingSource: "DAFMAN 91-203 para. 28.2.4.2"
  },
  {
    id: "local-1",
    title: "Ladder Safety",
    reference: "Common local training item often broken out separately with fixed and portable ladder rules",
    trainingRequirement: "Use local ladder lesson plans, manufacturer instructions, and AF walking-working surface guidance. OSHA 2254 (2015 edition) does not provide a dedicated general-industry ladder training summary in the same way it does for lockout, forklifts, or confined spaces, so this remains primarily AF/local-driven.",
    trainingSource: "No direct OSHA 2254 training excerpt; local procedures",
    afTrainingRequirement: "Personnel using ladders at any working height must be trained when first assigned, and that training must include hands-on instruction covering ladder defects, electrocution hazards, positioning, and placement for various job sites. Training must be documented under DAFI 91-202.",
    afTrainingSource: "DAFMAN 91-203 para. 7.4.3.7"
  },
  {
    id: "local-2",
    title: "Active Shooter Response",
    reference: "Local emergency response briefing and lockdown procedures",
    trainingRequirement: "Tie this to the local emergency action plan, shelter/lockdown locations, notification methods, and commander-directed response procedures.",
    trainingSource: "Local emergency action plan"
  },
  {
    id: "local-3",
    title: "Government Vehicle / Utility Vehicle Use",
    reference: "Local GOV, GVO, or UTV operating rules and licensing expectations",
    trainingRequirement: "Document local licensing, route restrictions, spotter use, rollover protection, and unit-specific operating rules. OSHA 2254 does not provide a direct GOV/UTV training excerpt here.",
    trainingSource: "No direct OSHA 2254 training excerpt; local procedures"
  },
  {
    id: "local-5",
    title: "Manual Lifting and Material Handling",
    reference: "Manual lifting techniques and available lifting devices",
    trainingRequirement: "Cover shop-specific lifting limits, two-person lift triggers, hand truck and lifting-device use, and when supervisors require assisted handling. No direct OSHA 2254 standalone manual-lifting module is mapped here.",
    trainingSource: "No direct OSHA 2254 training excerpt; local procedures",
    afTrainingRequirement: "Supervisors must ensure thorough training on proper manual lifting techniques, required PPE, and the use of manual lifting devices. Training must use both verbal and written materials, include practice on proper motions, and be documented under DAFI 91-202.",
    afTrainingSource: "DAFMAN 91-203 para. 2.10.3"
  },
  {
    id: "local-6",
    title: "Fire Protection and Prevention",
    reference: "Local extinguisher, pull station, and fire reporting procedures",
    trainingRequirement: "Review the fire prevention plan with employees when the plan is developed, when responsibilities change, and when the plan changes. If extinguishers are provided for employee use, train employees on the general principles of extinguisher use and the hazards of incipient-stage firefighting at initial assignment and at least annually. Train designated users on the specific equipment they are expected to use.",
    trainingSource: "OSHA 2254 / 29 CFR 1910.39 and 1910.157",
    afTrainingRequirement: "Facility managers and supervisors must establish and maintain a fire prevention training program through the JSTO so employees understand their fire prevention and protection responsibilities in their work areas. This is fulfilled through job safety training and documentation under DAFI 91-202.",
    afTrainingSource: "DAFMAN 91-203 para. 6.2.1.1"
  },
  {
    id: "local-7",
    title: "Jewelry / Loose Articles Restrictions",
    reference: "Workplace-specific limits on rings, necklaces, watches, and loose items",
    trainingRequirement: "Use local shop rules and hazard analysis to define where jewelry, loose clothing, or unsecured items are prohibited around moving parts, climbing, electrical work, or snag hazards.",
    trainingSource: "No direct OSHA 2254 training excerpt; local procedures"
  },
  {
    id: "custom-other",
    title: "Other",
    reference: "Create a custom job-specific module for hazards or tasks not listed above.",
    trainingRequirement: "Use this option for shop-specific tasks, hazards, or local training subjects not covered by the standard module catalog.",
    trainingSource: "Custom module"
  }
];

const defaultState = {
  meta: {
    unit: "",
    workCenter: "",
    exportBasename: "",
    officeSymbol: "",
    supervisor: "",
    phone: "",
    reviewer: "",
    reviewDate: "",
    effectiveDate: "",
    workDescription: "",
    references: "",
    hazardAnalysis: "",
    riskManagementNotes: "",
    trafficSafetyNotes: "",
    motorcycleSafetyReps: "",
    emergencyNumbers: "",
    medicalFacility: "",
    evacuation: "",
    shelter: "",
    activeShooter: "",
    weatherShelter: "",
    bulletinBoard: "",
    emergencyEquipment: "",
    documentationNotes: "",
    annualReviewLog: ""
  },
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
  gvoRiskFiles: [],
  form1118Files: [],
  bioSurvey: {
    name: "",
    dataUrl: "",
    type: ""
  },
  selectedModules: []
};

const form = document.getElementById("jsto-form");
const preview = document.getElementById("preview");
const moduleSelect = document.getElementById("module-select");
const selectedModulesContainer = document.getElementById("selected-modules");
const moduleTemplate = document.getElementById("module-card-template");
const customModuleBuilder = document.getElementById("custom-module-builder");
const customModuleTitle = document.getElementById("custom-module-title");
const customModuleReference = document.getElementById("custom-module-reference");
const addCustomModuleButton = document.getElementById("add-custom-module");
const unitImageInput = document.getElementById("unit-image");
const unitImageStatus = document.getElementById("unit-image-status");
const removeUnitImageButton = document.getElementById("remove-unit-image");
const unitImageStage = document.getElementById("unit-image-stage");
const dafsmsImageInput = document.getElementById("dafsms-image");
const dafsmsImageStatus = document.getElementById("dafsms-image-status");
const removeDafsmsImageButton = document.getElementById("remove-dafsms-image");
const evacuationImageInput = document.getElementById("evacuation-image");
const evacuationImageStatus = document.getElementById("evacuation-image-status");
const removeEvacuationImageButton = document.getElementById("remove-evacuation-image");
const emergencyEquipmentFilesInput = document.getElementById("emergency-equipment-files");
const emergencyEquipmentFilesStatus = document.getElementById("emergency-equipment-files-status");
const removeEmergencyEquipmentFilesButton = document.getElementById("remove-emergency-equipment-files");
const gvoRiskFilesInput = document.getElementById("gvo-risk-files");
const gvoRiskStatus = document.getElementById("gvo-risk-status");
const removeGvoRiskFilesButton = document.getElementById("remove-gvo-risk-files");
const form1118FilesInput = document.getElementById("form-1118-files");
const form1118Status = document.getElementById("form-1118-status");
const removeForm1118FilesButton = document.getElementById("remove-form-1118-files");
const bioSurveyInput = document.getElementById("bio-survey-file");
const bioSurveyStatus = document.getElementById("bio-survey-status");
const removeBioSurveyButton = document.getElementById("remove-bio-survey");
const expandableFields = Array.from(document.querySelectorAll(".expandable-field"));
const fieldEditorModal = document.getElementById("field-editor-modal");
const fieldEditorTitle = document.getElementById("field-editor-title");
const fieldEditorText = document.getElementById("field-editor-text");
const fieldEditorCloseButton = document.getElementById("field-editor-close");
const fieldEditorCancelButton = document.getElementById("field-editor-cancel");
const fieldEditorSaveButton = document.getElementById("field-editor-save");

let state = loadState();
let activeExpandedField = null;
let previewRenderTimer = null;
let persistenceWarningShown = false;
const renderedPdfPageCache = new Map();

populateModuleSelect();
hydrateForm();
renderSelectedModules();
renderPreview();
renderUnitImageStatus();
renderUnitImagePreview();
if (dafsmsImageStatus) {
  renderDafsmsImageStatus();
}
renderEvacuationImageStatus();
renderEmergencyEquipmentFilesStatus();
renderGvoRiskStatus();
renderForm1118Status();
renderBioSurveyStatus();
toggleCustomModuleBuilder();

form.addEventListener("input", handleFormChange);
document.getElementById("add-module").addEventListener("click", addSelectedModule);
document.getElementById("save-browser").addEventListener("click", () => {
  saveState();
  window.alert("JSTO saved in this browser.");
});
document.getElementById("save-library").addEventListener("click", saveToLibrary);
const downloadJsonButton = document.getElementById("download-json");
if (downloadJsonButton) {
  downloadJsonButton.addEventListener("click", downloadState);
}
const uploadJsonInput = document.getElementById("upload-json");
if (uploadJsonInput) {
  uploadJsonInput.addEventListener("change", uploadState);
}
document.getElementById("print-pdf").addEventListener("click", exportPdf);
moduleSelect.addEventListener("change", handleModuleSelection);
addCustomModuleButton.addEventListener("click", addCustomModule);
unitImageInput.addEventListener("change", uploadUnitImage);
removeUnitImageButton.addEventListener("click", removeUnitImage);
if (dafsmsImageInput) {
  dafsmsImageInput.addEventListener("change", uploadDafsmsImage);
}
if (removeDafsmsImageButton) {
  removeDafsmsImageButton.addEventListener("click", removeDafsmsImage);
}
evacuationImageInput.addEventListener("change", uploadEvacuationImage);
removeEvacuationImageButton.addEventListener("click", removeEvacuationImage);
emergencyEquipmentFilesInput.addEventListener("change", uploadEmergencyEquipmentFiles);
removeEmergencyEquipmentFilesButton.addEventListener("click", removeEmergencyEquipmentFiles);
gvoRiskFilesInput.addEventListener("change", uploadGvoRiskFiles);
removeGvoRiskFilesButton.addEventListener("click", removeGvoRiskFiles);
form1118FilesInput.addEventListener("change", uploadForm1118Files);
removeForm1118FilesButton.addEventListener("click", removeForm1118Files);
bioSurveyInput.addEventListener("change", uploadBioSurvey);
removeBioSurveyButton.addEventListener("click", removeBioSurvey);
expandableFields.forEach((field) => {
  field.addEventListener("click", () => openFieldEditor(field));
});
fieldEditorCloseButton.addEventListener("click", closeFieldEditor);
fieldEditorCancelButton.addEventListener("click", closeFieldEditor);
fieldEditorSaveButton.addEventListener("click", saveExpandedField);
fieldEditorModal.addEventListener("click", (event) => {
  if (event.target === fieldEditorModal) {
    closeFieldEditor();
  }
});
fieldEditorText.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    saveExpandedField();
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeFieldEditor();
  }
});

function populateModuleSelect() {
  OPTIONAL_MODULES.forEach((module) => {
    const option = document.createElement("option");
    option.value = module.id;
    option.textContent = module.title;
    moduleSelect.appendChild(option);
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultState);
    }

    const parsed = JSON.parse(raw);
    const parsedSelectedModules = Array.isArray(parsed.selectedModules) ? parsed.selectedModules : [];
    const migratedRiskManagementModule = parsedSelectedModules.find((module) => module?.id === "local-4");
    return {
      meta: {
        ...defaultState.meta,
        ...parsed.meta,
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
      gvoRiskFiles: Array.isArray(parsed.gvoRiskFiles) ? parsed.gvoRiskFiles : [],
      form1118Files: Array.isArray(parsed.form1118Files) ? parsed.form1118Files : [],
      bioSurvey: {
        ...defaultState.bioSurvey,
        ...(parsed.bioSurvey || {})
      },
      selectedModules: parsedSelectedModules.filter((module) => module?.id !== "local-4")
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    persistenceWarningShown = false;
    return true;
  } catch (error) {
    if (!persistenceWarningShown) {
      persistenceWarningShown = true;
      window.alert("Browser save storage is full. Your changes still appear in this session, but very large uploads may not persist after refresh.");
    }
    console.warn("Unable to save JSTO state in browser storage.", error);
    return false;
  }
}

function schedulePreviewRender(delay = 250) {
  window.clearTimeout(previewRenderTimer);
  previewRenderTimer = window.setTimeout(() => {
    renderPreview();
  }, delay);
}

function hydrateForm() {
  Object.entries(state.meta).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field) {
      field.value = value;
    }
  });
}

function handleFormChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  state.meta[target.name] = target.value;
  saveState();
  schedulePreviewRender();
}

function openFieldEditor(field) {
  activeExpandedField = field;
  fieldEditorTitle.textContent = field.dataset.editorLabel || "Edit Field";
  fieldEditorText.value = field.value || "";
  fieldEditorModal.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => fieldEditorText.focus());
}

function closeFieldEditor() {
  fieldEditorModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeExpandedField = null;
}

function saveExpandedField() {
  if (!activeExpandedField) {
    return;
  }

  const value = fieldEditorText.value;
  activeExpandedField.value = value;
  state.meta[activeExpandedField.name] = value;
  saveState();
  renderPreview();
  closeFieldEditor();
}

function addSelectedModule() {
  const moduleId = moduleSelect.value;
  if (!moduleId) {
    return;
  }

  if (moduleId === "custom-other") {
    customModuleBuilder.hidden = false;
    customModuleTitle.focus();
    return;
  }

  if (state.selectedModules.some((module) => module.id === moduleId)) {
    return;
  }

  const module = OPTIONAL_MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  state.selectedModules.push({
    ...module,
    notes: "",
    link: ""
  });

  moduleSelect.value = "";
  saveState();
  renderSelectedModules();
  renderPreview();
}

function handleModuleSelection() {
  toggleCustomModuleBuilder();
  if (moduleSelect.value === "custom-other") {
    customModuleTitle.focus();
  }
}

function toggleCustomModuleBuilder() {
  customModuleBuilder.hidden = moduleSelect.value !== "custom-other";
}

function addCustomModule() {
  const title = customModuleTitle.value.trim();
  const reference = customModuleReference.value.trim();
  if (!title) {
    return;
  }

  state.selectedModules.push({
    id: `custom-${Date.now()}`,
    title,
    reference: reference || "Local guidance",
    trainingRequirement: "Document the local task or hazard, identify where the training is located, and explain how completion is documented.",
    trainingSource: "Custom module",
    notes: "",
    link: ""
  });

  customModuleTitle.value = "";
  customModuleReference.value = "";
  moduleSelect.value = "";
  customModuleBuilder.hidden = true;
  saveState();
  renderSelectedModules();
  renderPreview();
}

function renderSelectedModules() {
  selectedModulesContainer.innerHTML = "";

  if (!state.selectedModules.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No job-specific modules added yet. Use the dropdown to build an a la carte JSTO.";
    selectedModulesContainer.appendChild(empty);
    return;
  }

  state.selectedModules.forEach((module) => {
    const fragment = moduleTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".module-card");

    fragment.querySelector(".module-title").textContent = module.title;
    fragment.querySelector(".module-reference").textContent = module.reference;
    fragment.querySelector(".module-training-source").textContent = `Training basis: ${module.trainingSource || "Local guidance"}`;
    fragment.querySelector(".module-training-requirement").textContent = module.trainingRequirement || "Add local lesson-plan and training requirements for this module.";
    fragment.querySelector(".module-af-source").textContent = module.afTrainingSource ? `Air Force basis: ${module.afTrainingSource}` : "";
    fragment.querySelector(".module-af-requirement").textContent = module.afTrainingRequirement || "";

    const notesField = fragment.querySelector(".module-notes");
    notesField.value = module.notes;
    notesField.addEventListener("input", (event) => {
      module.notes = event.target.value;
      saveState();
      schedulePreviewRender();
    });

    const linkField = fragment.querySelector(".module-link");
    linkField.value = module.link || "";
    linkField.addEventListener("input", (event) => {
      module.link = event.target.value;
      saveState();
      schedulePreviewRender();
    });

    fragment.querySelector(".remove-module").addEventListener("click", () => {
      state.selectedModules = state.selectedModules.filter((item) => item.id !== module.id);
      saveState();
      renderSelectedModules();
      renderPreview();
    });

    selectedModulesContainer.appendChild(card);
  });
}

function renderPreview() {
  const meta = state.meta;
  const requiredTags = REQUIRED_MODULES.map((module) => `<span class="tag">${escapeHtml(module.title)}</span>`).join("");
  const optionalTags = state.selectedModules.length
    ? state.selectedModules.map((module) => `<span class="tag">${escapeHtml(module.title)}</span>`).join("")
    : `<p class="muted">No job-specific modules selected yet.</p>`;

  preview.innerHTML = `
    <header class="preview-header">
      ${renderUnitImageForPreview()}
      <div class="preview-title">Job Safety Training Outline</div>
      <div class="preview-subtitle">Built to align with DAFI 91-202 paragraph 14.1 requirements.</div>
      <div class="preview-grid">
        <div><strong>Unit:</strong> ${escapeHtml(meta.unit || "Not entered")}</div>
        <div><strong>Work Center:</strong> ${escapeHtml(meta.workCenter || "Not entered")}</div>
        <div><strong>Office Symbol:</strong> ${escapeHtml(meta.officeSymbol || "Not entered")}</div>
        <div><strong>Supervisor:</strong> ${escapeHtml(meta.supervisor || "Not entered")}</div>
        <div><strong>Phone:</strong> ${escapeHtml(meta.phone || "Not entered")}</div>
        <div><strong>Reviewer:</strong> ${escapeHtml(meta.reviewer || "Not entered")}</div>
        <div><strong>Review Date:</strong> ${escapeHtml(meta.reviewDate || "Not entered")}</div>
        <div><strong>Effective Date:</strong> ${escapeHtml(meta.effectiveDate || "Not entered")}</div>
      </div>
    </header>

    <section class="preview-section">
      <h3>Work Center Overview</h3>
      <p>${formatText(meta.workDescription, "Describe the mission, operating area, and the tasks covered by this JSTO.")}</p>
    </section>

    <section class="preview-section">
      <h3>Required Training Topics</h3>
      <div>${requiredTags}</div>
      <ul>
        <li><strong>Hazards and controls:</strong> Address task hazards, environmental hazards, governing instructions, and hierarchy of controls including elimination, engineering, substitution, and administrative controls.</li>
        <li><strong>PPE:</strong> Cover required protective equipment, wear/use procedures, cleaning, maintenance, storage, disposal, and supervisor notification concerns.</li>
        <li><strong>Emergency response:</strong> Cover emergency action, fire prevention, alarms, AEDs, extinguishers, evacuation, shelter, active shooter response, and emergency contact procedures.</li>
        <li><strong>Reporting:</strong> Explain unsafe condition reporting, injury/illness reporting, DAF Form 457, SAFEREP access, and anti-retaliation protections.</li>
        <li><strong>Program awareness:</strong> Include CA-10 / LS-201 location, traffic safety program requirements, DAFVA 91-209 location, and DAFSMS responsibilities.</li>
      </ul>
      ${renderHierarchyOfControls()}
      ${renderActiveShooterSection()}
    </section>

    <section class="preview-section">
      <h3>DAFSMS Framework</h3>
      ${renderDafsmsSection()}
    </section>

    <section class="preview-section">
      <h3>SAFEREP</h3>
      ${renderSaferepLink()}
    </section>

    <section class="preview-section">
      <h3>Reporting Unsafe Equipment, Conditions, or Procedures</h3>
      ${renderUnsafeReportingSection()}
    </section>

    <section class="preview-section">
      <h3>Use of Portable Fire Extinguishers</h3>
      ${renderFireExtinguisherSection()}
    </section>

    <section class="preview-section">
      <h3>Work Area Hazard Analysis</h3>
      <p>${formatText(meta.hazardAnalysis, "Summarize work area hazards, BE survey items, JHAs, JSAs, and other written guidance that support this JSTO.")}</p>
    </section>

    <section class="preview-section">
      <h3>Risk Management Fundamentals</h3>
      <p><strong>Reference:</strong> DAFSMS and local RM program guidance.</p>
      <p>Address hazard identification, control selection, local escalation expectations, and when RM refresher training must be completed for this work center.</p>
      <p>${formatText(meta.riskManagementNotes, "Document how the work center covers RM fundamentals, where refresher files or briefing materials are stored, and how personnel access those resources.")}</p>
    </section>

    <section class="preview-section">
      <h3>Job-Specific A La Carte Modules</h3>
      <div>${optionalTags}</div>
      ${renderOptionalModuleDetails()}
    </section>

    <section class="preview-section">
      <h3>References</h3>
      <p>${formatText(meta.references, "Enter TOs, JHAs, DAFIs, DAFMANs, local guidance, and manufacturer instructions used by this work center.")}</p>
    </section>

    <section class="preview-section">
      <h3>Required Documents</h3>
      ${renderRequiredDocuments()}
    </section>

    <section class="preview-section">
      <h3>DAF Traffic Safety Program</h3>
      ${renderTrafficSafetySection()}
    </section>

    <section class="preview-section">
      <h3>Emergency Information</h3>
      <ul>
        <li><strong>Emergency Numbers:</strong><br>${formatText(meta.emergencyNumbers, "Not entered")}</li>
        <li><strong>Medical Facility / Treatment:</strong><br>${formatText(meta.medicalFacility, "Not entered")}</li>
        <li><strong>Evacuation / Muster Point:</strong><br>${formatText(meta.evacuation, "Not entered")}</li>
        <li><strong>Shelter in Place:</strong><br>${formatText(meta.shelter, "Not entered")}</li>
        <li><strong>Active Shooter Response Methods:</strong><br>${formatText(meta.activeShooter, "Not entered")}</li>
        <li><strong>Adverse Weather Shelter:</strong><br>${formatText(meta.weatherShelter, "Not entered")}</li>
      </ul>
      ${renderEvacuationImage()}
    </section>

    <section class="preview-section">
      <h3>Emergency Equipment and Safety Board</h3>
      <p><strong>Safety Bulletin Board Location:</strong> ${escapeHtml(meta.bulletinBoard || "Not entered")}</p>
      <p>${formatText(meta.emergencyEquipment, "List fire pull stations, extinguishers, power cutoffs, eyewash stations, AEDs, foam systems, and any local fire/emergency equipment notes.")}</p>
      ${renderEmergencyEquipmentFiles()}
    </section>

    <section class="preview-section">
      <h3>Documentation and Review</h3>
      <p>${formatText(meta.documentationNotes, "Document initial, refresher, and task-specific training in the work center record, review annually or when work conditions change, and maintain records per local records management requirements.")}</p>
      ${renderForm1118Preview()}
      ${renderBioSurveyPreview()}
      <p><strong>Annual Review Log:</strong><br>${formatText(meta.annualReviewLog, "Record the supervisor name, review date, and contact information here.")}</p>
      <table class="signature-table">
        <thead>
          <tr>
            <th>Supervisor Name</th>
            <th>Date Reviewed</th>
            <th>Contact Info</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: 6 }, () => `
            <tr>
              <td>&nbsp;</td>
              <td></td>
              <td></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;

  renderEmbeddedPdfPages();
}

async function renderEmbeddedPdfPages() {
  const containers = Array.from(preview.querySelectorAll(".uploaded-asset-pdf-pages[data-pdf-src]"));
  if (!containers.length) {
    return;
  }

  await Promise.all(containers.map((container) => renderEmbeddedPdfPageContainer(container)));
}

async function renderEmbeddedPdfPageContainer(container) {
  const pdfSrc = container.dataset.pdfSrc || "";
  if (!pdfSrc || container.dataset.rendered === "true") {
    return;
  }

  if (!window.pdfjsLib) {
    container.innerHTML = '<div class="uploaded-asset-pdf-loading">PDF preview renderer is still loading. Try exporting again in a moment.</div>';
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

function renderHierarchyOfControls() {
  return `
    <div class="hoc-block">
      <div class="hoc-header">
        <h4>Hierarchy of Controls</h4>
        <p>Apply these controls from most effective to least effective when reducing workplace hazards under DAFI 91-202 paragraph 14.1.2.1.4.</p>
      </div>
      <figure class="hoc-image-wrap">
        <img class="hoc-image" src="assets/HOC.png?v=20260404-1" alt="Hierarchy of Controls reference image">
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
        <img class="active-shooter-image" src="assets/AS.png?v=20260408-1" alt="Active shooter response reference image">
      </figure>
      <div class="active-shooter-notes">
        <p><strong>Avoid (Run):</strong> The first and preferred course of action is to evacuate the area if a safe route is available. Maintain awareness of your surroundings and have an escape route planned. Leave your belongings, evacuate regardless of whether others follow, and do not attempt to move wounded people. Once you have reached a safe location, call 911 and provide any information you have.</p>
        <p><strong>Deny (Hide):</strong> If you cannot evacuate, your next priority is to deny the attacker access to your location. This involves more than just hiding; it means securing your position. Lock and blockade doors with heavy furniture, turn off lights, silence your phone, and remain out of the shooter's view. Remember that concealment only hides you, while cover can offer protection from bullets.</p>
        <p><strong>Defend (Fight):</strong> As a last resort, when your life is in immediate danger, you must be prepared to defend yourself. Act aggressively and take action against the shooter. Improvise weapons from your surroundings and commit to your actions. Taking action may be risky, but it could be your best or only chance for survival.</p>
        <p><strong>When law enforcement arrives:</strong> Remain calm, follow all instructions, keep your hands visible with fingers spread, and be prepared to provide information about the shooter's location, number, and description.</p>
      </div>
    </div>
  `;
}

function renderDafsmsSection() {
  return `
    <div class="dafsms-block">
      <div class="dafsms-intro">
        <p><strong>DAFSMS</strong> uses four pillars and the DAFSMS framework to structure the mishap prevention program through continuous improvement and the Plan-Do-Check-Act model.</p>
      </div>
      ${renderDafsmsImage()}
      <div class="dafsms-framework-grid" aria-label="Department of the Air Force SMS Framework">
        <article class="dafsms-panel-card">
          <h4>Policy and Leadership</h4>
          <p>Provides the structure for a proactive mishap prevention program through policy, active leadership engagement, and clearly defined responsibilities at every level.</p>
        </article>
        <article class="dafsms-panel-card">
          <h4>Risk Management</h4>
          <p>Integrates hazard identification, assessment, and control decisions into daily operations to reduce mishaps and strengthen safety culture.</p>
        </article>
        <article class="dafsms-panel-card">
          <h4>Assurance</h4>
          <p>Uses evaluations, monitoring, reviews, and data to confirm the mishap prevention program is implemented and improving over time.</p>
        </article>
        <article class="dafsms-panel-card">
          <h4>Promotion, Education, and Training</h4>
          <p>Ensures Airmen and Guardians receive safety awareness information, embedded training, effective risk controls, and active engagement in mishap prevention.</p>
        </article>
      </div>

      <div class="dafsms-notes">
        <p><strong>1. Purpose.</strong> DAFSMS utilizes the four pillars and the DAFSMS framework to structure the mishap prevention program. Activities associated with each pillar set policy, identify and mitigate hazards and risk, and reduce the occurrence and cost of injuries, illnesses, fatalities, and property damage through continuous improvement and the PDCA model.</p>
        <p><strong>2. Policy and Leadership.</strong> Safety policy provides the structure for a sound and proactive mishap prevention program. Active leadership involvement in implementation and execution is critical at all levels of command.</p>
        <p><strong>3. Risk Management.</strong> Ensure the RM process is fully integrated into all safety-related activities to enhance mishap prevention and sustain a proactive safety culture. Refer to DAFI 90-802 and DAFPAM 90-803 for additional detail.</p>
        <p><strong>4. Assurance.</strong> Safety assurance is how commanders determine whether mishap prevention elements are implemented and guides continuous improvement through evaluation, monitoring, and review.</p>
        <p><strong>5. Promotion, Education, and Training.</strong> Ensure Airmen and Guardians are provided safety awareness information, organizations have embedded ongoing training into the mishap prevention program, effective risk controls are implemented, and personnel remain actively engaged.</p>
      </div>
    </div>
  `;
}

function renderDafsmsImage() {
  const src = state.dafsmsImage.dataUrl || "assets/dafsms-pillars.png?v=20260404-1";

  return `
    <figure class="dafsms-image-wrap">
      <img class="dafsms-image" src="${src}" alt="DAFSMS reference image">
    </figure>
  `;
}

function renderSaferepLink() {
  return `
    <div class="saferep-block">
      <a class="saferep-link-card" href="https://saferep.safety.af.mil" target="_blank" rel="noreferrer">
        <img class="saferep-image" src="assets/SAFEREP.jpg?v=20260404-1" alt="SAFEREP reporting portal">
      </a>
      <div class="saferep-copy">
        <p>SAFEREP is the Department of the Air Force's (DAF) premiere digital safety reporting tool and mobile app. It allows Airmen and Guardians to easily report hazardous conditions, near-misses, unintentional errors, or safety concerns across all disciplines, including workplace, traffic, industrial, flight, weapons, and space safety, directly from their devices anytime and anywhere.</p>
        <p>Fully integrated with the Air Force Safety Automated System (AFSAS), it replaces the earlier Airman Safety App and serves as the DAF's only fully digital safety reporting avenue. Users simply answer a short series of questions to submit reports that reach the appropriate Major Command (MAJCOM) safety office quickly and efficiently.</p>
        <p><strong>Key Benefits for Job Safety Training:</strong></p>
        <ul>
          <li><strong>Empowers everyone:</strong> Turns every Airman or Guardian into a proactive sensor for hazard identification, encouraging a strong safety culture where people feel comfortable speaking up without barriers like paperwork or word-of-mouth delays.</li>
          <li><strong>Prevents mishaps:</strong> Enables early mitigation of risks before they lead to incidents, capturing minor events and near-misses that offer the greatest prevention potential.</li>
          <li><strong>Simple and accessible:</strong> Mobile-first design makes reporting fast, more efficient than traditional methods, and available on the spot through the app on Google Play and the Apple App Store.</li>
          <li><strong>Broad coverage and integration:</strong> Supports multiple safety areas and includes specialized features such as Aviation Safety Action Program reporting, improving visibility, tracking, and overall risk management across the force.</li>
        </ul>
        <p>This tool strengthens operational readiness by fostering a proactive, data-driven approach to safety. You can download it from the app stores or access it through the official SAFEREP site for more details.</p>
        <p><strong>SAFEREP portal:</strong> <a href="https://saferep.safety.af.mil" target="_blank" rel="noreferrer">https://saferep.safety.af.mil</a></p>
        <p><strong>Learn more:</strong> <a href="https://www.safety.af.mil/Home/SAFEREP/" target="_blank" rel="noreferrer">https://www.safety.af.mil/Home/SAFEREP/</a></p>
      </div>
    </div>
  `;
}

function renderFireExtinguisherSection() {
  return `
    <div class="fire-extinguisher-block">
      <img class="fire-extinguisher-image" src="assets/fire?v=20260407-1" alt="PASS method for portable fire extinguishers">
      <div class="fire-extinguisher-copy">
        <p><strong>Portable fire extinguishers are intended for small, incipient-stage fires only.</strong> Personnel should use an extinguisher only when they have been trained, the fire is small and contained, the correct extinguisher is available, and there is a clear evacuation path behind them.</p>
        <p>Use the <strong>PASS</strong> method when operating a portable fire extinguisher: <strong>Pull</strong> the pin, <strong>Aim</strong> at the base of the fire, <strong>Squeeze</strong> the handle, and <strong>Sweep</strong> side to side.</p>
        <p>If the fire grows, smoke conditions worsen, or the extinguisher does not control the fire immediately, evacuate the area, activate the local emergency response process, and report the incident to emergency services and supervision.</p>
      </div>
    </div>
  `;
}

function renderUnsafeReportingSection() {
  return `
    <div class="unsafe-reporting-block">
      <div class="unsafe-reporting-copy">
        <p><strong>Employees must report unsafe equipment, conditions, or procedures to their supervisor immediately.</strong> This includes any hazard that could injure personnel, damage equipment, or create an unsafe work process.</p>
        <p>Personnel must also be notified that unsafe conditions, work-related injuries, and illnesses may be reported <strong>without fear of retaliation</strong>. Immediate supervisor involvement remains the primary reporting path, with SAFEREP and formal hazard-report channels available when needed.</p>
      </div>
      <div class="unsafe-reporting-grid" aria-label="Unsafe reporting requirements">
        <article class="unsafe-reporting-card">
          <h4>What To Report</h4>
          <ul>
            <li>Unsafe equipment that is broken, damaged, unserviceable, or missing required guards or controls.</li>
            <li>Unsafe conditions or procedures that create a hazard to personnel, operations, or facilities.</li>
            <li>Work-related injuries, illnesses, near-misses, and hazards needing immediate attention.</li>
          </ul>
        </article>
        <article class="unsafe-reporting-card">
          <h4>Immediate Actions</h4>
          <ul>
            <li>Notify the supervisor or responsible area lead immediately.</li>
            <li>If the hazard can be safely controlled, stop use and isolate the equipment or area until corrected.</li>
            <li>If the danger is imminent to life or health, evacuate the area and activate emergency response procedures.</li>
          </ul>
        </article>
      </div>
      <div class="unsafe-reporting-tags">
        <p><strong>Tag use examples:</strong> Use the appropriate danger, caution, out-of-order, or do-not-start tag to keep unsafe equipment out of service until the hazard has been corrected and the responsible supervisor authorizes return to use.</p>
        <div class="unsafe-reporting-tag-gallery" aria-label="Unsafe equipment tag examples">
          <figure class="unsafe-reporting-tag-item">
            <img src="assets/AF%20Form%20979.jpg" alt="AF Form 979 danger tag">
          </figure>
          <figure class="unsafe-reporting-tag-item">
            <img src="assets/AF%20Form%20980.jpg" alt="AF Form 980 caution tag">
          </figure>
          <figure class="unsafe-reporting-tag-item">
            <img src="assets/AF%20Form%20981.jpg" alt="AF Form 981 out of order tag">
          </figure>
          <figure class="unsafe-reporting-tag-item">
            <img src="assets/AF%20Form%20982.png" alt="AF Form 982 do not start tag">
          </figure>
        </div>
        <p><strong>Escalation:</strong> If the issue cannot be resolved at the lowest level, elevate it through the unit safety representative, DAF Form 457 process, or SAFEREP as appropriate.</p>
      </div>
    </div>
  `;
}

function renderTrafficSafetySection() {
  const meta = state.meta;
  return `
    <div class="traffic-safety-block">
      <div class="traffic-safety-copy">
        <p><strong>Reference:</strong> DAFI 91-207. Requirements of the DAF traffic safety program include mandatory use of seat belts and helmets, speed limits, local traffic hazards, spotters while backing, and vehicle training requirements.</p>
        <p>Additionally, brief prohibition or restrictions on electronic-device use while operating vehicles on- or off-base, and discuss motorcycle safety training requirements before riding a motorcycle.</p>
      </div>
      <div class="traffic-safety-grid" aria-label="Traffic safety requirements">
        <article class="traffic-safety-card">
          <h4>On-Base / Vehicle Operations</h4>
          <ul>
            <li>Obey posted speed limits, traffic control devices, and local roadway rules.</li>
            <li>Use installed seat belts and occupant restraints as designed by the manufacturer.</li>
            <li>Use spotters while backing when required by local policy, task conditions, or vehicle type.</li>
            <li>Complete required GOV, GVO, golf cart, low-speed vehicle, or mission-specific vehicle training before operation.</li>
          </ul>
        </article>
        <article class="traffic-safety-card">
          <h4>Electronic Devices / Headphones</h4>
          <ul>
            <li>Do not use non-hands-free electronic devices while operating a motor vehicle.</li>
            <li>Stop in a safe location before using a phone if hands-free operation is not available.</li>
            <li>Do not wear headphones or listening devices in ways that interfere with hearing traffic, alarms, or emergency warnings.</li>
          </ul>
        </article>
        <article class="traffic-safety-card">
          <h4>Motorcycle / ATV Safety</h4>
          <ul>
            <li>Complete required motorcycle rider training before riding on a roadway.</li>
            <li>Wear required PPE including helmet, eye protection, gloves, protective clothing, and over-the-ankle footwear.</li>
            <li>Carry proof of required training when applicable and comply with state licensing requirements.</li>
          </ul>
        </article>
        <article class="traffic-safety-card">
          <h4>Pedestrian / Bicycle Awareness</h4>
          <ul>
            <li>Use caution at crossings, follow traffic controls, and wear visibility gear when exposed to roadway hazards.</li>
            <li>Use required lighting and reflective equipment during darkness, reduced visibility, or inclement weather.</li>
          </ul>
        </article>
      </div>
      <figure class="traffic-safety-image-wrap">
        <img class="traffic-safety-image" src="assets/motorcycle.png?v=20260410-1" alt="Motorcycle safety reference image">
      </figure>
      <div class="traffic-safety-notes">
        <p><strong>Local Traffic Hazards / Vehicle Notes:</strong><br>${formatText(meta.trafficSafetyNotes, "Enter local gate hazards, base-specific traffic concerns, spotter rules, and where vehicle training is documented.")}</p>
        <p><strong>Motorcycle Safety Representatives / Traffic Contacts:</strong><br>${formatText(meta.motorcycleSafetyReps, "List unit or group motorcycle safety representatives, traffic safety contacts, and local rider briefing requirements.")}</p>
        ${renderGvoRiskPreview()}
      </div>
    </div>
  `;
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
      note: "UNITS MUST FILL IN THEIR OWN DAFVA 91-209 POSTING/LOCATION INFORMATION."
    },
    {
      label: "LS-201",
      href: "required-docs/ls-201.pdf",
      description: "Notice of Employee’s Injury or Death (Non-Appropriated Funds). Use this when applicable for NAF employee injury or death reporting."
    }
  ];

  const items = docs.map((doc) => `
    <li>
      <a href="${doc.href}" target="_blank" rel="noreferrer">${doc.label}</a>${doc.note ? ` <span class="required-doc-inline-note">${doc.note}</span>` : ""}<br>
      <span class="muted">${doc.description}</span>
    </li>
  `).join("");

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
    dafsmsImageStatus.textContent = "No DAFSMS reference image uploaded yet.";
    return;
  }

  dafsmsImageStatus.textContent = `Loaded DAFSMS image: ${state.dafsmsImage.name || "uploaded image"}`;
}

function renderEvacuationImage() {
  if (!state.evacuationImage.dataUrl) {
    return `<p class="muted">No evacuation route image uploaded.</p>`;
  }

  return `
    <div class="evacuation-image-block">
      <strong>Emergency Evacuation Route:</strong>
      <img
        class="route-image"
        src="${state.evacuationImage.dataUrl}"
        alt="Emergency evacuation route for ${escapeHtml(state.meta.workCenter || "work center")}"
      >
    </div>
  `;
}

function renderEvacuationImageStatus() {
  if (!state.evacuationImage.dataUrl) {
    evacuationImageStatus.textContent = "No evacuation route image uploaded yet.";
    return;
  }

  evacuationImageStatus.textContent = `Loaded evacuation route image: ${state.evacuationImage.name || "uploaded image"}`;
}

function renderEmergencyEquipmentFilesStatus() {
  const count = state.emergencyEquipmentFiles.length;
  if (!count) {
    emergencyEquipmentFilesStatus.textContent = "No emergency equipment maps or photos uploaded yet.";
    return;
  }

  emergencyEquipmentFilesStatus.textContent = `${count} emergency equipment file${count === 1 ? "" : "s"} loaded.`;
}

function renderUploadedAsset(file, fallbackName, imageAltPrefix) {
  const safeName = escapeHtml(file?.name || fallbackName);
  const safeHref = escapeHtml(file?.dataUrl || "");
  const type = String(file?.type || "").toLowerCase();
  const extension = String(file?.name || "").split(".").pop()?.toLowerCase() || "";
  const isImage = type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(extension);
  const isPdf = type.includes("pdf") || extension === "pdf";

  if (isImage && safeHref) {
    return `
      <figure class="uploaded-asset uploaded-asset-image">
        <img class="uploaded-asset-image-file" src="${safeHref}" alt="${escapeHtml(imageAltPrefix)}: ${safeName}">
        <figcaption class="uploaded-asset-name">${safeName}</figcaption>
      </figure>
    `;
  }

  if (isPdf) {
    return `
      <div class="uploaded-asset uploaded-asset-card uploaded-asset-pdf">
        <div class="uploaded-asset-pdf-header">
          <div class="uploaded-asset-badge">PDF</div>
          <div class="uploaded-asset-copy">
            <strong>${safeName}</strong>
            <span>Embedded PDF preview.</span>
          </div>
        </div>
        ${safeHref ? `
          <div
            class="uploaded-asset-pdf-pages"
            data-pdf-src="${safeHref}"
            data-pdf-name="${safeName}"
          >
            <div class="uploaded-asset-pdf-loading">Rendering PDF pages...</div>
          </div>
        ` : ""}
      </div>
    `;
  }

  return `
    <div class="uploaded-asset uploaded-asset-card">
      <div class="uploaded-asset-badge">FILE</div>
      <div class="uploaded-asset-copy">
        <strong>${safeName}</strong>
        <span>Attachment included with this JSTO export.</span>
      </div>
      ${safeHref ? `<a href="${safeHref}" target="_blank" rel="noreferrer">Open file</a>` : ""}
    </div>
  `;
}

function renderEmergencyEquipmentFiles() {
  if (!state.emergencyEquipmentFiles.length) {
    return `<p class="muted">No emergency equipment maps or photos uploaded.</p>`;
  }

  const items = state.emergencyEquipmentFiles.map((file, index) => `
      <li>${renderUploadedAsset(file, `Attachment ${index + 1}`, "Emergency equipment map or photo")}</li>
    `).join("");

  return `
    <div class="emergency-equipment-files-preview">
      <strong>Emergency Equipment Maps / Photos:</strong>
      <ul>${items}</ul>
    </div>
  `;
}

function renderGvoRiskStatus() {
  const count = state.gvoRiskFiles.length;
  if (!count) {
    gvoRiskStatus.textContent = "No GVO risk assessment files uploaded yet.";
    return;
  }

  gvoRiskStatus.textContent = `${count} GVO risk assessment file${count === 1 ? "" : "s"} loaded.`;
}

function renderGvoRiskPreview() {
  if (!state.gvoRiskFiles.length) {
    return `<p class="muted">No GVO risk assessment files uploaded.</p>`;
  }

  const items = state.gvoRiskFiles.map((file, index) => `
      <li>${renderUploadedAsset(file, `GVO Risk Assessment ${index + 1}`, "GVO risk assessment attachment")}</li>
    `).join("");

  return `
    <div class="gvo-risk-files-preview">
      <strong>Routine Use of GVOs Risk Assessment:</strong>
      <ul>${items}</ul>
    </div>
  `;
}

function renderForm1118Status() {
  const count = state.form1118Files.length;
  if (!count) {
    form1118Status.textContent = "No DAF Form 1118 files uploaded yet.";
    return;
  }

  form1118Status.textContent = `${count} DAF Form 1118 file${count === 1 ? "" : "s"} loaded.`;
}

function renderForm1118Preview() {
  if (!state.form1118Files.length) {
    return `<p class="muted">No DAF Form 1118 files uploaded.</p>`;
  }

  const items = state.form1118Files.map((file, index) => `
      <li>${renderUploadedAsset(file, `DAF Form 1118 ${index + 1}`, "DAF Form 1118 attachment")}</li>
    `).join("");

  return `
    <div class="form-1118-files-preview">
      <strong>Upload your DAF Form 1118's here:</strong>
      <ul>${items}</ul>
    </div>
  `;
}

function renderBioSurveyStatus() {
  if (!state.bioSurvey.name) {
    bioSurveyStatus.textContent = "No Bioenvironmental Workplace Survey uploaded yet.";
    return;
  }

  bioSurveyStatus.textContent = `Loaded Bioenvironmental Workplace Survey: ${state.bioSurvey.name}`;
}

function renderBioSurveyPreview() {
  if (!state.bioSurvey.name) {
    return `<p class="muted">No Bioenvironmental Workplace Survey uploaded.</p>`;
  }

  return `
    <div class="bio-survey-preview">
      <strong>Bioenvironmental Workplace Survey:</strong>
      ${renderUploadedAsset(state.bioSurvey, state.bioSurvey.name || "Bioenvironmental Workplace Survey", "Bioenvironmental workplace survey")}
    </div>
  `;
}

function formatText(value, fallback) {
  return escapeHtml(value || fallback).replace(/\n/g, "<br>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createStateFilename(suffix = "outline") {
  const parts = [
    state.meta.unit,
    state.meta.workCenter,
    suffix
  ]
    .map((value) => String(value || "").trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"))
    .filter(Boolean);

  return `${parts.join("-") || "jsto-outline"}.json`;
}

function createExportPdfFilename() {
  const exportBasename = String(state.meta.exportBasename || "")
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-")
    .replace(/[. ]+$/g, "")
    .trim();

  if (exportBasename) {
    return `${exportBasename}.pdf`;
  }

  return createStateFilename("library-package").replace(/\.json$/i, ".pdf");
}

function createPdfPayload() {
  return {
    submittedAt: new Date().toISOString(),
    libraryVersion: 1,
    filename: createExportPdfFilename(),
    unit: state.meta.unit || "",
    workCenter: state.meta.workCenter || "",
    officeSymbol: state.meta.officeSymbol || "",
    previewHtml: preview.innerHTML
  };
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
  exportButton.textContent = "Exporting...";

  try {
    await renderEmbeddedPdfPages();
    const response = await fetch(`${LIBRARY_UPLOAD_URL}/api/export-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createPdfPayload())
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || "PDF export failed.");
    }

    const pdfBlob = await response.blob();
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = createPdfPayload().filename || "jsto-export.pdf";
    link.click();
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF export failed.";
    window.alert(`${message} You can still use your browser print dialog as a fallback.`);
  } finally {
    exportButton.disabled = false;
    exportButton.textContent = originalLabel;
  }
}

function downloadState(filename = createStateFilename()) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveToLibrary() {
  saveState();
  if (!LIBRARY_UPLOAD_URL) {
    window.alert("The JSTO Library upload service is not configured yet. Add your Render service URL in index.html before using this button.");
    return;
  }

  const saveLibraryButton = document.getElementById("save-library");
  const originalLabel = saveLibraryButton.textContent;
  saveLibraryButton.disabled = true;
  saveLibraryButton.textContent = "Saving...";

  try {
    await renderEmbeddedPdfPages();
    const response = await fetch(`${LIBRARY_UPLOAD_URL}/api/save-library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createPdfPayload())
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

  const loadedFiles = await Promise.all(files.map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        dataUrl: String(reader.result || ""),
        type: file.type || ""
      });
    };
    reader.readAsDataURL(file);
  })));

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

async function uploadGvoRiskFiles(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    return;
  }

  const loadedFiles = await Promise.all(files.map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        dataUrl: String(reader.result || ""),
        type: file.type || ""
      });
    };
    reader.readAsDataURL(file);
  })));

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

  const loadedFiles = await Promise.all(files.map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        dataUrl: String(reader.result || ""),
        type: file.type || ""
      });
    };
    reader.readAsDataURL(file);
  })));

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

  const reader = new FileReader();
  reader.onload = () => {
    state.bioSurvey = {
      name: file.name,
      dataUrl: String(reader.result || ""),
      type: file.type || ""
    };
    saveState();
    renderBioSurveyStatus();
    renderPreview();
  };
  reader.readAsDataURL(file);
}

function removeBioSurvey() {
  state.bioSurvey = { ...defaultState.bioSurvey };
  bioSurveyInput.value = "";
  saveState();
  renderBioSurveyStatus();
  renderPreview();
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
      state = {
        meta: { ...defaultState.meta, ...parsed.meta },
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
        gvoRiskFiles: Array.isArray(parsed.gvoRiskFiles) ? parsed.gvoRiskFiles : [],
        form1118Files: Array.isArray(parsed.form1118Files) ? parsed.form1118Files : [],
        bioSurvey: {
          ...defaultState.bioSurvey,
          ...(parsed.bioSurvey || {})
        },
        selectedModules: Array.isArray(parsed.selectedModules) ? parsed.selectedModules : []
      };
      hydrateForm();
      renderSelectedModules();
      renderUnitImageStatus();
      renderUnitImagePreview();
      renderDafsmsImageStatus();
      renderEvacuationImageStatus();
      renderEmergencyEquipmentFilesStatus();
      renderForm1118Status();
      renderBioSurveyStatus();
      renderPreview();
      saveState();
    } catch {
      window.alert("That JSON file could not be loaded.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}
