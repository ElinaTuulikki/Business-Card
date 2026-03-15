import { CSS3DObject } from "../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;

async function startAR() {
  const mindARThreeJs = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/targets/businessCard.mind"
  });

  const { cssRenderer, renderer, cssScene, scene, camera } = mindARThreeJs;

  const cardElement = document.querySelector("#ar-card");
  const cssObject = new CSS3DObject(cardElement);
  cssObject.scale.set(0.001, 0.001, 0.001);

  const anchor = mindARThreeJs.addCSSAnchor(0);
  anchor.group.add(cssObject);

  anchor.onTargetFound = () => {
    cardElement.style.visibility = "visible";
  };

  anchor.onTargetLost = () => {
    cardElement.style.visibility = "hidden";
  };

  await mindARThreeJs.start();

  renderer.setAnimationLoop(() => {
    cssRenderer.render(cssScene, camera);
    renderer.render(scene, camera);
  });
}

startAR();