---
course: programming-fundamentals
phase: FUNDAMENTAL_DATA_STRUCTURES
order: 6
type: "proyecto"
name: "Proyecto integrador: productos únicos y repeticiones, sin fuerza bruta"
description: "Combina Big-O, Arrays, Sets y Tablas Hash"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Integration Project · Big-O · Array · Set · Hash Table"
  summary: >
    Este proyecto te reta a resolver un problema que "a fuerza bruta" sería O(n²), usando en su lugar un Set y una Tabla Hash para lograrlo en O(n), y a explicar por qué esa diferencia importa.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Es la diferencia entre comparar a cada invitado de una fiesta con todos los demás para ver quién se repite (agotador y lento), contra pararte en la puerta con una lista de "ya vistos" y solo preguntar "¿este nombre ya está aquí?" a medida que entra cada persona (rápido, uno por uno).
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Antes de programar, pregúntate: ¿qué estructura responde "¿ya existe esto?" en O(1)? Esa es la pista de cuándo usar un Set o una Tabla Hash en vez de comparar cada elemento contra todos los demás.
    cardColor: "blue"
---

## El desafío

Tienes un array con los pedidos del día, con productos repetidos:

```js
DEFINIR pedidos = ["Laptop", "Mouse", "Laptop", "Teclado", "Mouse", "Laptop"]
```

Diseña en pseudocódigo una solución que:

1. Obtenga la lista de **productos únicos** pedidos ese día, usando un **Set**.
2. Cuente **cuántas veces** se pidió cada producto, usando una **Tabla Hash**.
3. Explique en un comentario, usando Big-O, **por qué** este enfoque es mejor que comparar cada producto contra todos los demás para encontrar duplicados.

<details>
<summary>Ver solución paso a paso</summary>

```js
DEFINIR pedidos = ["Laptop", "Mouse", "Laptop", "Teclado", "Mouse", "Laptop"]

// 1) Productos únicos con un Set → una sola pasada, O(n)
DEFINIR productosUnicos = CONJUNTO_VACIO
PARA CADA producto EN pedidos HACER
  AGREGAR producto A productosUnicos
FIN PARA
MOSTRAR productosUnicos   // → { "Laptop", "Mouse", "Teclado" }

// 2) Conteo de repeticiones con una Tabla Hash → misma pasada, O(n)
DEFINIR conteo = {}
PARA CADA producto EN pedidos HACER
  SI producto EXISTE EN conteo ENTONCES
    ASIGNAR conteo[producto] = conteo[producto] + 1
  SI NO
    ASIGNAR conteo[producto] = 1
  FIN SI
FIN PARA
MOSTRAR conteo   // → { "Laptop": 3, "Mouse": 2, "Teclado": 1 }

// 3) Por qué esto es mejor que comparar cada producto contra todos los demás:
// La alternativa "de fuerza bruta" sería, por cada producto, recorrer TODO el array
// de nuevo para contar sus repeticiones → dos bucles anidados → O(n²).
// Aquí, el Set y la Tabla Hash resuelven "¿ya existe?" y "¿cuántas veces?" en O(1)
// por cada elemento, así que una sola pasada de O(n) es suficiente para todo.
```

**Por qué funciona así:**

- Tanto el Set como la Tabla Hash responden "¿esto ya existe?" en **O(1)** en promedio. Por eso basta con recorrer el array **una sola vez** (O(n)) para resolver ambas partes del problema.
- La alternativa de comparar cada producto contra todos los demás (dos bucles anidados) sería **O(n²)**: con 6 productos son 36 comparaciones, pero con 10,000 pedidos serían 100,000,000 de comparaciones. La diferencia se vuelve enorme a medida que crecen los datos.
- Esta es la razón práctica por la que Big-O se enseñó **antes** que Arrays, Sets y Tablas Hash en esta fase: te da el vocabulario para justificar por qué una estructura es mejor que otra para un problema concreto.

</details>
