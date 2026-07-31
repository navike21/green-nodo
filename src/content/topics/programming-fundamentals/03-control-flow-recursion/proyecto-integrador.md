---
course: programming-fundamentals
phase: CONTROL_FLOW_RECURSION
order: 4
type: "proyecto"
name: "Proyecto integrador: primer múltiplo de 7, dos formas"
description: "Combina Guard Clauses, Bucles y Recursividad"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Integration Project · Guard Clauses · Loops · Recursion"
  summary: >
    Este proyecto resuelve el mismo problema de dos formas distintas -iterativa y recursiva- para que compares en carne propia cuándo conviene cada enfoque, combinando los tres temas de esta fase.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Es como buscar el primer día del mes que cae feriado: puedes ir revisando el calendario día por día desde el 1 (bucle), o pedirle a la persona que revisa el día 1 que, si no es feriado, le pase la pregunta al día 2, y así sucesivamente (recursión). Ambas formas llegan al mismo resultado, por caminos distintos.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Resuelve primero la versión iterativa (con ROMPER): suele ser la más intuitiva. Luego pregúntate cuál sería el Caso Base y el Paso Recursivo si tuvieras que resolver lo mismo sin bucles.
    cardColor: "blue"
---

## El desafío

Diseña **dos versiones** de una función que reciba un número `n` y retorne el **primer múltiplo de 7** que encuentre entre 1 y `n` (o indique que no hay ninguno):

1. **Versión iterativa**: usa un bucle PARA con Guard Clause al inicio para manejar el caso de un `n` inválido (menor a 1), y ROMPER en cuanto encuentres el primer múltiplo de 7.
2. **Versión recursiva**: usa una Guard Clause como Caso Base para cuando ya se revisó todo el rango, y un Paso Recursivo que avance un número a la vez.

<div data-pseudocode-challenge-mount></div>

<details>
<summary>Ver solución paso a paso</summary>

```js
// VERSIÓN ITERATIVA
FUNCIÓN primerMultiploDeSieteIterativo(n)
  SI n < 1 ENTONCES RETORNAR NULO   // Guard Clause

  DEFINIR encontrado = NULO
  PARA i DESDE 1 HASTA n HACER
    SI i MOD 7 ES IGUAL A 0 ENTONCES
      CALCULAR encontrado = i
      ROMPER
    FIN SI
  FIN PARA

  RETORNAR encontrado
FIN FUNCIÓN

// VERSIÓN RECURSIVA
FUNCIÓN primerMultiploDeSieteRecursivo(actual, limite)
  SI actual > limite ENTONCES RETORNAR NULO   // Caso Base (además de Guard Clause): ya revisamos todo el rango

  SI actual MOD 7 ES IGUAL A 0 ENTONCES
    RETORNAR actual                            // Caso Base: ya lo encontramos
  FIN SI

  RETORNAR primerMultiploDeSieteRecursivo(actual + 1, limite)   // Paso Recursivo: avanza un número
FIN FUNCIÓN

MOSTRAR primerMultiploDeSieteIterativo(10)       // → 7
MOSTRAR primerMultiploDeSieteRecursivo(1, 10)    // → 7
```

**Por qué funciona así:**

- Ambas versiones parten de la misma idea de Guard Clause: si no queda nada válido por revisar (`n < 1`, o `actual` ya superó `limite`), no hay nada que buscar.
- En la iterativa, `ROMPER` corta el bucle apenas se encuentra el primer múltiplo de 7, evitando revisar el resto de los números hasta `n` sin necesidad.
- En la recursiva, cada llamada revisa solo el número `actual`; si no es múltiplo de 7, delega el resto del rango a una nueva llamada de sí misma con `actual + 1`. Esa es la reducción del problema (Paso Recursivo) que eventualmente llega al Caso Base.
- Ninguna versión es "más correcta" que la otra: la iterativa suele ser más eficiente en memoria (no apila Stack Frames), mientras la recursiva puede ser más fácil de leer para ciertos problemas.

</details>
