---
course: programming-fundamentals
phase: FUNDAMENTAL_DATA_STRUCTURES
order: 5
name: "Pilas y colas"
description: "Stacks & Queues"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Stack · LIFO (Last In, First Out) · Queue · FIFO (First In, First Out) · Push · Pop · Enqueue · Dequeue"
  summary: >
    Pilas y Colas son estructuras de datos abstractas que restringen cómo se insertan y eliminan los elementos, modelando situaciones reales con reglas de acceso específicas.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Una **Pila (Stack)** funciona como una torre de platos sucios en el fregadero. El último plato que pusiste encima es el primero que lavas (LIFO: Último en entrar, primero en salir). No puedes lavar el del fondo sin antes lavar todos los de arriba.

    Una **Cola (Queue)** funciona como la fila en la caja del supermercado. La primera persona que llegó es la primera que se atiende y se va (FIFO: Primero en entrar, primero en salir). Es la estructura más justa y ordenada.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Casos de Uso Reales"
    summary: >
      Stack: historial de navegación en el navegador, función deshacer (Ctrl+Z), llamadas recursivas en el Call Stack. Queue: cola de impresión de documentos, procesamiento de mensajes en orden, solicitudes en un servidor web.
    cardColor: "blue"
---

## Pila (Stack) — LIFO

Solo se puede insertar y eliminar por el mismo extremo (la cima). Las dos operaciones básicas son:

- **Push (Apilar):** agrega un elemento en la cima.
- **Pop (Desapilar):** elimina y retorna el elemento de la cima.

## Cola (Queue) — FIFO

Se inserta por un extremo (el final) y se elimina por el otro extremo (el frente). Las dos operaciones son:

- **Enqueue (Encolar):** agrega un elemento al final.
- **Dequeue (Desencolar):** elimina y retorna el elemento del frente.

## En pseudocódigo

```js
// PILA (Stack) — Historial de navegación
DEFINIR historial = PILA_VACIA
APILAR historial "google.com"
APILAR historial "gmail.com"
APILAR historial "youtube.com"

DESAPILAR historial    // → Retorna "youtube.com" (el último agregado)
DESAPILAR historial    // → Retorna "gmail.com"

// COLA (Queue) — Fila de pedidos de cocina
DEFINIR pedidos = COLA_VACIA
ENCOLAR pedidos "Mesa 1: Ensalada"
ENCOLAR pedidos "Mesa 2: Pizza"
ENCOLAR pedidos "Mesa 3: Pasta"

DESENCOLAR pedidos     // → Retorna "Mesa 1: Ensalada" (el primero en entrar)
DESENCOLAR pedidos     // → Retorna "Mesa 2: Pizza"
```

> **Nota:** recuerdas el Call Stack de la primera fase del curso — la zona de memoria donde se guardan las tareas activas — es, literalmente, una Pila (Stack): la última función que se llama es la primera en terminar y salir.
