---
course: programming-fundamentals
phase: FUNDAMENTAL_DATA_STRUCTURES
order: 4
name: "Sets (conjuntos)"
description: "Colecciones de Elementos Únicos"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Set · Uniqueness · Membership Test · Union · Intersection · Difference"
  summary: >
    Un Set (Conjunto) es una colección de elementos únicos, sin duplicados y sin un orden garantizado, optimizada para responder rápidamente la pregunta "¿este elemento ya existe aquí?".
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en la lista de invitados de una fiesta exclusiva: no puede haber nombres repetidos, y a nadie le importa en qué orden están escritos. En la puerta, el de seguridad solo necesita responder una pregunta: **"¿este nombre ya está en la lista?"**. No necesita saber en qué posición está, solo si está o no está.

    Eso es exactamente un Set: no le interesa el orden ni permite duplicados, solo responde muy rápido si un elemento pertenece o no a la colección.
informationCard:
  - icon: "⚡"
    title: "Performance: Membership Test O(1) vs O(n)"
    summary: >
      Preguntar "¿existe este elemento?" en un Set es casi tan rápido como en una Tabla Hash: O(1). Hacer la misma pregunta recorriendo un Array es mucho más lento: O(n), porque hay que revisar elemento por elemento.
    cardColor: "yellow"
  - icon: "⚠️"
    title: "Pitfall: Esperar orden o duplicados"
    summary: >
      Un error común es tratar un Set como si fuera un Array: esperar que mantenga el orden en que insertaste los elementos, o intentar guardar el mismo valor dos veces. Un Set ignora los duplicados automáticamente y no garantiza ningún orden.
    cardColor: "red"
---

## Set vs Array vs Hash Table

- Un **Array** permite elementos duplicados y mantiene el orden de inserción.
- Un **Set** no permite duplicados: si intentas agregar un elemento que ya existe, simplemente no pasa nada.
- Puedes pensar en un Set como una **Tabla Hash que solo guarda claves, sin valores asociados** — por eso hereda su velocidad para verificar si algo existe.

## Operaciones fundamentales

- **Agregar:** incluye un elemento si todavía no está en el conjunto.
- **Verificar pertenencia:** responde si un elemento existe o no dentro del Set. O(1) en promedio.
- **Eliminar:** quita un elemento del conjunto.
- **Unión (Union):** combina dos conjuntos en uno solo, sin repetir elementos.
- **Intersección (Intersection):** los elementos que están presentes en ambos conjuntos a la vez.
- **Diferencia (Difference):** los elementos de un conjunto que NO están en el otro.

## En pseudocódigo

```js
// Eliminar duplicados de una lista usando un Set
DEFINIR compras = ["pan", "leche", "pan", "huevos", "leche", "pan"]

DEFINIR comprasUnicas = CONJUNTO_VACIO
PARA CADA producto EN compras HACER
  AGREGAR producto A comprasUnicas
FIN PARA

MOSTRAR comprasUnicas   // → { "pan", "leche", "huevos" } (sin duplicados)

// Verificar pertenencia
SI "leche" EXISTE EN comprasUnicas ENTONCES
  MOSTRAR "Ya está en la lista de compras"
FIN SI

// Operaciones de conjuntos
DEFINIR equipoA = { "Ana", "Luis", "Marta" }
DEFINIR equipoB = { "Luis", "Pedro" }

MOSTRAR UNION(equipoA, equipoB)         // → { "Ana", "Luis", "Marta", "Pedro" }
MOSTRAR INTERSECCION(equipoA, equipoB)  // → { "Luis" }
MOSTRAR DIFERENCIA(equipoA, equipoB)    // → { "Ana", "Marta" }
```

> **Nota:** cuando lo único que te importa de una colección es "qué elementos hay" (sin importar cuántas veces se repitieron ni en qué orden llegaron), un Set casi siempre es la estructura correcta.
