---
course: programming-fundamentals
phase: VARIABLES_DATA_TYPES_MEMORY
order: 2
name: "Ámbito y ciclo de vida de las variables"
description: "Scope de Variables y Ciclo de Vida"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Scope · Global Scope · Block Scope · Function Scope · Scope Leakage · Variable Shadowing · Lifetime"
  summary: >
    El Scope (Ámbito) define en qué parte del código una variable existe y puede ser utilizada. El Lifetime (Ciclo de Vida) define cuándo nace y cuándo el sistema la elimina de memoria.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    El Scope es como los permisos de visibilidad en un edificio corporativo. Hay objetos de uso común en la sala de espera (Scope Global): cualquier visitante puede verlos. Hay objetos en la sala de conferencias (Scope de Función): solo las personas que están dentro de esa reunión pueden usarlos. Y hay objetos en el casillero personal de cada empleado (Scope de Bloque): solo ese empleado tiene la llave.

    Cuando termina la reunión y todos salen de la sala de conferencias, los objetos temporales de esa reunión desaparecen: el sistema los libera de memoria. A eso se refiere el **Lifetime**.
informationCard:
  - icon: "⚠️"
    title: "Pitfall: Scope Leakage (Fuga de Scope)"
    summary: >
      El error más común en principiantes: intentar usar una variable fuera del bloque donde fue declarada. El programa lanza un error porque, para ese punto del código, la variable ya no existe en memoria. Este comportamiento es universal en todos los lenguajes de programación, aunque cada uno use sus propias palabras clave para declarar variables.
    cardColor: "red"
---

## Los tres niveles de Scope

- **Global Scope:** accesible desde cualquier parte del programa. Son como variables globales de toda la aplicación.
- **Function Scope:** accesible solo dentro de la función donde fue creada. Muere cuando la función termina.
- **Block Scope:** accesible solo dentro del bloque de código donde fue declarada (un SI, un MIENTRAS, etc.).

## En pseudocódigo

```js
DEFINIR appVersion = "2.0"        // Global Scope: cualquier función puede usarla

FUNCIÓN procesarPedido()
  DEFINIR subtotal = 0            // Function Scope: solo existe aquí

  SI esFinDeSemana ES VERDADERO ENTONCES
    DEFINIR descuento = 15        // Block Scope: solo existe dentro de este SI
    CALCULAR subtotal = subtotal × (1 - descuento ÷ 100)
  FIN SI

  // 'descuento' ya no existe aquí afuera del bloque SI
  RETORNAR subtotal
FIN FUNCIÓN

// 'subtotal' tampoco existe aquí afuera de la función
```

## Shadowing (sombra de variable)

Ocurre cuando declaras una variable con el mismo nombre en un scope interno. La versión interna "oculta" a la externa dentro de ese bloque, sin eliminarla:

```js
DEFINIR color = "Azul"     // Scope externo

FUNCIÓN pintarParedes()
  DEFINIR color = "Rojo"   // Shadowing: oculta al color externo solo aquí
  MOSTRAR color            // → "Rojo"
FIN FUNCIÓN

MOSTRAR color              // → "Azul" (el externo sigue intacto)
```

> **Nota:** El Shadowing no es un error, pero puede confundir a quien lea el código si el nombre repetido no es evidente a simple vista. Usa nombres distintos cuando el significado también sea distinto.
