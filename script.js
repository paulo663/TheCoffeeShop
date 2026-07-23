// Los botones "Pedir" son enlaces <a href="https://wa.me/..."> directos
// (ver index.html) — no requieren JS para abrir WhatsApp.

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

let webglOK = true;
try {
  const testCanvas = document.createElement("canvas");
  webglOK = !!(testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"));
} catch (e) {
  webglOK = false;
}

// ---------- Three.js: real product can (photo-wrapped) ----------
const CAN_RADIUS = 1.0;
const CAN_BODY_HEIGHT = Math.PI * CAN_RADIUS;
const CAN_RIM_HEIGHT = 0.13;

const FLAVORS = {
  mocca: {
    name: "Mocca",
    index: "01 / 05",
    desc: "El clásico equilibrio entre café intenso y chocolate suave. El frappé de siempre, hecho como debe ser.",
    texture: "products/wraps/mocca.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Mocca ☕",
  },
  taro: {
    name: "Taro",
    index: "02 / 05",
    desc: "Cremoso, suave y distinto. Un sabor que se sale de lo tradicional para sorprenderte en cada sorbo.",
    texture: "products/wraps/taro.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Taro ☕",
  },
  caramelo: {
    name: "Caramelo",
    index: "03 / 05",
    desc: "Dulce, envolvente y con ese toque tostado que combina perfecto con el café.",
    texture: "products/wraps/caramelo.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Caramelo ☕",
  },
  forte: {
    name: "Cappuccino Forte",
    index: "04 / 05",
    desc: "Para quienes lo quieren fuerte de verdad. Máxima intensidad de café en cada trago.",
    texture: "products/wraps/forte.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Cappuccino Forte ☕",
  },
  chunky: {
    name: "Chunky Chocolate",
    index: "05 / 05",
    desc: "Full chocolate, con textura y personalidad. El favorito de quienes no negocian el chocolate.",
    texture: "products/wraps/chunky.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Chunky Chocolate ☕",
  },
};
const WHATSAPP_NUMBER = "50688216610";

function buildCan() {
  const group = new THREE.Group();

  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.45, metalness: 0.1 });
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.02 });

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(CAN_RADIUS, CAN_RADIUS, CAN_BODY_HEIGHT, 64, 1, false),
    [bodyMaterial, rimMaterial, rimMaterial]
  );
  body.name = "body";
  group.add(body);

  const topRim = new THREE.Mesh(
    new THREE.CylinderGeometry(CAN_RADIUS * 1.03, CAN_RADIUS * 1.005, CAN_RIM_HEIGHT, 64),
    rimMaterial
  );
  topRim.position.y = CAN_BODY_HEIGHT / 2 + CAN_RIM_HEIGHT / 2;
  group.add(topRim);

  const bottomRim = new THREE.Mesh(
    new THREE.CylinderGeometry(CAN_RADIUS * 1.005, CAN_RADIUS * 1.03, CAN_RIM_HEIGHT, 64),
    rimMaterial
  );
  bottomRim.position.y = -(CAN_BODY_HEIGHT / 2 + CAN_RIM_HEIGHT / 2);
  group.add(bottomRim);

  return group;
}

function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  return renderer;
}

function addLights(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd99b5f, 0.5);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
}

function initFlavors() {
  const canvas = document.getElementById("flavor-canvas");
  const wrap = canvas ? canvas.parentElement : null;
  if (!webglOK || !canvas || !wrap) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.15, 6.4);

  const renderer = makeRenderer(canvas);
  addLights(scene);

  const can = buildCan();
  scene.add(can);
  const body = can.getObjectByName("body");

  const textureLoader = new THREE.TextureLoader();
  const textureCache = {};
  function loadWithRetry(url, tex, attemptsLeft) {
    textureLoader.load(
      url,
      (loaded) => {
        tex.image = loaded.image;
        tex.needsUpdate = true;
      },
      undefined,
      () => {
        if (attemptsLeft > 0) {
          setTimeout(() => loadWithRetry(url, tex, attemptsLeft - 1), 400);
        }
      }
    );
  }
  function getTexture(flavor) {
    if (!textureCache[flavor]) {
      const tex = new THREE.Texture();
      tex.encoding = THREE.sRGBEncoding;
      textureCache[flavor] = tex;
      loadWithRetry(FLAVORS[flavor].texture, tex, 3);
    }
    return textureCache[flavor];
  }

  const tabs = Array.from(document.querySelectorAll(".flavor-tab"));
  const infoEl = document.querySelector(".flavor-info");
  const nameEl = document.querySelector(".flavor-name");
  const indexEl = document.querySelector(".flavor-index");
  const descEl = document.querySelector(".flavor-desc");
  const pedirBtn = document.getElementById("flavor-pedir-btn");

  let currentFlavor = null;
  function setFlavor(flavor) {
    if (flavor === currentFlavor) return;
    currentFlavor = flavor;
    const data = FLAVORS[flavor];

    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.flavor === flavor));
    wrap.classList.add("is-switching");
    infoEl.classList.add("is-switching");

    setTimeout(() => {
      body.material[0].map = getTexture(flavor);
      body.material[0].needsUpdate = true;
      nameEl.textContent = data.name;
      indexEl.textContent = data.index;
      descEl.textContent = data.desc;
      pedirBtn.textContent = "Pedir " + data.name;
      pedirBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(data.msg)}`;
      wrap.classList.remove("is-switching");
      infoEl.classList.remove("is-switching");
    }, 160);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setFlavor(tab.dataset.flavor));
  });

  function resize() {
    const size = wrap.clientWidth;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let dragging = false, lastX = 0, spin = 0.0032;
  wrap.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; });
  window.addEventListener("pointerup", () => (dragging = false));
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    can.rotation.y += dx * 0.01;
    lastX = e.clientX;
  });

  // muestra Mocca (primer tab) desde el inicio, sin esperar animación de "switch"
  currentFlavor = "mocca";
  body.material[0].map = getTexture("mocca");

  function animate() {
    requestAnimationFrame(animate);
    if (!dragging) can.rotation.y += spin;
    renderer.render(scene, camera);
  }
  animate();
}

initFlavors();
