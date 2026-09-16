const buttons=[...document.querySelectorAll('.dashboardTabs button')];
const viewer=document.querySelector('.dashboardStage img');

function fitParentFrame(){
  if(window.parent===window)return;
  try{
    const frame=[...window.parent.document.querySelectorAll('iframe.dashboardFrame')]
      .find(candidate=>candidate.contentWindow===window);
    if(frame)frame.style.height=`${document.documentElement.scrollHeight}px`;
  }catch(error){
    // The full-screen preview has no parent frame to resize.
  }
}

function selectPage(index,trackInteraction=false){
  buttons.forEach((button,buttonIndex)=>button.setAttribute('aria-selected',buttonIndex===index));
  if(viewer&&buttons[index]?.dataset.image){
    viewer.src=buttons[index].dataset.image;
    viewer.title=`Dashboard page ${index+1} of ${buttons.length}`;
    viewer.alt=buttons[index].dataset.alt||buttons[index].textContent.trim();
  }
  if(trackInteraction){
    try{
      window.parent.portfolioTrack?.("dashboard_tab_view",{
        dashboard_page:buttons[index]?.textContent.trim().slice(0,100)||`Page ${index+1}`,
        dashboard_page_number:index+1
      });
    }catch(error){
      // Standalone previews have no parent analytics context.
    }
  }
  requestAnimationFrame(fitParentFrame);
}

buttons.forEach((button,index)=>button.addEventListener('click',()=>selectPage(index,true)));
viewer?.addEventListener('load',fitParentFrame);
window.addEventListener('resize',fitParentFrame);
selectPage(0);
fitParentFrame();
