(() => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnnualReviewPreview, { once: true });
  } else {
    initAnnualReviewPreview();
  }

  function initAnnualReviewPreview() {
    const preview = document.getElementById("preview");
    const form = document.getElementById("jsto-form");
    if (!preview || !form) {
      return;
    }

    const sync = () => {
      normalizeAnnualReviewPreview(preview, form);
    };

    const observer = new MutationObserver(() => {
      sync();
    });
    observer.observe(preview, { childList: true, subtree: true });

    ["annualReviewLog", "supervisor", "phone", "reviewer", "reviewDate"].forEach((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      if (!field) {
        return;
      }
      field.addEventListener("input", sync);
      field.addEventListener("change", sync);
    });

    sync();
  }

  function normalizeAnnualReviewPreview(preview, form) {
    const reviewTable = findAnnualReviewTable(preview);
    if (!reviewTable) {
      return;
    }

    const entries = buildAnnualReviewEntries(form);
    populateAnnualReviewTable(reviewTable, entries);
    cleanAnnualReviewIntro(reviewTable);
  }

  function findAnnualReviewTable(preview) {
    return Array.from(preview.querySelectorAll("table")).find((table) => {
      const headers = Array.from(table.querySelectorAll("th")).map((cell) => normalizeText(cell.textContent));
      return headers.includes("supervisor name")
        && headers.includes("date reviewed")
        && headers.includes("contact info");
    }) || null;
  }

  function buildAnnualReviewEntries(form) {
    const rawLog = String(form.elements.namedItem("annualReviewLog")?.value || "").trim();
    const pipeDelimited = parsePipeDelimitedEntries(rawLog);
    if (pipeDelimited.length) {
      return pipeDelimited;
    }

    const triplets = parseTripletEntries(rawLog);
    if (triplets.length) {
      return triplets;
    }

    const fallbackName = String(form.elements.namedItem("reviewer")?.value || form.elements.namedItem("supervisor")?.value || "").trim();
    const fallbackDate = formatDateForPreview(String(form.elements.namedItem("reviewDate")?.value || "").trim());
    const fallbackContact = String(form.elements.namedItem("phone")?.value || "").trim();

    if (fallbackName || fallbackDate || fallbackContact) {
      return [{ name: fallbackName, date: fallbackDate, contact: fallbackContact }];
    }

    return [];
  }

  function parsePipeDelimitedEntries(rawLog) {
    return rawLog
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => line.includes("|"))
      .map((line) => {
        const [name = "", date = "", contact = ""] = line.split("|").map((part) => part.trim());
        return {
          name,
          date: formatDateForPreview(date),
          contact
        };
      })
      .filter((entry) => entry.name || entry.date || entry.contact);
  }

  function parseTripletEntries(rawLog) {
    const lines = rawLog
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length || lines.length % 3 !== 0) {
      return [];
    }

    const entries = [];
    for (let index = 0; index < lines.length; index += 3) {
      entries.push({
        name: lines[index] || "",
        date: formatDateForPreview(lines[index + 1] || ""),
        contact: lines[index + 2] || ""
      });
    }
    return entries.filter((entry) => entry.name || entry.date || entry.contact);
  }

  function populateAnnualReviewTable(table, entries) {
    const allRows = Array.from(table.querySelectorAll("tr"));
    if (!allRows.length) {
      return;
    }

    const headerRow = allRows[0];
    const existingRows = allRows.slice(1);
    const targetCount = Math.max(existingRows.length, entries.length || 1);

    while (existingRows.length < targetCount) {
      const row = document.createElement("tr");
      row.innerHTML = "<td></td><td></td><td></td>";
      table.appendChild(row);
      existingRows.push(row);
    }

    existingRows.forEach((row, index) => {
      const cells = Array.from(row.querySelectorAll("td"));
      while (cells.length < 3) {
        const cell = document.createElement("td");
        row.appendChild(cell);
        cells.push(cell);
      }

      const entry = entries[index] || { name: "", date: "", contact: "" };
      cells[0].textContent = entry.name;
      cells[1].textContent = entry.date;
      cells[2].textContent = entry.contact;
    });

    if (headerRow.parentElement?.tagName === "TBODY") {
      return;
    }
  }

  function cleanAnnualReviewIntro(table) {
    const intro = table.previousElementSibling;
    if (!intro || !/annual review/i.test(intro.textContent || "")) {
      return;
    }

    intro.innerHTML = "<strong>Annual Review History:</strong><br><span class=\"muted\">Each annual review entry is shown in the table below.</span>";
  }

  function formatDateForPreview(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split("-");
      return `${month}/${day}/${year}`;
    }

    return trimmed;
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }
})();
