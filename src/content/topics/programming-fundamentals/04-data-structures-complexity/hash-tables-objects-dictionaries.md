---
course: programming-fundamentals
phase: FUNDAMENTAL_DATA_STRUCTURES
order: 3
name: "Tablas hash / objetos / diccionarios"
description: "Tablas Hash, Objetos y Diccionarios"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Hash Table · Key-Value Pair · Hash Function · O(1) Lookup · Dictionary · Map"
  summary: >
    Una Tabla Hash almacena pares de Clave-Valor. La Función Hash convierte la clave en una posición de memoria, permitiendo encontrar cualquier valor de forma casi instantánea.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina una agenda telefónica inteligente. En una agenda normal en papel, para encontrar el número de "Rodríguez, Carlos" tienes que buscar página por página desde la R. Con mucha gente, eso puede tardar bastante.

    Una Tabla Hash es como una agenda con un sistema de búsqueda mágico: le dices "dame el número de Carlos Rodríguez" y el sistema lo ubica en un instante sin recorrer la lista completa, sin importar si hay 10 o 10 millones de contactos. Eso es búsqueda en tiempo constante: **O(1)**.
informationCard:
  - icon: "⚡"
    title: "Performance: O(1) Average Lookup"
    summary: >
      La magia de las Tablas Hash es que la búsqueda por clave es O(1) en promedio, independientemente del tamaño del conjunto de datos. Mucho más eficiente que buscar en una lista, que es O(n).
    cardColor: "yellow"
---

## Componentes de una Tabla Hash

- **Clave (Key):** el identificador único para encontrar un valor. Debe ser único.
- **Valor (Value):** la información asociada a esa clave. Puede ser cualquier tipo de dato.
- **Función Hash:** el algoritmo que convierte la clave en una posición de memoria. El proceso es interno y automático.

## Cuándo usar un Array vs una Tabla Hash

- Usa **Array** cuando el orden importa y accedes por posición numérica.
- Usa **Tabla Hash** cuando accedes por un nombre/identificador y la búsqueda rápida es prioritaria.

## En pseudocódigo

```js
DEFINIR inventario = {
  "manzana": { precio: 0.50, cantidad: 200 },
  "laptop":  { precio: 999,  cantidad: 15  },
  "teclado": { precio: 45,   cantidad: 80  }
}

// Búsqueda instantánea O(1) por clave
MOSTRAR inventario["laptop"].precio      // → 999
MOSTRAR inventario["manzana"].cantidad   // → 200

// Agregar un nuevo producto
ASIGNAR inventario["mouse"] = { precio: 25, cantidad: 150 }

// Verificar si existe una clave
SI "monitor" EXISTE EN inventario ENTONCES
  MOSTRAR inventario["monitor"]
SI NO
  MOSTRAR "Producto no encontrado"
FIN SI
```

> **Nota:** el nombre cambia según el lenguaje (Hash Table, Object, Dictionary, Map), pero la idea de fondo — clave que apunta a un valor, con búsqueda casi instantánea — es siempre la misma.
