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

// ---------- Glowing border that follows the cursor ----------
(function () {
  const targets = document.querySelectorAll(".glow-target");
  if (!targets.length) return;
  const proximity = 80;

  function update(x, y) {
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      const active =
        x > r.left - proximity &&
        x < r.right + proximity &&
        y > r.top - proximity &&
        y < r.bottom + proximity;
      el.style.setProperty("--glow-active", active ? "1" : "0");
      if (!active) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
      el.style.setProperty("--glow-start", angle);
    });
  }

  window.addEventListener(
    "pointermove",
    (e) => update(e.clientX, e.clientY),
    { passive: true }
  );
})();

// ---------- Foto de la lata por sabor ----------
const FLAVORS = {
  mocca: {
    name: "Mocca",
    index: "01 / 05",
    desc: "El clásico equilibrio entre café intenso y chocolate suave. El frappé de siempre, hecho como debe ser.",
    photo: "products/latas/mocca.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Mocca ☕",
  },
  taro: {
    name: "Taro",
    index: "02 / 05",
    desc: "Cremoso, suave y distinto. Un sabor que se sale de lo tradicional para sorprenderte en cada sorbo.",
    photo: "products/latas/taro.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Taro ☕",
  },
  caramelo: {
    name: "Caramelo",
    index: "03 / 05",
    desc: "Dulce, envolvente y con ese toque tostado que combina perfecto con el café.",
    photo: "products/latas/caramelo.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Caramelo ☕",
  },
  forte: {
    name: "Cappuccino Forte",
    index: "04 / 05",
    desc: "Para quienes lo quieren fuerte de verdad. Máxima intensidad de café en cada trago.",
    photo: "products/latas/forte.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Cappuccino Forte ☕",
  },
  chunky: {
    name: "Chunky Chocolate",
    index: "05 / 05",
    desc: "Full chocolate, con textura y personalidad. El favorito de quienes no negocian el chocolate.",
    photo: "products/latas/chunky.jpg",
    msg: "Hola! Quiero pedir un frappé sabor Chunky Chocolate ☕",
  },
};
const WHATSAPP_NUMBER = "50688216610";

function initFlavors() {
  const img = document.getElementById("flavor-can-img");
  const wrap = img ? img.parentElement : null;
  if (!img || !wrap) return;

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
      img.src = data.photo;
      img.alt = "Lata The Coffee Club " + data.name;
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

  currentFlavor = "mocca";
}

initFlavors();
