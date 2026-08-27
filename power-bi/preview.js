(function () {
  const config = window.PREVIEW_CONFIG;
  const app = document.querySelector('.previewApp');
  if (!config || !app) return;

  const reports = config.title.includes('UK ONLINE RETAIL')
    ? {title:'UK Online Retail Sales',pages:[['UK Retail Sales','/assets/cases/power-bi/native/sales-overview.png'],['Customer Insights','/assets/cases/power-bi/native/sales-customer-insights.png'],['Product & Returns','/assets/cases/power-bi/native/sales-product-returns.png']]}
    : config.title.includes('PORTUGUESE BANK')
      ? {title:'Portuguese Bank Marketing',pages:[['Bank Marketing','/assets/cases/power-bi/native/marketing-overview.png'],['Audience Segmentation','/assets/cases/power-bi/native/marketing-audience-segmentation.png'],['Campaign Effectiveness','/assets/cases/power-bi/native/marketing-campaign-effectiveness.png']]}
      : config.title.includes('APPLE INC.')
        ? {title:'Apple Financial Performance',pages:[['Apple Finance','/assets/cases/power-bi/native/finance-overview.png?v=20260828a'],['Profitability & Growth','/assets/cases/power-bi/native/finance-profitability-growth.png?v=20260828a'],['Balance & Liquidity','/assets/cases/power-bi/native/finance-balance-liquidity.png?v=20260828a']]}
        : {title:'Sports & Health Financial Performance',pages:[['Overview','/assets/cases/power-bi/native/sports-overview.png?v=20260828a'],['Breakdown','/assets/cases/power-bi/native/sports-breakdown.png?v=20260828a'],['Segments','/assets/cases/power-bi/native/sports-segments.png?v=20260828a'],['Breakeven','/assets/cases/power-bi/native/sports-breakeven.png?v=20260828a']]};

  app.innerHTML = `
    <header class="nativeHeader">
      <div><span>POWER BI · ORIGINAL REPORT</span><h1>${reports.title}</h1><p>Native Power BI report pages</p></div>
      <a class="nativeFullScreen" href="${location.href}" target="_blank" rel="noreferrer">Open full screen ↗</a>
    </header>
    <nav class="nativeTabs" aria-label="Power BI report pages"></nav>
    <figure class="nativeReport">
      <img alt="" decoding="async">
      <figcaption><span class="nativePageCount"></span><strong class="nativePageName"></strong><small>${config.source}</small></figcaption>
    </figure>`;

  const tabs = app.querySelector('.nativeTabs');
  const image = app.querySelector('.nativeReport img');
  const pageCount = app.querySelector('.nativePageCount');
  const pageName = app.querySelector('.nativePageName');
  tabs.innerHTML = reports.pages.map(([label], index) => `<button type="button" data-page="${index}" aria-pressed="${index === 0}"><i>${String(index + 1).padStart(2, '0')}</i>${label}</button>`).join('');

  function showPage(index) {
    const [label, src] = reports.pages[index];
    image.src = src;
    image.alt = `${reports.title} — ${label} Power BI dashboard`;
    pageCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(reports.pages.length).padStart(2, '0')}`;
    pageName.textContent = label;
    tabs.querySelectorAll('button').forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-page]');
    if (button) showPage(Number(button.dataset.page));
  });
  showPage(0);
})();
