(() => {
  const files = {
    "/cases/fpa-operating-plan/": "/assets/downloads/financial-models/AtlasCloud_FP&A_Operating_Plan.xlsx",
    "/cases/finance-data-pipeline/": "/assets/downloads/financial-models/finance_management_pack.xlsx",
    "/cases/fpt-valuation/": "/assets/downloads/financial-models/FPT_FMVA_Valuation_Model.xlsx",
    "/cases/working-capital-cash/": "/assets/downloads/financial-models/Northstar_13_Week_Cash_and_Working_Capital_Model.xlsx",
    "/cases/capex-investment-committee/": "/assets/downloads/financial-models/Orion_CAPEX_Business_Case_and_IC_Pack.xlsx"
  };

  const normalizedPath = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  const file = files[normalizedPath];
  const heroCopy = document.querySelector(".caseHeroGrid > div");

  if (file && heroCopy && !heroCopy.querySelector(".caseHeroActions")) {
    const actions = document.createElement("div");
    actions.className = "caseHeroActions";
    actions.innerHTML = `<a class="excelDownload" href="${file}" download>Download Excel <span>↓</span></a>`;
    heroCopy.append(actions);
  }

  document.querySelectorAll(".githubSecondary").forEach((link) => {
    if (/\.xlsx(?:$|\?)/i.test(link.href)) link.textContent = "Download Excel file ↓";
  });

  document.querySelectorAll(".caseBody .caseImage img, .caseBody .imageGrid img").forEach((img) => {
    if (img.closest(".evidenceZoom")) return;
    const link = document.createElement("a");
    link.className = "evidenceZoom";
    link.href = img.getAttribute("src");
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `Open full-size image: ${img.alt || "financial model evidence"}`);
    img.parentNode.insertBefore(link, img);
    link.append(img);

    const sizeWideEvidence = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      if (img.naturalWidth / img.naturalHeight < 2.7) return;

      link.classList.add("wideEvidence");
      link.parentElement.classList.add("wideEvidenceFrame");
      const inspectionWidth = Math.min(Math.max(img.naturalWidth, 1400), 1800);
      link.style.setProperty("--evidence-width", `${inspectionWidth}px`);
    };

    if (img.complete) sizeWideEvidence();
    else img.addEventListener("load", sizeWideEvidence, { once: true });
  });
})();
