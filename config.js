/* ============================================================
   CONFIGURACIÓN  —  este es el único archivo que necesitas tocar
   ============================================================ */

const CONFIG = {

  // Nombre del evento (sale arriba en la página)
  titulo: "Números de Kart 2026 ACEK",
  subtitulo: "Escoge tu número disponible",

  // Pega aquí la URL de tu Google Apps Script (ver README.md, paso 4).
  // Si la dejas vacía, el sitio funciona en MODO DEMO (solo en tu navegador,
  // no guarda nada en el Excel y no bloquea números entre personas).
  API_URL: "https://script.google.com/macros/s/AKfycbz0_matQxXFS7qrNegu-_8ic9vSZ6hzGbEcm2g_tNdrXhfdkGOKrw69SXI8uquzKhkQQQ/exec",

  // ----------------------------------------------------------
  // CATEGORÍAS
  // ----------------------------------------------------------
  //  nombre      -> como se ve en la página
  //  pool        -> categorías con el MISMO pool comparten numeración:
  //                 si alguien toma el 907 en Tillotson Junior, también
  //                 queda ocupado en Tillotson Senior y Heavy.
  //  desde/hasta -> rango de números de la categoría
  //  ocupados    -> números YA usados (pestaña "2026 invierno" del Excel).
  //                 Para liberar uno, bórralo de esta lista.
  // ----------------------------------------------------------
  categorias: [
    {
      nombre: "Kid Kart (4-7)",
      pool: "kid",
      desde: 1, hasta: 99,
      ocupados: [
        2, 8, 17, 18, 21, 25, 27
      ],
    },
    {
      nombre: "Star of Tomorrow (8-12)",
      pool: "100",
      desde: 100, hasta: 199,
      ocupados: [
        127, 185, 188, 197
      ],
    },
    {
      nombre: "VLR Junior (12-15)",
      pool: "200",
      desde: 200, hasta: 299,
      ocupados: [
        201, 202, 205, 206, 207, 209, 211, 212, 214, 216, 217, 221, 222, 225,
        227, 235, 237, 241, 242, 244, 247, 252, 255, 263, 265, 274, 285, 292,
        293
      ],
    },
    {
      nombre: "VLR Senior",
      pool: "300",
      desde: 300, hasta: 399,
      ocupados: [
        300, 301, 302, 303, 305, 307, 308, 310, 311, 312, 314, 315, 316, 317,
        318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 333,
        334, 335, 336, 337, 340, 342, 343, 344, 345, 346, 347, 348, 349, 350,
        351, 354, 355, 357, 362, 364, 367, 369, 371, 372, 373, 375, 376, 377,
        380, 386, 387, 388, 389, 394, 397, 398, 399
      ],
    },
    {
      nombre: "VLR Master",
      pool: "400",
      desde: 400, hasta: 499,
      ocupados: [
        407, 408, 413, 414, 417, 418, 419, 422, 424, 426, 427, 429, 437, 442,
        457, 465, 468, 478, 479, 482, 496, 497
      ],
    },
    {
      nombre: "Mini ROK (9-12)",
      pool: "500",
      desde: 500, hasta: 599,
      ocupados: [
        500, 505, 506, 508, 511, 513, 514, 515, 519, 521, 522, 524, 526, 528,
        529, 533, 537, 555, 566, 581, 588, 592, 595
      ],
    },
    {
      nombre: "Shifter",
      pool: "600",
      desde: 600, hasta: 699,
      ocupados: [
        601, 602, 607, 608, 609, 610, 611, 614, 615, 616, 617, 618, 619, 623,
        624, 627, 637, 657, 661, 668, 669, 671, 677, 679, 680
      ],
    },
    {
      nombre: "Micro ROK (7-10)",
      pool: "700",
      desde: 700, hasta: 799,
      ocupados: [
        700, 704, 706, 708, 710, 714, 715, 721, 722, 726, 737, 740, 781, 784,
        788
      ],
    },
    {
      nombre: "Tilly Mini (8-12)",
      pool: "800",
      desde: 800, hasta: 899,
      ocupados: [
        804, 806, 807, 808, 810, 812, 813, 814, 824, 825, 867, 884, 888, 898,
        899
      ],
    },
    {
      nombre: "Tillotson 225 Junior (12-15)",
      pool: "900",
      desde: 900, hasta: 999,
      ocupados: [
        900, 902, 907, 911, 922, 924, 928, 933, 945, 947, 948, 956, 967, 972,
        977, 984, 985, 991, 997, 998
      ],
    },
    {
      nombre: "Tillotson 225 Senior",
      pool: "900",
      desde: 900, hasta: 999,
      ocupados: [
        904, 905, 906, 908, 915, 921, 923, 926, 927, 929, 931, 942, 944, 957,
        959, 969, 971, 995, 999
      ],
    },
    {
      nombre: "Tillotson 225 Heavy",
      pool: "900",
      desde: 900, hasta: 999,
      ocupados: [
        901, 904, 909, 912, 914, 916, 919, 920, 925, 929, 935, 939, 947, 950,
        955, 970, 980, 987
      ],
    },
  ],
};
