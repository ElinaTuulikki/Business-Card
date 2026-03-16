import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;

const LINKS = [
  { href: "https://github.com/ElinaTuulikki", label: "GitHub" },
  { href: "https://www.linkedin.com/in/elina-tienhaara-95bb14121/", label: "LinkedIn"},
  { href: "https://instagram.com/haen_tiiran", label: "Instagram"},
];

function buildTapOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "tap-overlay";
  Object.assign(overlay.style, {
    position:      "fixed",
    inset:         "0",
    pointerEvents: "none",   // container transparent; children opt-in below
    zIndex:        "9999",
});

  const anchors = LINKS.map(({ href, label }) => {
    const a = document.createElement("a");
    a.href    = href;
    a.target  = "_blank";
    a.rel     = "noopener noreferrer";
    a.dataset.label = label;
    Object.assign(a.style, {
      position:      "absolute",
      display:       "none",           // hidden until target found
      pointerEvents: "auto",
      background:    "transparent",    // invisible; set to rgba(255,0,0,0.3) to debug
      border:        "none",
      cursor:        "pointer",
      webkitTapHighlightColor: "transparent",
    });
    overlay.appendChild(a);
    return a;
  });

  document.body.appendChild(overlay);
  return anchors;
}

function updateTapZones(anchors, cardVisible) {
  const card = document.querySelector("#ar-card");
 
  if (!cardVisible || !card) {
    anchors.forEach(a => { a.style.display = "none"; });
    return;
  }
 
  const buttons = card.querySelectorAll(".social-btn");
  buttons.forEach((btn, i) => {
    if (!anchors[i]) return;
    const r = btn.getBoundingClientRect();
    if (r.width === 0) {
      anchors[i].style.display = "none";
      return;
    }
    Object.assign(anchors[i].style, {
      display: "block",
      left:    r.left   + "px",
      top:     r.top    + "px",
      width:   r.width  + "px",
      height:  r.height + "px",
    });
  });
}

async function startAR() {
  const mindARThreeJs = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/targets/businessCard.mind"
  });

  const { cssRenderer, renderer, cssScene, scene, camera } = mindARThreeJs;

  const arCardElement = document.querySelector("#ar-card");
  arCardElement.style.visibility = "hidden";
  arCardElement.style.pointerEvents = "none";

  const css3d0bj = new CSS3DObject(arCardElement);
  const anchor = mindARThreeJs.addCSSAnchor(0);
  anchor.group.scale.set(0.3, 0.3, 0.3);
  anchor.group.add(css3d0bj);

  const tapAnchors = buildTapOverlay();
  let targetVisible = false;

  anchor.onTargetFound = () => {
    setTimeout(() => {
      arCardElement.style.visibility = 'visible';
      arCardElement.style.pointerEvents = 'auto';
      arCardElement.classList.add("visible");
      targetVisible = true;
    }, 150);
  };

  anchor.onTargetLost = () => {
    arCardElement.style.visibility = 'hidden';
    arCardElement.style.pointerEvents = 'none';
    arCardElement.classList.remove("visible");
    targetVisible = false;
    tapAnchors.forEach(a => { a.style.display = "none"; });
  };

  cssRenderer.domElement.style.pointerEvents = 'none';
  
  const killOverlays = () =>
    document.querySelectorAll(".mindar-ui-overlay").forEach(el => {
      el.style.pointerEvents = "none";
    });

  await mindARThreeJs.start();
  killOverlays();

  renderer.setAnimationLoop(() => {
    cssRenderer.render(cssScene, camera);
    updateTapZones(tapAnchors, targetVisible);
    killOverlays();
  });
}

startAR().catch(console.error);