---
course: programming-fundamentals
phase: VARIABLES_DATA_TYPES_MEMORY
order: 1
name: "Tipos primitivos vs tipos por referencia"
description: "Tipos Primitivos vs Referencia y Mutabilidad"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Primitives · Reference Types · Mutability · Immutability · Pass by Value · Pass by Reference"
  summary: >
    Los tipos primitivos guardan el dato directamente. Los tipos de referencia guardan una dirección de memoria que apunta a donde vive el dato. Esta diferencia causa la mayoría de los bugs en principiantes.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en dos situaciones distintas.

    Situación 1 — **Tipo Primitivo (por Valor):** tu amigo te pide la dirección de tu casa. Tú se la escribes en un papel. Ahora él tiene su propio papel: si lo tacha y escribe otra dirección, tu papel original no cambia para nada.

    Situación 2 — **Tipo de Referencia (por Referencia):** compartes con tu amigo el acceso editable a un documento de Google Docs. Ahora ambos miran el mismo documento real. Si él lo borra o lo modifica, tú verás los cambios también, porque ambos están mirando el mismo lugar.

    El primer caso es cómo funcionan los números y los textos simples. El segundo es cómo funcionan las listas y los objetos complejos.
informationCard:
  - icon: "🧠"
    title: "Mental Model: Dirección vs Contenido"
    summary: >
      Los tipos primitivos guardan el contenido directamente (el número 42). Los tipos de referencia guardan solo una dirección: la posición en memoria donde vive el objeto completo.
    cardColor: "green"
  - icon: "🚀"
    title: "Modern Paradigm: Inmutabilidad"
    summary: >
      En programación moderna se recomienda nunca modificar un objeto directamente. En su lugar, se crea una copia nueva con los cambios aplicados. Esto evita efectos secundarios inesperados.
    cardColor: "purple"
  - icon: "⚠️"
    title: "Pitfall Frecuente: Mutación Accidental"
    summary: >
      El error más común: modificas una "copia" de una lista y, sin querer, también modificas la original, porque ambas variables apuntaban al mismo lugar en memoria.
    cardColor: "red"
---

## Tipos primitivos (inmutables, pasan por valor)

Son datos simples de tamaño fijo. Cuando los copias, obtienes una copia completamente independiente:

- **Número (Number):** valores numéricos — 42, 3.14, -7.
- **Texto (String):** cadenas de caracteres — "Hola mundo", "usuario@email.com".
- **Booleano (Boolean):** solo puede ser Verdadero o Falso.
- **Nulo (Null / None):** ausencia intencional de valor — la variable existe pero no tiene contenido asignado.
- **Sin valor / No inicializado:** una variable declarada a la que aún no se le ha asignado ningún dato (cada lenguaje lo maneja a su manera).

## Tipos de referencia (mutables, pasan por referencia)

Son estructuras compuestas que viven en el Heap. Cuando los "copias", en realidad solo copias la dirección:

- **Objetos (Objects / Records):** colecciones de propiedades con nombre. Ej.: un objeto Persona con campos nombre y edad.
- **Listas / Arrays:** colecciones ordenadas de elementos. Ej.: una lista de números [10, 20, 30, 40] o de textos.
- **Funciones (Functions):** bloques de código reutilizable.

## En pseudocódigo

```js
// TIPO PRIMITIVO: copia independiente
DEFINIR a = 10
DEFINIR b = a          // b recibe una copia del valor 10
MODIFICAR b = 20
MOSTRAR a              // → Imprime: 10 (a NO cambió, son independientes)

// TIPO REFERENCIA: comparten el mismo objeto en memoria
DEFINIR persona1 = { nombre: "Ana", edad: 25 }
DEFINIR persona2 = persona1        // persona2 apunta al MISMO objeto
MODIFICAR persona2.nombre = "Carlos"
MOSTRAR persona1.nombre            // → Imprime: "Carlos" (¡sí cambió!)

// SOLUCIÓN MODERNA: crear una copia real del objeto
DEFINIR persona3 = COPIA_DE(persona1) CON { nombre: "Elena" }
// Ahora persona3 es un objeto completamente independiente
```

> **Nota:** Cuando "asignas" una variable de tipo referencia a otra, no estás duplicando el dato: estás duplicando la nota que dice dónde encontrarlo. Ambas notas siguen apuntando al mismo lugar en el Heap.
