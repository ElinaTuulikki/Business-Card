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

  await mindARThreeJs.start();

  renderer.setAnimationLoop(() => {
    cssRenderer.render(cssScene, camera);
  });
}

startAR();