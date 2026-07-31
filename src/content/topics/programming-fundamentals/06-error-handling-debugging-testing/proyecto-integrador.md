---
course: programming-fundamentals
phase: ERROR_HANDLING_DEBUGGING_TESTING
order: 4
type: "proyecto"
name: "Proyecto integrador: depurar, corregir y probar"
description: "Combina Debugging, Try/Catch y Testing"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Integration Project · Debugging · Try/Catch · Test Case"
  summary: >
    Este proyecto simula el ciclo de trabajo real ante un bug reportado: primero investigar con técnicas de depuración, luego corregir con manejo de excepciones, y finalmente escribir pruebas que confirmen que el problema no vuelva a ocurrir.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Es como un doctor ante un síntoma: primero investiga con estudios (Debugging), luego trata la causa (Try/Catch), y finalmente programa controles periódicos para asegurarse de que el problema no regrese (Testing).
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Sigue el orden del ciclo real: primero entiende POR QUÉ falla (Debugging), después decide CÓMO evitar que colapse (Try/Catch), y al final escribe la prueba que demuestre que ya no se rompe (Testing). Invertir el orden suele llevar a "arreglos" que no atacan la causa real.
    cardColor: "blue"
---

## El desafío

Esta función tiene un bug reportado por un usuario: **falla cuando el divisor es 0**.

```js
FUNCIÓN dividirLista(lista, divisor)
  DEFINIR resultados = []
  PARA CADA numero EN lista HACER
    AGREGAR_AL_FINAL resultados (numero ÷ divisor)
  FIN PARA
  RETORNAR resultados
FIN FUNCIÓN
```

1. **Depura** el problema: identifica exactamente en qué línea y bajo qué condición ocurre la falla (piensa qué Breakpoint o Watcher pondrías, y qué verías).
2. **Corrige** la función usando Try/Catch para manejar el caso de división entre cero sin colapsar.
3. **Escribe 2 Test Cases**: uno para el camino feliz (divisor normal) y uno para el Edge Case (divisor = 0), que confirmen que la función ya no falla.

<div data-pseudocode-challenge-mount></div>

<details>
<summary>Ver solución paso a paso</summary>

```js
// 1) DEBUGGING: un Breakpoint en "numero ÷ divisor" y un Watcher sobre 'divisor'
// revelarían que, cuando divisor = 0, la operación produce un Runtime Error
// (una división entre cero), deteniendo el programa en plena ejecución del PARA CADA.

// 2) CORRECCIÓN con Try/Catch
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

// 3) TEST CASES
PRUEBA "camino feliz: dividir [10, 20, 30] entre 2"
  DEFINIR resultado = dividirLista([10, 20, 30], 2)
  VERIFICAR QUE resultado ES IGUAL A [5, 10, 15]
FIN PRUEBA

PRUEBA "edge case: dividir entre 0 no debe colapsar el programa"
  DEFINIR resultado = dividirLista([10, 20, 30], 0)
  VERIFICAR QUE resultado ES IGUAL A NULO
FIN PRUEBA
```

**Por qué funciona así:**

- El Debugging identifica la **causa exacta**: no es que la función esté "mal escrita" en general, sino que un valor específico (divisor = 0) rompe una operación matemática puntual.
- El Try/Catch no "esconde" el error: lo anticipa con una Guard Clause dentro del bloque `INTENTAR` (`SI divisor ES IGUAL A 0`) y responde de forma controlada, igual que en el tema de Excepciones.
- Los dos Test Cases cubren exactamente lo que el tema de Testing advierte: no basta con probar el camino feliz (dividir entre 2), también hay que probar el Edge Case (dividir entre 0) para confirmar que el bug reportado realmente quedó resuelto y no reaparecerá como Regresión más adelante.

</details>
