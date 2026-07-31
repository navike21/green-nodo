import type { PseudocodeChallenge } from "./types";

export const challenge: PseudocodeChallenge = {
  topicId: "programming-fundamentals/error-handling-debugging-testing/proyecto-integrador",
  referenceSource: `
FUNCIÓN dividirLista(lista, divisor)
  INTENTAR
    SI divisor ES IGUAL A 0 ENTONCES
      LANZAR ERROR "No se puede dividir entre cero"
    FIN SI

    DEFINIR resultados = []
    PARA CADA numero EN lista HACER
      AGREGAR_AL_FINAL resultados (numero ÷ divisor)
    FIN PARA
    RETORNAR resultados

  CAPTURAR error EN
    MOSTRAR "Error capturado: " + error.mensaje
    RETORNAR NULO
  FIN INTENTAR
FIN FUNCIÓN

PRUEBA "camino feliz: dividir [10, 20, 30] entre 2"
  DEFINIR resultado = dividirLista([10, 20, 30], 2)
  VERIFICAR QUE resultado ES IGUAL A [5, 10, 15]
FIN PRUEBA

PRUEBA "edge case: dividir entre 0 no debe colapsar el programa"
  DEFINIR resultado = dividirLista([10, 20, 30], 0)
  VERIFICAR QUE resultado ES IGUAL A NULO
FIN PRUEBA
`,
  // Este proyecto ya incluye sus propios PRUEBA/VERIFICAR QUE como parte del
  // desafío (es justamente el tema de la fase). La suite oculta agrega edge
  // cases adicionales que el estudiante no ve de antemano.
  hiddenTestSource: `
PRUEBA "oculto: otro camino feliz, [4, 8] entre 4"
  VERIFICAR QUE dividirLista([4, 8], 4) ES IGUAL A [1, 2]
FIN PRUEBA

PRUEBA "oculto: lista vacía entre un divisor válido retorna lista vacía"
  VERIFICAR QUE dividirLista([], 5) ES IGUAL A []
FIN PRUEBA
`,
};
