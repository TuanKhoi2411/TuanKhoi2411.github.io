(() => {
  const cases = [
    {
      id: "fpa-operating-plan",
      capability: "financial-model",
      shortTitle: "Operating plan & rolling forecast",
      route: "/cases/fpa-operating-plan",
    },
    {
      id: "finance-data-pipeline",
      capability: "financial-model",
      shortTitle: "Executive P&L & data pipeline",
      route: "/cases/finance-data-pipeline",
    },
    {
      id: "fpt-valuation",
      capability: "financial-model",
      shortTitle: "DCF valuation & sensitivity",
      route: "/cases/fpt-valuation",
    },
    {
      id: "working-capital-cash",
      capability: "financial-model",
      shortTitle: "13-week cash & working capital",
      route: "/cases/working-capital-cash",
    },
    {
      id: "capex-investment-committee",
      capability: "financial-model",
      shortTitle: "CAPEX business case & IC pack",
      route: "/cases/capex-investment-committee",
    },
    {
      id: "sales-performance",
      capability: "power-bi",
      shortTitle: "Sales growth & return quality",
      route: "/power-bi/cases/sales-performance",
      reportPages: 3,
      measures: 129,
    },
    {
      id: "marketing-performance",
      capability: "power-bi",
      shortTitle: "Marketing conversion & audiences",
      route: "/power-bi/cases/marketing-performance",
      reportPages: 3,
      measures: 72,
    },
    {
      id: "finance-performance",
      capability: "power-bi",
      shortTitle: "Public-company finance & resilience",
      route: "/power-bi/cases/finance-performance",
      reportPages: 3,
      measures: 141,
    },
    {
      id: "credit-risk-performance",
      capability: "power-bi",
      shortTitle: "Credit risk & pricing response",
      route: "/power-bi/cases/credit-risk-performance",
      reportPages: 4,
      measures: 184,
    },
    {
      id: "sports-health-performance",
      capability: "power-bi",
      shortTitle: "Financial performance: segment mix & break-even",
      route: "/power-bi/cases/sports-health-performance",
      reportPages: 4,
    },
  ];

  const financialModels = cases.filter((item) => item.capability === "financial-model");
  const powerBiDashboards = cases.filter((item) => item.capability === "power-bi");
  const inventory = {
    cases,
    financialModels,
    powerBiDashboards,
    decisionProducts: cases.length,
    dashboardPages: powerBiDashboards.reduce(
      (total, item) => total + (item.reportPages || 0),
      0,
    ),
  };

  const words = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
  ];

  const values = {
    cases: inventory.decisionProducts,
    models: inventory.financialModels.length,
    dashboards: inventory.powerBiDashboards.length,
    "dashboard-pages": inventory.dashboardPages,
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-inventory-count]").forEach((node) => {
      const value = values[node.dataset.inventoryCount];
      if (typeof value === "number") node.textContent = value;
    });

    document.querySelectorAll("[data-inventory-word]").forEach((node) => {
      const value = values[node.dataset.inventoryWord];
      if (typeof value === "number") node.textContent = words[value] || String(value);
    });

    document.querySelectorAll("[data-case-list]").forEach((list) => {
      const capability = list.dataset.caseList;
      const entries = cases.filter((item) => item.capability === capability);
      list.replaceChildren(
        ...entries.map((item) => {
          const li = document.createElement("li");
          li.textContent = item.shortTitle;
          return li;
        }),
      );
    });
  });

  window.portfolioInventory = inventory;
})();
