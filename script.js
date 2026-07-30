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
    desc: "La combinación perfecta entre café premium y chocolate. Cremoso, equilibrado y con ese sabor que siempre querés repetir.",
    photo: "products/latas/mocca.png",
    msg: "Hola! Quiero pedir un frappé sabor Mocca ☕",
  },
  taro: {
    name: "Taro",
    index: "02 / 05",
    desc: "Suave, cremoso y diferente. Un sabor único que sorprende desde el primer sorbo y se convierte en un nuevo favorito.",
    photo: "products/latas/taro.png",
    msg: "Hola! Quiero pedir un frappé sabor Taro ☕",
  },
  caramelo: {
    name: "Caramelo",
    index: "03 / 05",
    desc: "Notas dulces, un toque tostado y el equilibrio perfecto con el café para un frappé irresistible.",
    photo: "products/latas/caramelo.png",
    msg: "Hola! Quiero pedir un frappé sabor Caramelo ☕",
  },
  forte: {
    name: "Cappuccino Forte",
    index: "04 / 05",
    desc: "Más café, más intensidad y más carácter. Creado para quienes disfrutan un sabor fuerte y auténtico.",
    photo: "products/latas/forte.png",
    msg: "Hola! Quiero pedir un frappé sabor Cappuccino Forte ☕",
  },
  chunky: {
    name: "Chunky Chocolate",
    index: "05 / 05",
    desc: "Chocolate intenso, textura cremosa y muchísimo sabor. Perfecto para los verdaderos amantes del chocolate.",
    photo: "products/latas/chunky.png",
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
