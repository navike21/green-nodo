---
course: programming-fundamentals
phase: CONTROL_FLOW_RECURSION
order: 4
type: "proyecto"
name: "Proyecto integrador: primer número negativo, dos formas"
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
    Es como buscar la primera silla vacía en un cine: puedes ir fila por fila con una linterna (bucle), o pedirle a la persona de la fila 1 que revise su fila y, si no encuentra nada, le pase la pregunta a la fila 2, y así sucesivamente (recursión). Ambas formas llegan al mismo resultado, por caminos distintos.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Resuelve primero la versión iterativa (con ROMPER): suele ser la más intuitiva. Luego pregúntate cuál sería el Caso Base y el Paso Recursivo si tuvieras que resolver lo mismo sin bucles.
    cardColor: "blue"
---

## El desafío

Diseña **dos versiones** de una función que reciba una lista de números y retorne el **primer número negativo** que encuentre (o indique que no hay ninguno):

1. **Versión iterativa**: usa un bucle PARA con Guard Clause al inicio para manejar el caso de una lista vacía, y ROMPER en cuanto encuentres el primer negativo.
2. **Versión recursiva**: usa una Guard Clause como Caso Base para la lista vacía, y un Paso Recursivo que avance un elemento a la vez.

<details>
<summary>Ver solución paso a paso</summary>

```js
// VERSIÓN ITERATIVA
FUNCIÓN primerNegativoIterativo(lista)
  SI TAMAÑO(lista) ES IGUAL A 0 ENTONCES RETORNAR NULO   // Guard Clause

  DEFINIR encontrado = NULO
  PARA i DESDE 0 HASTA TAMAÑO(lista) - 1 HACER
    SI lista[i] < 0 ENTONCES
      CALCULAR encontrado = lista[i]
      ROMPER
    FIN SI
  FIN PARA

  RETORNAR encontrado
FIN FUNCIÓN

// VERSIÓN RECURSIVA
FUNCIÓN primerNegativoRecursivo(lista)
  SI TAMAÑO(lista) ES IGUAL A 0 ENTONCES RETORNAR NULO   // Caso Base (además de Guard Clause)

  SI lista[0] < 0 ENTONCES
    RETORNAR lista[0]                                     // Caso Base: ya lo encontramos
  FIN SI

  RETORNAR primerNegativoRecursivo(RESTO_DE(lista))       // Paso Recursivo: avanza un elemento
FIN FUNCIÓN

DEFINIR numeros = [5, 8, -3, 10, -7]

MOSTRAR primerNegativoIterativo(numeros)   // → -3
MOSTRAR primerNegativoRecursivo(numeros)   // → -3
```

**Por qué funciona así:**

- Ambas versiones usan la **misma Guard Clause de fondo**: si la lista está vacía, no hay nada que buscar. En la versión recursiva, esa Guard Clause también funciona como uno de los Caso Base.
- En la iterativa, `ROMPER` corta el bucle apenas se encuentra el primer negativo, evitando revisar el resto de la lista sin necesidad — igual que en la Fase 3 anterior.
- En la recursiva, cada llamada revisa solo el primer elemento; si no es negativo, delega el resto de la lista (`RESTO_DE(lista)`) a una nueva llamada de sí misma. Esa es la reducción del problema (Paso Recursivo) que eventualmente llega al Caso Base.
- Ninguna versión es "más correcta" que la otra: la iterativa suele ser más eficiente en memoria (no apila Stack Frames), mientras la recursiva puede ser más fácil de leer para ciertos problemas.

</details>
