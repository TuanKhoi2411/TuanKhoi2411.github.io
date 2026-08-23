(function(){
  const config=window.PREVIEW_CONFIG;
  if(!config)return;
  const $=(selector)=>document.querySelector(selector);
  const lensSelect=$('#lensSelect');
  const modeSelect=$('#modeSelect');
  const resetButton=$('#resetPreview');
  const kpiRoot=$('#previewKpis');
  const barsRoot=$('#previewBars');
  const tableBody=$('#previewTableBody');
  const chartTitle=$('#chartTitle');
  const insight=$('#previewInsight');
  $('#previewTitle').textContent=config.title;
  $('#previewSource').textContent=config.source;
  $('#fullScreenLink').href=location.href;
  Object.entries(config.views).forEach(([key,view])=>{
    const option=document.createElement('option');
    option.value=key;option.textContent=view.label;lensSelect.appendChild(option);
  });
  function render(){
    const view=config.views[lensSelect.value]||Object.values(config.views)[0];
    const indexed=modeSelect.value==='index';
    const absoluteMax=Math.max(...view.bars.map(item=>Math.abs(item.value)),1);
    chartTitle.textContent=view.chartTitle;
    kpiRoot.innerHTML=view.kpis.map(item=>`<article class="previewKpi"><span>${item.label}</span><strong>${item.value}</strong><small>${item.note}</small></article>`).join('');
    barsRoot.innerHTML=view.bars.map(item=>{
      const width=Math.max(2,Math.abs(item.value)/absoluteMax*100);
      const shown=indexed?`${Math.round(Math.abs(item.value)/absoluteMax*100)} index`:item.display;
      return `<div class="barRow ${item.value<0?'isNegative':''}"><b>${item.label}</b><div class="barTrack"><div class="barFill" style="width:${width}%"></div></div><span>${shown}</span></div>`;
    }).join('');
    tableBody.innerHTML=view.bars.map(item=>`<tr><td>${item.label}</td><td>${item.display}</td></tr>`).join('');
    insight.textContent=view.insight;
  }
  lensSelect.addEventListener('change',render);
  modeSelect.addEventListener('change',render);
  resetButton.addEventListener('click',()=>{lensSelect.selectedIndex=0;modeSelect.value='actual';render();});
  render();
})();
