(function(){
  const config=window.PREVIEW_CONFIG;
  if(!config)return;
  const $=(selector)=>document.querySelector(selector);
  const sheetSets=config.title.includes('UK ONLINE RETAIL')
    ?{title:'UK ONLINE RETAIL | SALES PERFORMANCE',order:['portfolio','customers','returns'],labels:{portfolio:'UK Retail Sales',customers:'Customer Insights',returns:'Product & Returns'}}
    :config.title.includes('PORTUGUESE BANK')
      ?{title:'PORTUGUESE BANK | MARKETING PERFORMANCE',order:['history','audience','channel'],labels:{history:'Bank Marketing',audience:'Audience Segmentation',channel:'Campaign Effectiveness'}}
      :config.title.includes('APPLE INC.')
        ?{title:'APPLE INC. | FINANCIAL PERFORMANCE',order:['growth','margin','liquidity'],labels:{growth:'Performance Overview',margin:'Margin Architecture',liquidity:'Balance Sheet'}}
        :{title:'SPORTS & HEALTH | FP&A PERFORMANCE',order:['portfolio','margin','cost','quarter'],labels:{portfolio:'Executive P&L',margin:'Business Lines',cost:'Cost & Break-even',quarter:'Quarterly Trend'}};
  if(config.title.includes('SPORTS & HEALTH')&&!config.views.cost){
    config.views.cost={label:'Cost & Break-even',chartTitle:'Cost architecture',kpis:[{label:'TOTAL COST',value:'$13.25M',note:'2023 cost base'},{label:'COGS SHARE',value:'50.7%',note:'of total cost'},{label:'OPEX SHARE',value:'42.3%',note:'of total cost'},{label:'INTEREST & TAX',value:'7.0%',note:'of total cost'}],bars:[{label:'COGS',value:50.7,display:'50.7%'},{label:'Opex',value:42.3,display:'42.3%'},{label:'Interest & tax',value:7,display:'7.0%'}],insight:'Labor represents 66.9% of COGS, while three lines absorb 74.5% of Opex. Cost review should focus on the largest controllable pools before broad cuts.'};
  }
  Object.entries(sheetSets.labels).forEach(([key,label])=>{if(config.views[key])config.views[key].label=label;});
  $('.previewTitlebar').innerHTML='<div class="previewIdentity"><span>POWER BI DASHBOARD</span><b id="previewTitle"></b></div><nav class="previewTabs" id="sheetTabs" aria-label="Report sheets"></nav>';
  const oldLens=$('#lensSelect')?.closest('.previewControl');
  if(oldLens)oldLens.outerHTML='<div class="previewContext"><span>CURRENT SHEET</span><strong id="currentSheetLabel"></strong></div>';
  const tabsRoot=$('#sheetTabs');
  const currentSheetLabel=$('#currentSheetLabel');
  const modeSelect=$('#modeSelect');
  const resetButton=$('#resetPreview');
  const kpiRoot=$('#previewKpis');
  const barsRoot=$('#previewBars');
  const tableBody=$('#previewTableBody');
  const chartTitle=$('#chartTitle');
  const insight=$('#previewInsight');
  $('#previewTitle').textContent=sheetSets.title;
  $('#previewSource').textContent=config.source;
  $('#fullScreenLink').href=location.href;
  const viewKeys=sheetSets.order.filter(key=>config.views[key]);
  let activeKey=viewKeys[0];
  tabsRoot.innerHTML=viewKeys.map(key=>`<button type="button" data-view="${key}" aria-pressed="${key===activeKey}">${config.views[key].label}</button>`).join('');
  function render(){
    const view=config.views[activeKey]||Object.values(config.views)[0];
    const indexed=modeSelect.value==='index';
    const absoluteMax=Math.max(...view.bars.map(item=>Math.abs(item.value)),1);
    chartTitle.textContent=view.chartTitle;
    currentSheetLabel.textContent=view.label;
    tabsRoot.querySelectorAll('button').forEach(button=>{
      const selected=button.dataset.view===activeKey;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    kpiRoot.innerHTML=view.kpis.map(item=>`<article class="previewKpi"><span>${item.label}</span><strong>${item.value}</strong><small>${item.note}</small></article>`).join('');
    barsRoot.innerHTML=view.bars.map(item=>{
      const width=Math.max(2,Math.abs(item.value)/absoluteMax*100);
      const shown=indexed?`${Math.round(Math.abs(item.value)/absoluteMax*100)} index`:item.display;
      return `<div class="barRow ${item.value<0?'isNegative':''}"><b>${item.label}</b><div class="barTrack"><div class="barFill" style="width:${width}%"></div></div><span>${shown}</span></div>`;
    }).join('');
    tableBody.innerHTML=view.bars.map(item=>`<tr><td>${item.label}</td><td>${item.display}</td></tr>`).join('');
    insight.textContent=view.insight;
  }
  tabsRoot.querySelectorAll('button[data-view]').forEach(button=>button.addEventListener('click',()=>{
    activeKey=button.dataset.view;
    render();
  }));
  modeSelect.addEventListener('change',render);
  resetButton.addEventListener('click',()=>{activeKey=viewKeys[0];modeSelect.value='actual';render();});
  render();
})();
