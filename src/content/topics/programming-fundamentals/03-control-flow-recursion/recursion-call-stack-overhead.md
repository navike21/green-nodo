---
course: programming-fundamentals
phase: CONTROL_FLOW_RECURSION
order: 3
name: "Recursividad y el costo en la pila de llamadas"
description: "Recursividad y Call Stack Overhead"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Recursion · Base Case · Recursive Step · Stack Frame · Stack Overflow · Tail Call"
  summary: >
    La Recursividad es una técnica donde una función se llama a sí misma para resolver versiones más pequeñas del mismo problema, hasta llegar a un Caso Base que detiene las llamadas.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en las **muñecas Matrioska** rusas: abres la grande y adentro hay una igual pero más pequeña. La abres también y hay otra aún más pequeña. Sigues abriendo hasta que llegas a la última muñeca sólida que ya no tiene nada adentro — esa es el **Caso Base**.

    Si no hubiera ninguna muñeca sólida al final (sin Caso Base), seguirías abriendo para siempre, o hasta que se te agote el espacio en la mesa. En programación, ese "quedarse sin espacio en la mesa" se llama **Stack Overflow**.
informationCard:
  - icon: "🧠"
    title: "Mental Model: Stack Frame"
    summary: >
      Cada llamada recursiva agrega un "Frame" (piso) a la Pila de Llamadas. Si la recursión va muy profunda sin encontrar el Caso Base, la pila se desborda (Stack Overflow) y el programa falla con un error.
    cardColor: "green"
---

## Dos partes obligatorias de toda función recursiva

1. **Caso Base (Base Case):** la condición que detiene las llamadas recursivas y retorna un valor concreto. Sin esto, el programa entra en un bucle infinito y colapsa.
2. **Paso Recursivo (Recursive Step):** la llamada a sí misma con un problema reducido (más cercano al Caso Base que el original).

## Ejemplo: calcular el factorial de un número

El factorial de 5 (escrito 5!) es 5 × 4 × 3 × 2 × 1 = 120. Se puede pensar como: "el factorial de 5 es 5 multiplicado por el factorial de 4, que es 4 multiplicado por el factorial de 3...".

```js
FUNCIÓN factorial(n)
  // Caso Base: cuando n es 1 o 0, la respuesta es simplemente 1
  SI n <= 1 ENTONCES
    RETORNAR 1
  FIN SI

  // Paso Recursivo: reducimos el problema llamando con (n - 1)
  RETORNAR n × factorial(n - 1)
FIN FUNCIÓN

MOSTRAR factorial(4)   // → 24
```

Cómo se ejecuta internamente para `factorial(4)`:

```
factorial(4) = 4 × factorial(3)
                     3 × factorial(2)
                             2 × factorial(1)
                                     = 1   ← Caso Base alcanzado

Regresando: 2×1=2, luego 3×2=6, luego 4×6=24
```

Cada una de esas llamadas (`factorial(4)`, `factorial(3)`, `factorial(2)`, `factorial(1)`) ocupa su propio **Stack Frame** en el Call Stack al mismo tiempo, esperando a que la llamada de adentro termine para poder completar su propia multiplicación.

> **Nota:** si `factorial` nunca llegara a su Caso Base (por ejemplo, si te olvidas del `SI n <= 1`), cada llamada seguiría apilando un Frame más sobre el Call Stack hasta agotar la memoria disponible: un **Stack Overflow**.
