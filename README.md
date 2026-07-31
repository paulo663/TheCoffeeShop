# Números de Piloto

Sitio para que los pilotos escojan su número por categoría. Cuando alguien escoge:

- el número queda **ocupado para todos** (desaparece de los disponibles),
- a la persona le sale la confirmación con su número,
- y a ti se te llena una **Hoja de Google** (que abres o descargas como Excel) con:
  fecha y hora, categoría, número, piloto y escudería.

---

## Archivos

| Archivo | Para qué |
|---|---|
| `config.js` | **El único que necesitas editar**: categorías, números ocupados y la URL de tu hoja. |
| `index.html` `styles.css` `app.js` | El sitio. |
| `apps-script/Codigo.gs` | El código que se pega en la Hoja de Google. |

---

## Probarlo ya (modo demo)

Abre `index.html` con doble clic. Funciona, pero las selecciones solo se guardan
en tu navegador y no llegan a ningún Excel. Sale un aviso amarillo arriba.

Para que funcione de verdad, haz los 5 pasos de abajo.

---

## Conectarlo a tu Excel (5 pasos, ~10 minutos)

### 1. Crea la hoja
Entra a [sheets.new](https://sheets.new) y ponle nombre, por ejemplo
`Números de Piloto 2026`.

### 2. Pega el código
En esa hoja: menú **Extensiones → Apps Script**.
Borra lo que aparezca y pega **todo** el contenido de `apps-script/Codigo.gs`.
Guarda con el icono del diskette.

### 3. Publica
Arriba a la derecha: **Implementar → Nueva implementación**.

- En el engranaje ⚙️ elige **Aplicación web**.
- **Ejecutar como:** Yo (tu correo).
- **Quién tiene acceso:** **Cualquier usuario** ← importante, si no, nadie podrá reservar.
- Clic en **Implementar**.

La primera vez te pide permisos: **Revisar permisos → tu cuenta → Configuración
avanzada → Ir a (nombre del proyecto) → Permitir**.

### 4. Copia la URL
Al terminar te da una **URL de la aplicación web** que empieza con
`https://script.google.com/macros/s/...../exec`.

Pégala en `config.js`:

```js
API_URL: "https://script.google.com/macros/s/AKfy...../exec",
```

### 5. Revisa las categorías
Ya están cargadas las 12 categorías del Excel *2026 NUMEROS DE KART* (pestaña
**2026 invierno**), con todos los números que ya estaban usados. Solo revisa
que estén correctas.

Cada categoría se ve así en `config.js`:

```js
{
  nombre: "VLR Senior",
  pool: "300",
  desde: 300, hasta: 399,
  ocupados: [300, 301, 302, ...],
},
```

| Campo | Qué hace |
|---|---|
| `nombre` | Como se ve en la página |
| `pool` | Categorías con el **mismo** pool comparten numeración (los tres Tillotson usan `"900"`: si alguien toma el 907 en Junior, queda ocupado también en Senior y Heavy) |
| `desde` / `hasta` | Rango de números |
| `ocupados` | Números ya usados. **Bórralo de esta lista para liberarlo.** |

Listo. Recarga la página y ya guarda en tu hoja.

### Categorías cargadas

| Categoría | Rango | Ocupados | Libres |
|---|---|---|---|
| Kid Kart (4-7) | 1–99 | 7 | 92 |
| Star of Tomorrow (8-12) | 100–199 | 4 | 96 |
| VLR Junior (12-15) | 200–299 | 29 | 71 |
| VLR Senior | 300–399 | 65 | 35 |
| VLR Master | 400–499 | 22 | 78 |
| Mini ROK (9-12) | 500–599 | 23 | 77 |
| Shifter | 600–699 | 25 | 75 |
| Micro ROK (7-10) | 700–799 | 15 | 85 |
| Tilly Mini (8-12) | 800–899 | 15 | 85 |
| Tillotson 225 Junior / Senior / Heavy | 900–999 *(numeración compartida)* | 54 | 46 |

Los ocupados salen de la pestaña **2026 invierno** del archivo
*2026 NUMEROS DE KART.xlsx*.

---

## Tu Excel

Abre la hoja cuando quieras: se va llenando sola, en orden de llegada.
Para descargarla como Excel: **Archivo → Descargar → Microsoft Excel (.xlsx)**.

**Para liberar un número reservado desde el sitio:** borra esa fila en la hoja.
Vuelve a quedar disponible.

**Para liberar un número que venía usado del Excel viejo:** bórralo de la lista
`ocupados` de esa categoría en `config.js`.

---

## Subirlo a internet

Es un sitio estático (3 archivos), así que sirve cualquier hosting gratis:

- **Netlify Drop** — entra a [app.netlify.com/drop](https://app.netlify.com/drop) y
  arrastra la carpeta `numeros-pilotos`. Te da un link al instante.
- **GitHub Pages** o **Vercel** también funcionan igual.

> Nota: `config.js` es visible para quien abra el sitio, incluida la URL del script.
> Eso solo permite reservar números y ver los ocupados — nadie puede borrar tu hoja
> ni ver otros datos de tu Google Drive.

---

## Detalles que ya están resueltos

- **Dos personas al mismo tiempo:** el servidor usa un bloqueo; si dos piden el
  mismo número, el segundo recibe *"ese número ya fue tomado"* y la lista se le
  actualiza sola.
- **Actualización automática:** cada 20 segundos la página revisa qué se ocupó.
- **Celulares:** el diseño es responsive.
