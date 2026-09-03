(() => {
  const configs = {
    "/cases/fpa-operating-plan/": {
      code: "01",
      label: "FP&A OPERATING PLAN",
      title: "Operating plan.<br><em>Rolling forecast.</em>",
      dashboardTitle: "See the plan.<br>Trace the drivers.",
      dashboardCopy: "The executive view puts revenue, EBITDA and ending cash on one review surface before the supporting bridge, scenarios and monthly liquidity detail.",
      chrome: "ATLAS CLOUD · FP&A OPERATING PLAN",
      signals: [["Horizon", "12-month rolling view"], ["Drivers", "Units · price · hiring · opex"], ["Guardrail", "Monthly ending cash"]],
      accent: "#315cff",
      accentInk: "#ffffff",
      shadow: "#315cff",
      download: "/assets/downloads/financial-models/AtlasCloud_FP&A_Operating_Plan.xlsx"
    },
    "/cases/finance-data-pipeline/": {
      code: "02",
      label: "FINANCE DATA PIPELINE",
      title: "Data pipeline.<br><em>Executive P&amp;L.</em>",
      dashboardTitle: "See the result.<br>Trace the pipeline.",
      dashboardCopy: "The executive P&L stays connected to monthly source files, mapping logic and distribution controls so management can explain both the result and its reliability.",
      chrome: "FINANCE BI · EXECUTIVE P&L",
      signals: [["Cadence", "Monthly management close"], ["Flow", "Files → model → executive P&L"], ["Distribution gate", "Control status must pass"]],
      accent: "#ff6846",
      accentInk: "#121828",
      shadow: "#ff6846",
      download: "/assets/downloads/financial-models/finance_management_pack.xlsx"
    },
    "/cases/fpt-valuation/": {
      code: "03",
      label: "FPT VALUATION",
      title: "FPT valuation.<br><em>Transparent DCF.</em>",
      dashboardTitle: "See the value.<br>Stress the assumptions.",
      dashboardCopy: "The investment summary leads with the answer, then the operating forecast, DCF bridge and WACC–growth sensitivity expose what creates the value range.",
      chrome: "FPT · VALUATION MODEL",
      signals: [["Horizon", "2021A–2030E"], ["Drivers", "Growth · margin · reinvestment"], ["Sensitivity", "WACC × terminal growth"]],
      accent: "#9fc622",
      accentInk: "#121828",
      shadow: "#9fc622",
      download: "/assets/downloads/financial-models/FPT_FMVA_Valuation_Model.xlsx"
    },
    "/cases/working-capital-cash/": {
      code: "04",
      label: "WORKING CAPITAL & CASH",
      title: "13-week cash flow.<br><em>Working capital.</em>",
      dashboardTitle: "See the cash.<br>Trace the actions.",
      dashboardCopy: "The weekly dashboard connects collections, supplier timing, inventory and facility capacity to the point where liquidity requires an owner and an action.",
      chrome: "NORTHSTAR · 13-WEEK CASH",
      signals: [["Cadence", "13 weekly periods"], ["Drivers", "AR · AP · inventory"], ["Guardrail", "Facility and liquidity headroom"]],
      accent: "#00a7a0",
      accentInk: "#121828",
      shadow: "#00a7a0",
      download: "/assets/downloads/financial-models/Northstar_13_Week_Cash_and_Working_Capital_Model.xlsx"
    },
    "/cases/capex-investment-committee/": {
      code: "05",
      label: "CAPEX INVESTMENT CASE",
      title: "CAPEX business case.<br><em>IC pack.</em>",
      dashboardTitle: "See the return.<br>Trace the risks.",
      dashboardCopy: "The investment pack connects installed cost, operating benefits, NPV, IRR, sensitivity and approval conditions before capital is committed.",
      chrome: "ORION · CAPEX IC PACK",
      signals: [["Horizon", "Eight-year investment case"], ["Drivers", "Cost · benefits · timing"], ["Governance", "Stage-gated approval"]],
      accent: "#d68a19",
      accentInk: "#121828",
      shadow: "#d68a19",
      download: "/assets/downloads/financial-models/Orion_CAPEX_Business_Case_and_IC_Pack.xlsx"
    }
  };

  const normalizedPath = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  const config = configs[normalizedPath];
  const hero = document.querySelector(".caseHero");
  const body = document.querySelector(".caseBody");
  const header = document.querySelector(".siteHeader");
  if (!config || !hero || !body || !header || document.querySelector(".fpaStoryNav")) return;

  document.body.style.setProperty("--story-accent", config.accent);
  document.body.style.setProperty("--story-accent-ink", config.accentInk);
  document.body.style.setProperty("--story-shadow", config.accent);

  hero.id = "question";
  const heroTitle = hero.querySelector("h1");
  if (heroTitle && config.title) heroTitle.innerHTML = config.title;

  const dashboard = body.querySelector(":scope > .caseImage");
  const story = body.querySelector(":scope > .storyGrid");
  const findings = body.querySelector(".findingGrid");
  const model = body.querySelector(".processSection");
  const action = body.querySelector(".recommendation");
  const evidence = body.querySelector(".githubProof");

  if (evidence) evidence.id = "evidence";

  const downloadLinks = document.querySelectorAll(".excelDownload, .githubSecondary");
  downloadLinks.forEach((link) => {
    link.href = config.download;
    link.setAttribute("download", "");
  });

  if (normalizedPath === "/cases/fpa-operating-plan/") {
    const scope = hero.querySelector(".caseBrief dl div:first-child dd");
    if (scope) scope.textContent = "6 actual months + 12 forecast months";
    const paragraphs = story?.querySelectorAll(".bodyCopy p");
    if (paragraphs?.[1]) paragraphs[1].textContent = "The model separates six closed months from the forecast, reconciles every Base scenario output to the core P&L and cash roll-forward, and shows how forecast-only driver changes affect the outlook.";
    const liquidity = findings?.querySelector("article:nth-child(3) p");
    if (liquidity) liquidity.textContent = "The roll-forward converts operating performance into ending cash and tests every month against a $3.0M minimum; the current scenarios preserve ample headroom.";
    const scenarioCaption = body.querySelector(".imageGrid figure:nth-child(2) figcaption");
    if (scenarioCaption) scenarioCaption.textContent = "Downside, Base, and Upside · closed actuals plus forecast-only driver scenarios";
  }

  if (normalizedPath === "/cases/finance-data-pipeline/") {
    const brief = hero.querySelector(".caseBrief h2");
    if (brief) brief.textContent = "A synthetic 5,832-row finance dataset feeds a controlled workbook, documented transformation steps, a SQL star-schema design, and Power BI-ready metric definitions.";
    const storyCopy = story?.querySelectorAll(".bodyCopy p");
    if (storyCopy?.[0]) storyCopy[0].textContent = "The synthetic dataset includes transaction, account, entity, cost-center, period, scenario, and currency fields. Companion Power Query and SQL files document the intended typing, validation, and model structure; the workbook provides the review pack and visible controls.";
    const articles = findings?.querySelectorAll("article");
    if (articles?.[1]) articles[1].querySelector("p").textContent = "Gross profit and operating-cost movements remain visible beside EBITDA so the reported margin can be reviewed without unsupported driver detail.";
    if (articles?.[2]) articles[2].querySelector("p").textContent = "Row count, transaction-ID completeness, required IDs, scenario labels, and consolidated tie-out pass before the pack is distributed.";
    const steps = model?.querySelectorAll("li p");
    if (steps?.[0]) steps[0].textContent = "The supplied Power Query template types, cleans, and validates one documented monthly CSV input.";
    if (steps?.[1]) steps[1].textContent = "The SQL schema and workbook views document the intended finance fact table and governed dimensions.";
    if (steps?.[2]) steps[2].textContent = "Power BI-ready DAX definitions mirror the workbook's core Actual, Budget, Forecast, variance, and margin logic.";
    const recommendationCopy = action?.querySelector("p:last-child");
    if (recommendationCopy) recommendationCopy.textContent = "Replace the source CSV, run the documented Power Query and SQL refresh steps, confirm PASS, then investigate the largest entity, gross-profit, and opex movements.";
  }

  if (normalizedPath === "/cases/fpt-valuation/") {
    const toolkit = hero.querySelector(".caseBrief dl div:nth-child(2) dd");
    if (toolkit) toolkit.textContent = "Excel · Operating model · DCF · Sensitivity";
    const stressStep = model?.querySelector("li:nth-child(3) p");
    if (stressStep) stressStep.textContent = "Recompute every sensitivity cell from its own WACC and terminal-growth pair, then run eight audit controls including two non-base corners.";
  }

  if (story && !story.querySelector(".storySignals")) {
    const signals = document.createElement("div");
    signals.className = "storySignals";
    signals.innerHTML = config.signals.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
    story.append(signals);
  }

  const nav = document.createElement("div");
  nav.className = "fpaStoryNav";
  nav.innerHTML = `<nav class="shell" aria-label="Financial model case navigation"><strong>${config.code} / ${config.label}</strong><div><a href="#question">Question</a><a href="#dashboard">Dashboard</a><a href="#findings">Findings</a><a href="#model">Model</a><a href="#action">Action</a></div></nav>`;
  header.after(nav);

  if (dashboard) {
    const section = document.createElement("section");
    section.className = "fpaDashboardSection";
    const inner = document.createElement("div");
    inner.className = "fpaDashboardInner";
    inner.innerHTML = `<div class="fpaDashboardIntro"><div><p class="kicker light">02 / DASHBOARD</p><h2>${config.dashboardTitle}</h2></div><p>${config.dashboardCopy}</p></div>`;
    dashboard.before(section);
    section.id = "dashboard";
    section.append(inner);
    dashboard.dataset.chrome = config.chrome;
    inner.append(dashboard);
  }

  const addChapter = (target, number, title, note, anchorId) => {
    if (!target) return;
    const chapter = document.createElement("div");
    chapter.className = "fpaChapter";
    if (anchorId) chapter.id = anchorId;
    chapter.innerHTML = `<span>${number}</span><strong>${title}</strong><small>${note}</small>`;
    target.before(chapter);
  };

  addChapter(findings, "03", "Findings", "Evidence before recommendation", "findings");
  addChapter(model, "04", "Model logic", "Drivers · scenarios · controls", "model");
  addChapter(action, "05", "Management action", "Decision and operating cadence", "action");
  addChapter(evidence, "06", "Working evidence", "Excel file · source · controls");
})();
