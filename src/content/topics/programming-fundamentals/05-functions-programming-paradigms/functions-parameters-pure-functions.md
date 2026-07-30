---
course: programming-fundamentals
phase: FUNCTIONS_PROGRAMMING_PARADIGMS
order: 1
name: "Funciones, parámetros y funciones puras"
description: "Funciones y Funciones Puras"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Function · Parameters · Arguments · Return Value · Pure Function · Side Effects · Determinism"
  summary: >
    Una Función es un bloque de código reutilizable que recibe datos de entrada (Parámetros), realiza un proceso y devuelve un resultado (Return Value). Una Función Pura siempre produce el mismo resultado ante la misma entrada.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Una función es como una **máquina expendedora**: le metes dinero (parámetro de entrada), presionas el botón de la Coca-Cola, y siempre te sale una Coca-Cola (resultado predecible). Nunca te sorprende con una Pepsi ni enciende las luces del cuarto. Eso es una **función pura**: predecible, sin sorpresas.

    Un **Efecto Secundario (Side Effect)** sería una máquina que a veces también enciende el televisor, llama a tu contacto, o cambia el precio de otra máquina del pasillo, además de darte la bebida. Hace cosas que no esperabas. En programación, esos efectos secundarios hacen el código muy difícil de predecir y corregir.
informationCard:
  - icon: "🚀"
    title: "Modern Paradigm: Funciones Puras y Testing"
    summary: >
      Las funciones puras son mucho más fáciles de probar (testing) porque siempre producen el mismo resultado. No dependen del estado global ni de factores externos.
    cardColor: "purple"
---

## Anatomía de una función

- **Nombre:** identificador descriptivo de lo que hace (calcularImpuesto, validarEmail).
- **Parámetros:** variables locales que reciben los datos de entrada al momento de la llamada.
- **Cuerpo:** las instrucciones que procesa.
- **Valor de retorno (Return Value):** el resultado que la función devuelve al lugar que la llamó.

## En pseudocódigo

```js
// Función Pura: mismo resultado para mismos argumentos, sin efectos
FUNCIÓN calcularDescuento(precioBase, porcentaje)
  CALCULAR ahorro = precioBase × (porcentaje ÷ 100)
  RETORNAR precioBase - ahorro
FIN FUNCIÓN

MOSTRAR calcularDescuento(100, 20)   // → 80 (siempre)
MOSTRAR calcularDescuento(100, 20)   // → 80 (siempre, sin importar cuántas veces)

// Función con Efecto Secundario (evitar cuando sea posible)
DEFINIR totalGlobal = 0

FUNCIÓN agregarAlTotal(valor)
  MODIFICAR totalGlobal = totalGlobal + valor   // Side Effect: modifica variable externa
  RETORNAR totalGlobal
FIN FUNCIÓN

// El resultado cambia dependiendo del estado global (impredecible)
MOSTRAR agregarAlTotal(50)   // → 50
MOSTRAR agregarAlTotal(50)   // → 100 (¡diferente aunque el argumento es el mismo!)
```

> **Nota:** no toda función con efectos secundarios es incorrecta — mostrar algo en pantalla o guardar en un archivo también son efectos secundarios necesarios. La idea es reconocerlos y no esconderlos dentro de funciones que parecen puras.
