---
course: programming-fundamentals
phase: FUNCTIONS_PROGRAMMING_PARADIGMS
order: 4
name: "Paradigma funcional: map, filter, reduce"
description: "Transformar Datos con Funciones Puras Encadenadas"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Functional Programming · Map · Filter · Reduce · Pipeline · Composition"
  summary: >
    El paradigma Funcional describe QUÉ transformación aplicar a los datos, usando funciones puras encadenadas, en vez de bucles manuales con variables que van cambiando de estado paso a paso.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en una línea de ensamblaje de una fábrica. Cada estación transforma el producto un poco y lo pasa a la siguiente estación: una lo pinta, otra le pone las etiquetas, otra lo empaqueta. Nadie carga la pieza completa de un lado a otro haciendo todo manualmente.

    Eso es un **Pipeline** funcional: cada función (Filtrar, Transformar, Reducir) hace una sola cosa y le pasa el resultado a la siguiente, en vez de un solo bloque de código que hace todo el trabajo con contadores y variables intermedias.
informationCard:
  - icon: "🚀"
    title: "Modern Paradigm: Composición y Pipelines"
    summary: >
      El desarrollo moderno prefiere componer funciones pequeñas y puras en cadena (pipeline), en lugar de escribir un solo bloque imperativo largo. "Componer funciones pequeñas" es el principio detrás de Map, Filter y Reduce.
    cardColor: "purple"
---

## Las tres operaciones fundamentales

- **Filter (Filtrar):** de una colección, se queda solo con los elementos que cumplen una condición.
- **Map (Transformar):** convierte cada elemento de la colección en algo nuevo, uno por uno.
- **Reduce (Reducir):** combina todos los elementos de la colección en un solo valor final (una suma, un total, un promedio).

Estas tres funciones son, en el fondo, **Funciones Puras** (como viste en el tema de Funciones): reciben una colección y devuelven un resultado nuevo, sin modificar la colección original ni depender de nada externo.

## Mismo problema, dos enfoques: imperativo vs funcional

```js
// DATOS: lista de productos
DEFINIR productos = [
  { nombre: "Laptop",  precio: 1000, activo: VERDADERO },
  { nombre: "Mouse",   precio: 25,   activo: VERDADERO },
  { nombre: "Cable",   precio: 5,    activo: FALSO      },
  { nombre: "Teclado", precio: 75,   activo: VERDADERO  }
]

// ENFOQUE IMPERATIVO: bucle manual con estado que va cambiando
DEFINIR total = 0
PARA CADA producto EN productos HACER
  SI producto.activo ES VERDADERO Y producto.precio > 50 ENTONCES
    CALCULAR total = total + producto.precio
  FIN SI
FIN PARA

// ENFOQUE FUNCIONAL: pipeline declarativo, sin variables intermedias mutables
DEFINIR total = productos
  → FILTRAR(activo Y precio > 50)
  → TRANSFORMAR(quedarse solo con el precio)
  → REDUCIR(sumar todos, empezando desde 0)

// Resultado en ambos casos: 1075 (1000 + 75)
MOSTRAR total
```

> **Nota:** en el enfoque funcional no le dices al programa "usa una variable `total`, revisa cada producto, súmalo si cumple la condición". Le dices "de estos datos, filtra los que cumplen esto, quédate con el precio, y súmalos". El **QUÉ** reemplaza al **CÓMO** paso a paso.
