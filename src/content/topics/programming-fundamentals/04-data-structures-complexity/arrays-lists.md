---
course: programming-fundamentals
phase: FUNDAMENTAL_DATA_STRUCTURES
order: 2
name: "Arrays / listas"
description: "Arreglos y Listas"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Array · List · Zero-based Indexing · Contiguous Memory · Dynamic Resizing"
  summary: >
    Un Array (Arreglo) es una colección ordenada de elementos accesibles mediante un índice numérico que comienza en cero. Es la estructura de datos más fundamental en programación.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina una fila de casilleros numerados en un gimnasio: 0, 1, 2, 3, 4... (siempre comienzan en 0 en programación). Para abrir el casillero que quieras, solo necesitas su número: vas directo, sin revisar los otros. Eso es acceso instantáneo.

    El problema aparece cuando necesitas insertar un casillero nuevo en la posición 0: tienes que empujar físicamente todos los demás un lugar a la derecha. Con 5 casilleros no es grave, pero con 5 millones el trabajo se vuelve enorme.
informationCard:
  - icon: "⚡"
    title: "Performance: Acceso O(1) vs Inserción O(n)"
    summary: >
      Acceder a cualquier elemento por su índice es instantáneo: O(1). Insertar al inicio de la lista es lento porque desplaza todos los elementos: O(n). Insertar al final es rápido: O(1).
    cardColor: "yellow"
---

## Características del Array

- **Indexado:** cada elemento tiene un número de posición que comienza en 0.
- **Ordenado:** los elementos mantienen el orden en que fueron insertados.
- **Heterogéneo (en lenguajes dinámicos):** puede contener distintos tipos de datos.

## Operaciones fundamentales

- **Agregar al final (Push):** inserta al final. Rápido: O(1).
- **Quitar del final (Pop):** elimina el último elemento. Rápido: O(1).
- **Agregar al inicio (Unshift):** inserta al inicio desplazando todo. Lento: O(n).
- **Quitar del inicio (Shift):** elimina el primero y desplaza todo. Lento: O(n).

## En pseudocódigo

```js
DEFINIR frutas = ["Manzana", "Banana", "Cereza", "Durazno"]
//                   índice 0    índice 1   índice 2   índice 3

MOSTRAR frutas[0]          // → "Manzana" (acceso por índice, O(1))
MOSTRAR frutas[2]          // → "Cereza"

AGREGAR_AL_FINAL frutas "Mango"
// frutas = ["Manzana", "Banana", "Cereza", "Durazno", "Mango"]

ELIMINAR_ULTIMO frutas
// frutas = ["Manzana", "Banana", "Cereza", "Durazno"]

// Recorrer toda la lista
PARA CADA fruta EN frutas HACER
  MOSTRAR fruta
FIN PARA
```

> **Nota:** el "Zero-based Indexing" (indexado desde cero) no es una elección arbitraria: el índice representa cuántos elementos hay *antes* de esa posición. El primer elemento tiene 0 elementos antes que él.
