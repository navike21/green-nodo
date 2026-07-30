---
course: programming-fundamentals
phase: VARIABLES_DATA_TYPES_MEMORY
order: 4
type: "proyecto"
name: "Proyecto integrador: total del carrito sin mutar el original"
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
    Es como si te entregaran la lista de compras original de otra persona y te pidieran calcular el total sin tachar ni escribir nada en su hoja: puedes leerla, pero la hoja que te devuelven debe quedar intacta.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Antes de escribir el pseudocódigo, identifica dónde el problema te obliga a NO mutar un objeto de referencia, dónde necesitas convertir un tipo explícitamente, y qué variables solo deberían existir dentro de la función.
    cardColor: "blue"
---

## El desafío

Tienes un carrito de compras representado como un objeto (tipo de referencia):

```js
DEFINIR carrito = {
  articulos: [
    { nombre: "Teclado", precioTexto: "45" },
    { nombre: "Mouse", precioTexto: "20" }
  ]
}
```

Nota que `precioTexto` llega como **texto**, no como número.

Diseña en pseudocódigo una función `calcularTotal(carritoOriginal)` que:

1. **No mute** el objeto `carritoOriginal` que recibe (el carrito que le pasas debe seguir intacto después de llamarla).
2. Convierta explícitamente cada `precioTexto` a número (Type Casting) antes de sumar.
3. Use una variable `total` que solo exista dentro de la función (Function Scope).
4. Retorne el total sumado de todos los artículos.

<details>
<summary>Ver solución paso a paso</summary>

```js
FUNCIÓN calcularTotal(carritoOriginal)
  DEFINIR total = 0                     // Function Scope: solo existe aquí

  PARA CADA articulo EN carritoOriginal.articulos HACER
    DEFINIR precioNumero = CONVERTIR_A_NUMERO(articulo.precioTexto)  // Type Casting explícito
    CALCULAR total = total + precioNumero
  FIN PARA

  RETORNAR total
FIN FUNCIÓN

DEFINIR carrito = {
  articulos: [
    { nombre: "Teclado", precioTexto: "45" },
    { nombre: "Mouse", precioTexto: "20" }
  ]
}

MOSTRAR calcularTotal(carrito)   // → 65
MOSTRAR carrito.articulos[0].precioTexto   // → "45" (el carrito original NO cambió)
```

**Por qué funciona así:**

- La función nunca escribe (`MODIFICAR`) sobre `carritoOriginal` ni sobre sus artículos: solo los **lee**. Como nunca reasigna ni muta el objeto, el carrito que le pasaste sigue exactamente igual después de llamarla, aunque sea un tipo de referencia.
- `precioTexto` se convierte explícitamente con `CONVERTIR_A_NUMERO` antes de sumarlo. Si sumaras directamente el texto, correrías el riesgo de una Type Coercion inesperada (concatenación en vez de suma).
- `total` y `precioNumero` solo existen mientras la función se ejecuta: nadie fuera de `calcularTotal` puede acceder a ellas ni por accidente.

</details>
