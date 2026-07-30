---
course: programming-fundamentals
phase: FUNCTIONS_PROGRAMMING_PARADIGMS
order: 3
name: "Paradigmas imperativo y orientado a objetos"
description: "Cómo Organizar el Código: Paso a Paso vs Objetos"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Paradigm · Imperative · OOP (Object-Oriented Programming) · Class · Instance · Encapsulation · Inheritance"
  summary: >
    Un Paradigma de Programación es una filosofía o estilo de organizar el código. El Imperativo describe el CÓMO paso a paso; la Programación Orientada a Objetos (OOP) modela el problema como objetos con datos y comportamiento propio.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en dos formas de pedirle a alguien que prepare un desayuno.

    **Imperativo:** "Primero abre el refrigerador. Toma los huevos. Cierra el refrigerador. Enciende la estufa. Espera 2 minutos. Agrega sal..." — instrucciones paso a paso explícitas, tú controlas cada detalle.

    **Orientado a Objetos (OOP):** "Chef, prepara el desayuno" — el Chef es un objeto que ya sabe cómo hacerlo internamente. Tú solo le pides el resultado, sin preocuparte por los pasos.
informationCard:
  - icon: "🧠"
    title: "Mental Model: Objeto = Datos + Comportamiento"
    summary: >
      Un objeto agrupa en un solo lugar tanto la información que describe algo (sus datos, como el precio o el nombre) como las acciones que puede realizar (su comportamiento, como aplicarDescuento). En Imperativo, esos datos y esas funciones suelen vivir separados.
    cardColor: "green"
  - icon: "🏗️"
    title: "Architecture: Encapsulación, el Closure de OOP"
    summary: >
      La Encapsulación en OOP resuelve el mismo problema que ya viste con los Closures: esconder datos internos y exponer solo lo necesario. La diferencia es que aquí ese "estado privado" vive dentro de una Clase en lugar de dentro de una función.
    cardColor: "blue"
---

## Paradigma Imperativo

Le dices al computador **CÓMO** hacer cada paso, en orden explícito. Tienes control total sobre cada detalle, pero el código puede volverse largo y repetitivo si el mismo proceso se repite en varios lugares.

```js
DEFINIR precio = 100
DEFINIR descuento = 20

CALCULAR ahorro = precio × (descuento ÷ 100)
CALCULAR precioFinal = precio - ahorro

MOSTRAR precioFinal   // → 80
```

## Paradigma Orientado a Objetos (OOP)

Modelas el problema como **objetos** del mundo real, cada uno con sus propias propiedades (datos) y comportamientos (funciones). Es ideal para sistemas complejos con muchas entidades que se relacionan entre sí.

- **Clase (Class):** el "molde" o plano que define qué propiedades y comportamientos tendrá un tipo de objeto. Ej.: la clase `Producto` define que todo producto tiene un `precio` y un método `aplicarDescuento`.
- **Instancia (Instance):** un objeto concreto creado a partir de una clase. Ej.: `laptop` y `mouse` son dos instancias distintas de la clase `Producto`, cada una con sus propios valores.
- **Encapsulación (Encapsulation):** ocultar los datos internos de un objeto y exponer solo lo necesario para interactuar con él desde afuera.
- **Herencia (Inheritance):** una clase puede reutilizar el comportamiento de otra clase más general. Ej.: una clase `ProductoDigital` podría heredar todo de `Producto` y agregar solo lo que la hace distinta (como un `enlaceDeDescarga`).

## En pseudocódigo

```js
CLASE Producto
  PROPIEDADES: nombre, precio

  FUNCIÓN aplicarDescuento(porcentaje)
    CALCULAR ahorro = ESTE.precio × (porcentaje ÷ 100)
    RETORNAR ESTE.precio - ahorro
  FIN FUNCIÓN
FIN CLASE

// Instancias: objetos concretos creados a partir de la clase
DEFINIR laptop = NUEVA Producto(nombre: "Laptop", precio: 1000)
DEFINIR mouse  = NUEVA Producto(nombre: "Mouse",  precio: 25)

MOSTRAR laptop.aplicarDescuento(20)   // → 800
MOSTRAR mouse.aplicarDescuento(20)    // → 20 (cada instancia calcula con SU propio precio)
```

> **Nota:** ningún paradigma es "el correcto" en absoluto. El desarrollo moderno combina Imperativo, OOP y Funcional (que verás en el siguiente tema) según lo que mejor resuelva cada parte del problema.
