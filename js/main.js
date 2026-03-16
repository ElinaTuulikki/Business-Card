import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;

async function startAR() {
  const mindARThreeJs = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/targets/businessCard.mind"
  });

  const { cssRenderer, renderer, cssScene, scene, camera } = mindARThreeJs;

  const container = new CSS3DObject(document.querySelector("#ar-card"));
  const anchor = mindARThreeJs.addCSSAnchor(0);
  anchor.group.scale.set(0.3, 0.3, 0.3);
  anchor.group.add(container);

  anchor.onTargetFound = () => {
    setTimeout(() => {
      document.querySelector("#ar-card").classList.add("visible");
    }, 100);
  };

  anchor.onTargetLost = () => {
    document.querySelector("#ar-card").classList.remove("visible");
  };

  // Enhanced CSS for better mobile touch handling
  const style = document.createElement('style');
  style.textContent = `
    .mindar-ui-overlay {
      pointer-events: none !important;
      z-index: 1 !important;
    }
    
    .css3d-renderer {
      pointer-events: none !important;
      z-index: 10 !important;
    }
    
    .css3d-renderer canvas,
    .css3d-renderer div {
      pointer-events: auto !important;
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    #ar-card,
    #ar-card * {
      pointer-events: auto !important;
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      cursor: pointer !important;
    }
    
    .social-btn {
      position: relative !important;
      z-index: 9999 !important;
      pointer-events: auto !important;
      -webkit-transform: translate3d(0, 0, 0) !important;
      transform: translate3d(0, 0, 0) !important;
    }
    
    .social-btn a {
      pointer-events: auto !important;
      display: block !important;
    }
    
    /* Ensure clickable area is large enough for mobile */
    .social-btn {
      min-width: 120px !important;
      min-height: 80px !important;
      padding: 20px 24px !important;
      margin: 0 8px !important;
    }
  `;
  document.head.appendChild(style);

  // Fix for CSS3D renderer touch events
  if (cssRenderer && cssRenderer.domElement) {
    cssRenderer.domElement.style.pointerEvents = 'auto';
    cssRenderer.domElement.style.touchAction = 'manipulation';
    
    // Make all CSS3D layers clickable
    const css3dElements = document.querySelectorAll('.css3d-renderer > div');
    css3dElements.forEach(el => {
      el.style.pointerEvents = 'auto';
      el.style.touchAction = 'manipulation';
    });
  }

  // Enhanced button click handling for mobile
  function setupMobileButtons() {
    const buttons = document.querySelectorAll('.social-btn');
    buttons.forEach(btn => {
      // Remove any existing listeners
      btn.removeEventListener('click', handleButtonClick);
      btn.removeEventListener('touchstart', handleTouchStart);
      
      // Add both click and touch events
      btn.addEventListener('click', handleButtonClick);
      btn.addEventListener('touchstart', handleTouchStart, { passive: false });
      
      // Ensure the link inside is clickable
      const link = btn.getAttribute('href');
      if (link && link !== '#') {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
      }
    });
  }

  function handleButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = e.currentTarget;
    const href = btn.getAttribute('href');
    
    if (href && href !== '#') {
      // Try multiple methods to open the link
      try {
        // Method 1: Direct window open
        window.open(href, '_blank');
      } catch (err) {
        console.log('Error opening link:', err);
        
        // Method 2: Create and click a hidden anchor
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 1000);
      }
    }
    return false;
  }

  function handleTouchStart(e) {
    // Prevent default only if it's not a scrolling touch
    e.preventDefault();
    e.stopPropagation();
    
    // Simulate click after touch
    const btn = e.currentTarget;
    const href = btn.getAttribute('href');
    if (href && href !== '#') {
      setTimeout(() => {
        window.open(href, '_blank');
      }, 100);
    }
  }

  // Wait for DOM to be ready and setup buttons
  setTimeout(setupMobileButtons, 1000);
  
  // Also setup buttons when target is found
  anchor.onTargetFound = () => {
    setTimeout(() => {
      document.querySelector("#ar-card").classList.add("visible");
      setupMobileButtons(); // Re-setup buttons when card becomes visible
    }, 100);
  };

  await mindARThreeJs.start();

  renderer.setAnimationLoop(() => {
    cssRenderer.render(cssScene, camera);
  });

  // Additional mobile-specific fixes after renderer starts
  setTimeout(() => {
    // Fix for iOS iframe issues
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    // Ensure CSS3D container is properly layered
    const css3dContainer = document.querySelector('.css3d-renderer');
    if (css3dContainer) {
      css3dContainer.style.zIndex = '100';
      css3dContainer.style.pointerEvents = 'auto';
    }
  }, 2000);
}

startAR();