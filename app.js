/* Lógica del sitio. Normalmente no necesitas tocar este archivo. */

const DEMO = !CONFIG.API_URL;
const DEMO_KEY = "numeros_pilotos_demo";

let tomados = {};        // { "VLR Mini": { 101: "Juan", ... }, ... }
let catActiva = 0;
let seleccion = null;    // { categoria, numero }

const $ = (id) => document.getElementById(id);

/* ---------- utilidades ---------- */

function numerosDe(cat) {
  if (Array.isArray(cat.numeros)) return cat.numeros.slice();
  const fuera = new Set(cat.excluir || []);
  const out = [];
  for (let n = cat.desde; n <= cat.hasta; n++) if (!fuera.has(n)) out.push(n);
  return out;
}

function poolDe(cat) {
  return cat.pool || cat.nombre;
}

// Categorías que comparten numeración con esta (incluida ella misma)
function hermanas(cat) {
  const p = poolDe(cat);
  return CONFIG.categorias.filter((c) => poolDe(c) === p);
}

// Números ya usados de antes (los del Excel), sumando todo el pool
function ocupadosPrevios(cat) {
  const set = new Set();
  hermanas(cat).forEach((c) => (c.ocupados || []).forEach((n) => set.add(n)));
  return set;
}

// Quién tiene el número: nombre del piloto, "Ocupado", o null si está libre
function quienTiene(cat, numero, previos) {
  if (previos.has(numero)) return "Ocupado";
  const h = hermanas(cat);
  for (let i = 0; i < h.length; i++) {
    const t = tomados[h[i].nombre];
    if (t && t[numero]) return t[numero];
  }
  return null;
}

/* ---------- datos ---------- */

async function cargarTomados() {
  if (DEMO) {
    tomados = JSON.parse(localStorage.getItem(DEMO_KEY) || "{}");
    return;
  }
  const res = await fetch(CONFIG.API_URL + "?action=list&t=" + Date.now());
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Respuesta inválida");
  tomados = data.tomados || {};
}

async function reservar(categoria, numero, piloto, equipo) {
  if (DEMO) {
    const cat = CONFIG.categorias.find((c) => c.nombre === categoria);
    if (quienTiene(cat, numero, ocupadosPrevios(cat))) {
      return { ok: false, error: "Ese número ya fue tomado." };
    }
    tomados[categoria] = tomados[categoria] || {};
    tomados[categoria][numero] = piloto;
    localStorage.setItem(DEMO_KEY, JSON.stringify(tomados));
    return { ok: true };
  }
  const cat = CONFIG.categorias.find((c) => c.nombre === categoria);
  const res = await fetch(CONFIG.API_URL, {
    method: "POST",
    // text/plain evita el preflight CORS que Apps Script no responde
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ categoria, numero, piloto, equipo, grupo: poolDe(cat) }),
  });
  return res.json();
}

/* ---------- render ---------- */

function pintarTabs() {
  $("tabs").innerHTML = "";
  CONFIG.categorias.forEach((cat, i) => {
    const b = document.createElement("button");
    b.className = "tab" + (i === catActiva ? " activo" : "");
    b.textContent = cat.nombre;
    b.setAttribute("role", "tab");
    b.onclick = () => { catActiva = i; pintarTabs(); pintarGrid(); };
    $("tabs").appendChild(b);
  });
}

function pintarGrid() {
  const cat = CONFIG.categorias[catActiva];
  const nums = numerosDe(cat);
  const grid = $("grid");
  grid.innerHTML = "";

  const previos = ocupadosPrevios(cat);
  let libres = 0;
  nums.forEach((n) => {
    const duenio = quienTiene(cat, n, previos);
    if (!duenio) libres++;
    const b = document.createElement("button");
    b.className = "num";
    b.textContent = n;
    if (duenio) {
      b.disabled = true;
      b.title = duenio === "Ocupado" ? "Ocupado" : "Ocupado por " + duenio;
    } else {
      b.onclick = () => abrirModal(cat.nombre, n);
    }
    grid.appendChild(b);
  });

  $("contador").textContent = libres + " de " + nums.length + " disponibles";
  $("estado").classList.add("hidden");
}

/* ---------- modal ---------- */

function abrirModal(categoria, numero) {
  seleccion = { categoria, numero };
  $("modal-cat").textContent = categoria;
  $("modal-num").textContent = "#" + numero;
  $("piloto").value = "";
  $("equipo").value = "";
  $("error").classList.add("hidden");
  $("modal").classList.remove("hidden");
  $("piloto").focus();
}

function cerrarModal() {
  $("modal").classList.add("hidden");
  seleccion = null;
}

$("cancelar").onclick = cerrarModal;
$("modal").onclick = (e) => { if (e.target === $("modal")) cerrarModal(); };
$("ok-cerrar").onclick = () => $("ok").classList.add("hidden");

$("form").onsubmit = async (e) => {
  e.preventDefault();
  const piloto = $("piloto").value.trim();
  const equipo = $("equipo").value.trim();
  if (!piloto) return;

  const btn = $("enviar");
  btn.disabled = true;
  btn.textContent = "Guardando…";
  $("error").classList.add("hidden");

  try {
    const r = await reservar(seleccion.categoria, seleccion.numero, piloto, equipo);
    if (!r.ok) throw new Error(r.error || "No se pudo guardar.");

    const num = seleccion.numero;
    cerrarModal();
    await cargarTomados();
    pintarGrid();

    $("ok-num").textContent = "#" + num;
    $("ok-piloto").textContent = piloto;
    $("ok").classList.remove("hidden");
  } catch (err) {
    $("error").textContent = err.message || "Error de conexión. Intenta de nuevo.";
    $("error").classList.remove("hidden");
    await cargarTomados().then(pintarGrid).catch(() => {});
  } finally {
    btn.disabled = false;
    btn.textContent = "Reservar este número";
  }
};

/* ---------- arranque ---------- */

async function iniciar() {
  document.title = CONFIG.titulo;
  $("titulo").textContent = CONFIG.titulo;
  $("subtitulo").textContent = CONFIG.subtitulo;
  if (DEMO) $("demo-banner").classList.remove("hidden");

  pintarTabs();
  try {
    await cargarTomados();
  } catch (err) {
    $("estado").textContent = "No se pudo conectar con la hoja de cálculo. Revisa la URL en config.js.";
    return;
  }
  pintarGrid();

  // refresco automático para ver lo que otros van tomando
  setInterval(async () => {
    if (!$("modal").classList.contains("hidden")) return;
    try { await cargarTomados(); pintarGrid(); } catch (e) {}
  }, 20000);
}

iniciar();
