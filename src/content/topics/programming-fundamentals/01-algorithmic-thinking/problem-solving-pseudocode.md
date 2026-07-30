---
course: programming-fundamentals
phase: ALGORITHMIC_THINKING
order: 4
name: "Resolución de problemas y pseudocódigo"
description: "Pensamiento Algorítmico y Pseudocódigo"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Algorithm · Input / Output · Pseudocode · Flowchart · Guard Clauses"
  summary: >
    Un Algoritmo es una secuencia finita y ordenada de pasos para resolver un problema. El Pseudocódigo es la herramienta para escribir esos pasos en un lenguaje casi humano antes de codificar.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Cuando alguien te pide que vayas al banco a hacer un trámite, lo primero que haces mentalmente antes de salir es: ¿llevo mi documento de identidad? Si no, me regreso. ¿El banco está abierto? Si no, no voy. ¿Tengo el número de cuenta? Si no, lo busco.

    Eso es exactamente una **Guard Clause (Cláusula de Guardia)**: validar las condiciones necesarias justo al inicio para no perder tiempo en un proceso que de todas formas va a fallar.

    Un **Algoritmo** es simplemente eso: la lista de verificaciones y pasos que haces mentalmente antes y durante cualquier tarea, pero escrita de forma precisa para que una máquina pueda seguirla.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Guard Clauses vs Anidación"
    summary: >
      La anidación excesiva de condiciones (un SI dentro de otro SI dentro de otro SI) se llama "Pirámide de la Muerte". Las Guard Clauses resuelven esto verificando las condiciones de error al inicio y saliendo de inmediato si algo falla.
    cardColor: "blue"
---

Antes de escribir cualquier línea de código en un lenguaje de programación real, los desarrolladores experimentados escriben el **Pseudocódigo**: una descripción del algoritmo en un lenguaje intermedio entre el español/inglés natural y el código de una computadora.

## Componentes de todo algoritmo

- **Input (Entrada):** los datos que el algoritmo recibe para trabajar.
- **Proceso:** los pasos que transforman y calculan esos datos.
- **Output (Salida):** el resultado que produce.

## Reglas del buen pseudocódigo

1. Escribe una instrucción por línea.
2. Usa MAYÚSCULAS para las palabras de control (SI, ENTONCES, MIENTRAS, PARA, FIN).
3. Valida las entradas al inicio, antes de procesar (Guard Clauses).
4. Sé específico: "Mostrar el resultado" es mejor que "hacer algo con el número".

## Ejemplo: calcular el precio final de una compra

```js
INICIO
  RECIBIR precioBase
  RECIBIR porcentajeDescuento

  // Guard Clauses: validar entradas
  SI precioBase <= 0 ENTONCES
    MOSTRAR "Error: el precio debe ser mayor a cero"
    TERMINAR
  FIN SI

  SI porcentajeDescuento < 0 O porcentajeDescuento > 100 ENTONCES
    MOSTRAR "Error: el descuento debe estar entre 0 y 100"
    TERMINAR
  FIN SI

  // Proceso principal
  CALCULAR descuento = precioBase × (porcentajeDescuento ÷ 100)
  CALCULAR precioFinal = precioBase - descuento

  // Salida
  MOSTRAR "Precio final: " + precioFinal
FIN
```

> **Nota:** Observa cómo las Guard Clauses salen al principio si algo falla, evitando que el proceso principal se ejecute con datos inválidos.
