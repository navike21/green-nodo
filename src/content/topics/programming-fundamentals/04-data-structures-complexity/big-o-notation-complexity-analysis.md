---
course: programming-fundamentals
phase: FUNDAMENTAL_DATA_STRUCTURES
order: 1
name: "Notación Big-O y análisis de complejidad"
description: "Big-O y Análisis de Complejidad"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Big-O Notation · Time Complexity · Space Complexity · O(1) · O(log n) · O(n) · O(n²)"
  summary: >
    La Notación Big-O mide matemáticamente cómo crece el tiempo de ejecución o el consumo de memoria de un algoritmo en relación al tamaño de los datos de entrada. Es la escala que usan los programadores para comparar la eficiencia de dos soluciones.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina buscar un nombre en una guía telefónica:

    **O(1) — Constante:** tienes el número de página exacto. Vas directo. Sin importar si la guía tiene 10 o 10 millones de páginas, siempre tardas lo mismo.

    **O(n) — Lineal:** revisas cada página de principio a fin. Con 100 páginas tardas 100 segundos; con 1 millón tardas 1 millón de segundos. Crece proporcionalmente.

    **O(n²) — Cuadrática:** por cada página que revisas, revisas todas las demás también. Con 100 páginas haces 10,000 comparaciones. Con 1,000 páginas haces 1,000,000. Escala desastrosamente.
informationCard:
  - icon: "⚡"
    title: "Performance: Escala de Eficiencia Big-O"
    summary: >
      De mejor a peor: O(1) → O(log n) → O(n) → O(n log n) → O(n²) → O(2ⁿ) → O(n!). Un algoritmo O(n²) que hoy procesa 1,000 registros en 1 segundo tardará 1,000,000 de segundos con 1,000,000 de registros.
    cardColor: "yellow"
---

Antes de conocer las estructuras de datos de esta fase, necesitas una forma común de comparar qué tan "rápida" o "lenta" es cada una a medida que le agregas más datos. Esa forma es la **Notación Big-O**, y la usarás en cada tema que sigue.

## Las complejidades más comunes

- **O(1) — Constante:** siempre el mismo tiempo, sin importar el tamaño. Ej.: acceder a un elemento de un array por índice, buscar en una Tabla Hash.
- **O(log n) — Logarítmica:** reduce el problema a la mitad en cada paso. Ej.: búsqueda binaria en una lista ordenada.
- **O(n) — Lineal:** el tiempo crece proporcionalmente al tamaño. Ej.: recorrer una lista completa.
- **O(n²) — Cuadrática:** para cada elemento, revisas todos los demás. Ej.: dos bucles anidados sobre la misma lista.

## En pseudocódigo

```js
// O(1) — Acceso directo, siempre igual de rápido
FUNCIÓN obtenerPrimero(lista)
  RETORNAR lista[0]      // Una sola operación sin importar el tamaño
FIN FUNCIÓN

// O(n) — Recorrido lineal, crece con el tamaño
FUNCIÓN buscarElemento(lista, objetivo)
  PARA CADA elemento EN lista HACER
    SI elemento ES IGUAL A objetivo ENTONCES RETORNAR VERDADERO
  FIN PARA
  RETORNAR FALSO
FIN FUNCIÓN

// O(n²) — Bucles anidados, crece cuadráticamente
FUNCIÓN tieneRepetidos(lista)
  PARA i DESDE 0 HASTA TAMAÑO(lista) HACER
    PARA j DESDE 0 HASTA TAMAÑO(lista) HACER
      SI i ES DIFERENTE DE j Y lista[i] ES IGUAL A lista[j] ENTONCES
        RETORNAR VERDADERO
      FIN SI
    FIN PARA
  FIN PARA
  RETORNAR FALSO
FIN FUNCIÓN
// Con 1,000 elementos: hasta 1,000,000 de comparaciones. ¡Evitar cuando se pueda!
```

> **Nota:** a partir de aquí, cada estructura de datos que veas (Arrays, Tablas Hash, Sets, Pilas y Colas) se va a describir precisamente en términos de Big-O: por ejemplo, "acceso O(1)" o "búsqueda O(n)". Ya tienes el vocabulario para entender qué tan buena es cada una para cada tarea.
