---
course: programming-fundamentals
phase: VARIABLES_DATA_TYPES_MEMORY
order: 4
type: "proyecto"
name: "Proyecto integrador: precio con impuesto sin mutar el original"
description: "Combina Tipos por Referencia, Scope y Type Casting"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Integration Project · Reference Types · Function Scope · Type Casting"
  summary: >
    Este proyecto combina los tres temas de esta fase: evitar mutar accidentalmente un objeto de referencia, usar variables con scope de función, y convertir tipos explícitamente antes de operar.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Es como si te entregaran la ficha original de un producto en la tienda y te pidieran calcular su precio con impuesto sin escribir nada en esa ficha: puedes leerla, pero la que le devuelves al dueño debe quedar intacta.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Antes de escribir el pseudocódigo, identifica dónde el problema te obliga a NO mutar un objeto de referencia, dónde necesitas convertir un tipo explícitamente, y qué variables solo deberían existir dentro de la función.
    cardColor: "blue"
---

## El desafío

Tienes un producto representado como un objeto (tipo de referencia):

```js
DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }
```

Nota que `precioTexto` llega como **texto**, no como número.

Diseña en pseudocódigo una función `calcularPrecioConImpuesto(productoOriginal)` que:

1. **No mute** el objeto `productoOriginal` que recibe (el producto que le pasas debe seguir intacto después de llamarla).
2. Convierta explícitamente `precioTexto` a número (Type Casting) antes de operar.
3. Use una variable `impuesto` que solo exista dentro de la función (Function Scope).
4. Retorne el precio con un 15% de impuesto agregado.

<div data-pseudocode-challenge-mount></div>

<details>
<summary>Ver solución paso a paso</summary>

```js
FUNCIÓN calcularPrecioConImpuesto(productoOriginal)
  DEFINIR precioNumero = CONVERTIR_A_NUMERO(productoOriginal.precioTexto)  // Type Casting explícito
  DEFINIR impuesto = precioNumero × 0.15                                    // Function Scope: solo existe aquí

  RETORNAR precioNumero + impuesto
FIN FUNCIÓN

DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }

MOSTRAR calcularPrecioConImpuesto(producto)   // → 230
MOSTRAR producto.precioTexto                  // → "200" (el producto original NO cambió)
```

**Por qué funciona así:**

- La función nunca escribe (`MODIFICAR`) sobre `productoOriginal`: solo lo **lee**. Como nunca reasigna ni muta el objeto, el producto que le pasaste sigue exactamente igual después de llamarla, aunque sea un tipo de referencia.
- `precioTexto` se convierte explícitamente con `CONVERTIR_A_NUMERO` antes de operar. Si operaras directamente con el texto, correrías el riesgo de una Type Coercion inesperada (concatenación en vez de suma).
- `precioNumero` e `impuesto` solo existen mientras la función se ejecuta: nadie fuera de `calcularPrecioConImpuesto` puede acceder a ellas ni por accidente.

</details>
