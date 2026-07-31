import type { PseudocodeChallenge } from "./types";

export const challenge: PseudocodeChallenge = {
  topicId: "programming-fundamentals/data-structures-complexity/proyecto-integrador",
  referenceSource: `
DEFINIR pedidos = ["Laptop", "Mouse", "Laptop", "Teclado", "Mouse", "Laptop"]

DEFINIR productosUnicos = CONJUNTO_VACIO
PARA CADA producto EN pedidos HACER
  AGREGAR producto A productosUnicos
FIN PARA
MOSTRAR productosUnicos   // → { "Laptop", "Mouse", "Teclado" }

DEFINIR conteo = {}
PARA CADA producto EN pedidos HACER
  SI producto EXISTE EN conteo ENTONCES
    ASIGNAR conteo[producto] = conteo[producto] + 1
  SI NO
    ASIGNAR conteo[producto] = 1
  FIN SI
FIN PARA
MOSTRAR conteo   // → { "Laptop": 3, "Mouse": 2, "Teclado": 1 }
`,
  // Este proyecto es un guion de datos fijos (sin función aislada que llamar),
  // así que se corre una sola vez y se compara la salida completa.
  scriptCases: [
    {
      description: "productos únicos vía Set + conteo vía Tabla Hash",
      inputs: [],
      expectedOutput: ['{ "Laptop", "Mouse", "Teclado" }', '{ "Laptop": 3, "Mouse": 2, "Teclado": 1 }'],
    },
  ],
};
