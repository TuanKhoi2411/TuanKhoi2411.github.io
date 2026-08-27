const buttons=[...document.querySelectorAll('.dashboardTabs button')];
const images=[...document.querySelectorAll('.dashboardStage img')];

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

function selectPage(index){
  buttons.forEach((button,buttonIndex)=>button.setAttribute('aria-selected',buttonIndex===index));
  images.forEach((image,imageIndex)=>image.classList.toggle('active',imageIndex===index));
  requestAnimationFrame(fitParentFrame);
}

buttons.forEach((button,index)=>button.addEventListener('click',()=>selectPage(index)));
images.forEach(image=>image.addEventListener('load',fitParentFrame));
window.addEventListener('resize',fitParentFrame);
fitParentFrame();
