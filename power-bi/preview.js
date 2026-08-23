(function(){
  const config=window.PREVIEW_CONFIG;
  if(!config)return;
  const $=(selector)=>document.querySelector(selector);
  const sheetSets=config.title.includes('UK ONLINE RETAIL')
    ?{title:'UK ONLINE RETAIL | SALES PERFORMANCE',owner:'Commercial · Customer Operations',order:['portfolio','customers','returns'],labels:{portfolio:'UK Retail Sales',customers:'Customer Insights',returns:'Product & Returns'}}
    :config.title.includes('PORTUGUESE BANK')
      ?{title:'PORTUGUESE BANK | MARKETING PERFORMANCE',owner:'Marketing · Campaign Operations',order:['history','audience','channel'],labels:{history:'Bank Marketing',audience:'Audience Segmentation',channel:'Campaign Effectiveness'}}
      :config.title.includes('APPLE INC.')
        ?{title:'APPLE INC. | FINANCIAL PERFORMANCE',owner:'CFO · FP&A · Investor Review',order:['growth','margin','liquidity'],labels:{growth:'Performance Overview',margin:'Margin Architecture',liquidity:'Balance Sheet'}}
        :{title:'SPORTS & HEALTH | FP&A PERFORMANCE',owner:'CFO · FP&A · Business Lines',order:['portfolio','margin','cost','quarter'],labels:{portfolio:'Executive P&L',margin:'Business Lines',cost:'Cost & Break-even',quarter:'Quarterly Trend'}};

  if(config.title.includes('SPORTS & HEALTH')&&!config.views.cost){
    config.views.cost={label:'Cost & Break-even',chartTitle:'Cost architecture',kpis:[{label:'TOTAL COST',value:'$13.25M',note:'2023 cost base'},{label:'COGS SHARE',value:'50.7%',note:'of total cost'},{label:'OPEX SHARE',value:'42.3%',note:'of total cost'},{label:'INTEREST & TAX',value:'7.0%',note:'of total cost'}],bars:[{label:'COGS',value:50.7,display:'50.7%'},{label:'Opex',value:42.3,display:'42.3%'},{label:'Interest & tax',value:7,display:'7.0%'}],insight:'Labor represents 66.9% of COGS, while three lines absorb 74.5% of Opex. Cost review should focus on the largest controllable pools before broad cuts.'};
  }
  Object.entries(sheetSets.labels).forEach(([key,label])=>{if(config.views[key])config.views[key].label=label;});

  $('.previewTitlebar').innerHTML='<div class="previewIdentity"><span>POWER BI · INTERACTIVE REPORT</span><b id="previewTitle"></b><small>Review the signal, test the lens, inspect the evidence.</small></div><nav class="previewTabs" id="sheetTabs" aria-label="Report sheets"></nav>';
  $('.previewToolbar').innerHTML='<div class="previewContext"><span>CURRENT REPORT LENS</span><strong id="currentSheetLabel"></strong></div><div class="previewControl"><label for="modeSelect">VALUE MODE</label><select id="modeSelect"><option value="actual">Actual values</option><option value="index">Index to largest</option></select></div><div class="previewControl"><label for="highlightSelect">HIGHLIGHT</label><select id="highlightSelect"><option value="all">All drivers</option><option value="largest">Largest driver</option><option value="exception">Exception / lowest</option></select></div><button class="previewButton" id="resetPreview" type="button">Reset lens</button><a class="previewButton primary" id="fullScreenLink" target="_blank" rel="noreferrer">Full screen ↗</a>';
  $('.previewCanvas').innerHTML='<div class="filterReceipt"><div id="receiptChips"></div><p id="receiptMessage"></p><strong id="receiptOwner"></strong></div><div class="previewKpis" id="previewKpis"></div><div class="powerGrid"><article class="powerPanel primaryVisual"><header><div><span>PRIMARY VISUAL</span><h2 id="chartTitle"></h2></div><b>SELECT A SHEET ABOVE</b></header><div class="columnChart" id="columnChart"></div></article><article class="powerPanel varianceVisual"><header><div><span>DRIVER RANKING</span><h2>Contribution & variance</h2></div><b id="rankMode">ACTUAL</b></header><div class="rankList" id="rankList"></div></article><article class="powerPanel evidenceVisual"><header><div><span>DETAIL & EXCEPTIONS</span><h2>Evidence table</h2></div><b>PBIX-ALIGNED</b></header><table class="previewTable"><thead><tr><th>Driver</th><th>Observed value</th><th>Relative scale</th></tr></thead><tbody id="previewTableBody"></tbody></table></article><aside class="decisionVisual"><span>MANAGEMENT READOUT</span><p id="previewInsight"></p></aside></div>';

  const tabsRoot=$('#sheetTabs');
  const modeSelect=$('#modeSelect');
  const highlightSelect=$('#highlightSelect');
  const viewKeys=sheetSets.order.filter(key=>config.views[key]);
  let activeKey=viewKeys[0];
  tabsRoot.innerHTML=viewKeys.map((key,index)=>`<button type="button" data-view="${key}" aria-pressed="${key===activeKey}"><i>${String(index+1).padStart(2,'0')}</i>${config.views[key].label}</button>`).join('');
  $('#previewTitle').textContent=sheetSets.title;
  $('#previewSource').textContent=config.source;
  $('#fullScreenLink').href=location.href;
  $('#receiptOwner').textContent=`Owner: ${sheetSets.owner}`;

  function selectedBars(view){
    const rows=[...view.bars];
    if(highlightSelect.value==='largest')return rows.sort((a,b)=>Math.abs(b.value)-Math.abs(a.value)).slice(0,1);
    if(highlightSelect.value==='exception')return rows.sort((a,b)=>a.value-b.value).slice(0,1);
    return rows;
  }
  function render(){
    const view=config.views[activeKey]||Object.values(config.views)[0];
    const rows=selectedBars(view);
    const indexed=modeSelect.value==='index';
    const absoluteMax=Math.max(...view.bars.map(item=>Math.abs(item.value)),1);
    const activeIndex=viewKeys.indexOf(activeKey)+1;
    $('#currentSheetLabel').textContent=view.label;
    $('#chartTitle').textContent=view.chartTitle;
    $('#rankMode').textContent=indexed?'INDEXED':'ACTUAL';
    $('#receiptChips').innerHTML=`<span>${String(activeIndex).padStart(2,'0')} / ${String(viewKeys.length).padStart(2,'0')}</span><span>${view.label}</span><span>${modeSelect.options[modeSelect.selectedIndex].text}</span><span>${highlightSelect.options[highlightSelect.selectedIndex].text}</span>`;
    $('#receiptMessage').textContent=`${view.label} is active. All visuals and evidence below use the same report lens.`;
    tabsRoot.querySelectorAll('button').forEach(button=>{const selected=button.dataset.view===activeKey;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
    $('#previewKpis').innerHTML=view.kpis.slice(0,4).map((item,index)=>`<article class="previewKpi kpi${index+1}"><div><span>${item.label}</span><i>${String(index+1).padStart(2,'0')}</i></div><strong>${item.value}</strong><small>${item.note}</small><div class="microLine" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></article>`).join('');
    $('#columnChart').innerHTML=rows.map(item=>{const height=Math.max(8,Math.abs(item.value)/absoluteMax*100);const shown=indexed?`${Math.round(Math.abs(item.value)/absoluteMax*100)}`:item.display;return `<div class="columnItem ${item.value<0?'isNegative':''}"><b>${shown}</b><div class="columnTrack"><i style="height:${height}%"></i></div><span>${item.label}</span></div>`;}).join('');
    $('#rankList').innerHTML=rows.map(item=>{const width=Math.max(3,Math.abs(item.value)/absoluteMax*100);const shown=indexed?`${Math.round(Math.abs(item.value)/absoluteMax*100)} index`:item.display;return `<div class="rankRow ${item.value<0?'isNegative':''}"><div><b>${item.label}</b><span>${shown}</span></div><div class="rankTrack"><i style="width:${width}%"></i></div></div>`;}).join('');
    $('#previewTableBody').innerHTML=rows.map(item=>{const relative=Math.round(Math.abs(item.value)/absoluteMax*100);return `<tr><td>${item.label}</td><td>${item.display}</td><td><div class="tableMeter"><i style="width:${relative}%"></i><span>${relative}%</span></div></td></tr>`;}).join('');
    $('#previewInsight').textContent=view.insight;
  }
  tabsRoot.querySelectorAll('button[data-view]').forEach(button=>button.addEventListener('click',()=>{activeKey=button.dataset.view;highlightSelect.value='all';render();}));
  modeSelect.addEventListener('change',render);
  highlightSelect.addEventListener('change',render);
  $('#resetPreview').addEventListener('click',()=>{activeKey=viewKeys[0];modeSelect.value='actual';highlightSelect.value='all';render();});
  render();
})();
