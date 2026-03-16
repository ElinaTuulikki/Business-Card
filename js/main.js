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

  cssRenderer.domElement.style.pointerEvents = "auto";
  const style = document.createElement('style');
  style.textContent = `
    .mindar-ui-overlay {
      pointer-events: none !important;
    }
    .mindar-ui-overlay * {
      pointer-events: none !important;
    }
    .css3d-renderer {
      pointer-events: none !important;
    }
    .css3d-renderer div {
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    const buttons = document.querySelectorAll('.social-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const href = btn.getAttribute('href');
        if (href && href !== '#') {
          window.open(href, '_blank');
        }
      });
    });
  }, 1000);

  await mindARThreeJs.start();

  renderer.setAnimationLoop(() => {
    cssRenderer.render(cssScene, camera);
  });
}

startAR();