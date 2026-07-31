/* ============================================================
   Pega este codigo en Extensiones > Apps Script de tu Hoja de Google.
   Instrucciones completas en README.md

   NOTA: este archivo se mantiene sin acentos a proposito. Los editores
   de Apps Script a veces corrompen los caracteres acentuados al pegar.
   Los textos que si llevan acento usan escapes \u (por ejemplo u con tilde), que son ASCII puro y no se pueden corromper.
   ============================================================ */

var HOJA = "Registros";               // pestania donde se guarda todo
var ENCABEZADOS = [
  "Fecha y hora",
  "Categor\u00EDa",              // Categoria
  "N\u00FAmero",                 // Numero
  "Piloto",
  "Escuder\u00EDa",              // Escuderia
  "Grupo"
];

function getHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(ENCABEZADOS);
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Todas las filas como objetos {categoria, numero, piloto, grupo}
function leerFilas() {
  var hoja = getHoja();
  var filas = hoja.getLastRow() - 1;
  if (filas < 1) return [];

  var datos = hoja.getRange(2, 2, filas, 5).getValues(); // B..F
  var out = [];
  for (var i = 0; i < datos.length; i++) {
    var categoria = String(datos[i][0]).trim();
    var numero = String(datos[i][1]).trim();
    if (!categoria || !numero) continue;
    out.push({
      categoria: categoria,
      numero: numero,
      piloto: String(datos[i][2]).trim(),
      // si la fila es vieja y no tiene grupo, se usa la categoria
      grupo: String(datos[i][4]).trim() || categoria
    });
  }
  return out;
}

// { "VLR Senior": { "342": "Martin Salom" }, ... }  -> lo que consume la pagina
function leerTomados() {
  var filas = leerFilas();
  var tomados = {};
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i];
    if (!tomados[f.categoria]) tomados[f.categoria] = {};
    tomados[f.categoria][f.numero] = f.piloto;
  }
  return tomados;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    return json({ ok: true, tomados: leerTomados() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Espera hasta 20s para que dos personas no tomen el mismo numero a la vez
    lock.waitLock(20000);

    var body = JSON.parse(e.postData.contents);
    var categoria = String(body.categoria || "").trim();
    var numero = String(body.numero || "").trim();
    var piloto = String(body.piloto || "").trim();
    var equipo = String(body.equipo || "").trim();
    var grupo = String(body.grupo || "").trim() || categoria;

    if (!categoria || !numero || !piloto) {
      return json({ ok: false, error: "Faltan datos." });
    }

    // El choque se revisa por GRUPO: las categorias que comparten numeracion
    // (por ejemplo los Tillotson 900) no pueden repetir numero entre ellas.
    var filas = leerFilas();
    for (var i = 0; i < filas.length; i++) {
      if (filas[i].grupo === grupo && filas[i].numero === numero) {
        return json({
          ok: false,
          // "El numero X ya fue tomado por Y."
          error: "El n\u00FAmero " + numero + " ya fue tomado por " + filas[i].piloto + "."
        });
      }
    }

    getHoja().appendRow([new Date(), categoria, Number(numero), piloto, equipo, grupo]);
    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
