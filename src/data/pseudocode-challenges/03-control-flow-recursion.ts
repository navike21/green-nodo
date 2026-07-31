import type { PseudocodeChallenge } from "./types";

export const challenge: PseudocodeChallenge = {
  topicId: "programming-fundamentals/control-flow-recursion/proyecto-integrador",
  referenceSource: `
FUNCIÓN primerMultiploDeSieteIterativo(n)
  SI n < 1 ENTONCES RETORNAR NULO

  DEFINIR encontrado = NULO
  PARA i DESDE 1 HASTA n HACER
    SI i MOD 7 ES IGUAL A 0 ENTONCES
      CALCULAR encontrado = i
      ROMPER
    FIN SI
  FIN PARA

  RETORNAR encontrado
FIN FUNCIÓN

FUNCIÓN primerMultiploDeSieteRecursivo(actual, limite)
  SI actual > limite ENTONCES RETORNAR NULO

  SI actual MOD 7 ES IGUAL A 0 ENTONCES
    RETORNAR actual
  FIN SI

  RETORNAR primerMultiploDeSieteRecursivo(actual + 1, limite)
FIN FUNCIÓN

MOSTRAR primerMultiploDeSieteIterativo(10)       // → 7
MOSTRAR primerMultiploDeSieteRecursivo(1, 10)    // → 7
`,
  hiddenTestSource: `
PRUEBA "iterativo: n=10 -> 7"
  VERIFICAR QUE primerMultiploDeSieteIterativo(10) ES IGUAL A 7
FIN PRUEBA

PRUEBA "recursivo: rango 1..10 -> 7"
  VERIFICAR QUE primerMultiploDeSieteRecursivo(1, 10) ES IGUAL A 7
FIN PRUEBA

PRUEBA "iterativo: n=5 -> NULO (edge case, no hay múltiplo de 7 en el rango)"
  VERIFICAR QUE primerMultiploDeSieteIterativo(5) ES IGUAL A NULO
FIN PRUEBA

PRUEBA "iterativo: n=14 -> primero que aparece es 7, no 14"
  VERIFICAR QUE primerMultiploDeSieteIterativo(14) ES IGUAL A 7
FIN PRUEBA

PRUEBA "iterativo: n=0 -> NULO (Guard Clause de rango inválido)"
  VERIFICAR QUE primerMultiploDeSieteIterativo(0) ES IGUAL A NULO
FIN PRUEBA
`,
  // Estilo alternativo: la versión iterativa usa MIENTRAS en vez de PARA — misma
  // lógica, construcción distinta de la fase (enseñada en la misma fase 3).
  alternateStyleSource: `
FUNCIÓN primerMultiploDeSieteIterativo(n)
  SI n < 1 ENTONCES RETORNAR NULO

  DEFINIR i = 1
  MIENTRAS i <= n HACER
    SI i MOD 7 ES IGUAL A 0 ENTONCES
      RETORNAR i
    FIN SI
    MODIFICAR i = i + 1
  FIN MIENTRAS

  RETORNAR NULO
FIN FUNCIÓN

FUNCIÓN primerMultiploDeSieteRecursivo(actual, limite)
  SI actual > limite ENTONCES RETORNAR NULO
  SI actual MOD 7 ES IGUAL A 0 ENTONCES RETORNAR actual
  RETORNAR primerMultiploDeSieteRecursivo(actual + 1, limite)
FIN FUNCIÓN
`,
};
