import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;
 
document.addEventListener('DOMContentLoaded', () => {
  const arCard = document.querySelector("#ar-card");
  if (arCard) {
    arCard.style.visibility = 'hidden';
    arCard.style.pointerEvents = 'none';
  }
});

async function startAR() {
  const mindARThreeJs = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/targets/businessCard.mind"
  });

  const { cssRenderer, renderer, cssScene, scene, camera } = mindARThreeJs;

  const arCardElement = document.querySelector("#ar-card");
  
  const container = new CSS3DObject(arCardElement);
  const anchor = mindARThreeJs.addCSSAnchor(0);
  anchor.group.scale.set(0.3, 0.3, 0.3);
  anchor.group.add(container);

  anchor.onTargetFound = () => {
    setTimeout(() => {
      arCardElement.style.visibility = 'visible';
      arCardElement.style.pointerEvents = 'auto';
      arCardElement.classList.add("visible");
    }, 100);
  };

  anchor.onTargetLost = () => {
    arCardElement.style.visibility = 'hidden';
    arCardElement.style.pointerEvents = 'none';
    arCardElement.classList.remove("visible");
  };

  cssRenderer.domElement.style.pointerEvents = 'none';
  
  arCardElement.style.pointerEvents = 'auto';
  
  const style = document.createElement('style');
  style.textContent = `
    /* Allow clicks to pass through MindAR overlay */
    .mindar-ui-overlay {
      pointer-events: none !important;
    }
    
    /* CSS3D renderer should not block clicks */
    .css3d-renderer {
      pointer-events: none !important;
    }
    
    /* But the card itself and its children should receive clicks */
    #ar-card, 
    #ar-card * {
      pointer-events: auto !important;
      cursor: pointer !important;
    }
    
    /* Ensure buttons are clickable */
    .social-btn {
      pointer-events: auto !important;
      cursor: pointer !important;
      position: relative;
      z-index: 1000;
    }
    
    /* Fix for mobile touch - let the parent handle clicks */
    .social-btn a, 
    .social-btn svg,
    .social-btn span {
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = e.currentTarget;
    const href = btn.getAttribute('href');
    
    if (href && href !== '#') {
      window.open(href, '_blank');
    }
    return false;
  }


  setTimeout(() => {
    const buttons = document.querySelectorAll('.social-btn');
    buttons.forEach(btn => {
      // Remove any existing listeners and add new one
      btn.removeEventListener('click', handleClick);
      btn.addEventListener('click', handleClick);
    });
  }, 1000);

  await mindARThreeJs.start();

  renderer.setAnimationLoop(() => {
    cssRenderer.render(cssScene, camera);
  });
}

startAR().catch(console.error);