---
course: programming-fundamentals
phase: VARIABLES_DATA_TYPES_MEMORY
order: 3
name: "Conversión y coerción de tipos"
description: "Conversión Explícita e Implícita de Tipos"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Type Casting · Type Coercion · Strict Equality · Loose Equality · Implicit Conversion"
  summary: >
    Type Casting es cuando tú le dices explícitamente al programa cómo convertir un dato. Type Coercion es cuando el lenguaje lo convierte automáticamente según su propio criterio, a veces sorprendiéndote.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina que le pides a un asistente que sume "5 manzanas" más "3". Un asistente diligente pero torpe (coerción implícita) podría decir: "5 manzanas3" (las pegó como texto). Otro asistente podría decir "8" (tomó solo el número). El problema es que **tú no sabes cuál de los dos te va a contestar**.

    La conversión **explícita (Type Casting)** es cuando tú mismo le aclaras: "primero convierte '5 manzanas' a solo el número 5, y luego suma con 3". Así siempre sabes el resultado esperado.

    La **comparación estricta** es la versión que no adivina: verifica que los valores sean exactamente del mismo tipo Y del mismo valor. La **comparación laxa** primero intenta convertir tipos y luego compara, generando resultados inesperados y difíciles de rastrear.
informationCard:
  - icon: "⚠️"
    title: "Pitfall: Las trampas de la coerción implícita"
    summary: >
      En lenguajes con coerción, la misma operación puede producir resultados distintos según el tipo de operador. Por ejemplo, sumar texto con número puede producir concatenación en lugar de suma matemática, mientras que restar podría convertir el texto a número. Por eso siempre es mejor convertir los tipos explícitamente antes de operar.
    cardColor: "red"
---

## Conversión explícita vs implícita

**Type Casting (Explícita):** el programador indica conscientemente cómo convertir el dato antes de usarlo.

**Type Coercion (Implícita):** el lenguaje convierte automáticamente los tipos para que la operación tenga sentido, a veces de formas inesperadas.

## En pseudocódigo

```js
// Type Casting explícito (controlado por el programador)
DEFINIR edadTexto = "25"                              // Tipo: texto
DEFINIR edadNumero = CONVERTIR_A_NUMERO(edadTexto)    // Tipo: número
CALCULAR resultado = edadNumero + 5                   // → 30 (suma matemática)

// Type Coercion implícito (el lenguaje decide automáticamente)
DEFINIR resultado2 = "25" + 5
// El lenguaje ve texto + número → algunos asumen concatenación
// resultado2 podría ser "255", no 30 → ¡trampa de coerción!

// Comparación Laxa (solo valor) vs Estricta (tipo + valor)
COMPARAR_LAXA     25 CON "25"   // Convierte tipos antes → Verdadero (peligroso)
COMPARAR_ESTRICTA 25 CON "25"   // Mismo tipo Y valor  → Falso (correcto y predecible)
// Regla: siempre preferir la comparación estricta para evitar sorpresas
```

> **Nota:** No es que la coerción implícita sea "mala" en sí misma: el problema es que su resultado depende de reglas internas de cada lenguaje que no siempre son intuitivas. Convertir explícitamente elimina esa ambigüedad.
