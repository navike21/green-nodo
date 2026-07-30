---
course: programming-fundamentals
phase: ERROR_HANDLING_DEBUGGING_TESTING
order: 1
name: "Manejo de excepciones y trazas de pila"
description: "Try / Catch y Stack Traces"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Exception · Error · Try / Catch / Finally · Throw · Stack Trace · Runtime Error"
  summary: >
    El manejo de Excepciones permite capturar errores inesperados durante la ejecución sin que el programa colapse completamente, dando al usuario un mensaje útil en su lugar.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    En un avión moderno, si un motor falla (error inesperado), los pilotos no se bajan del avión en pleno vuelo. El avión tiene procedimientos alternativos predefinidos: enciende el sistema de respaldo, alerta a la tripulación, y aterriza controladamente en el aeropuerto más cercano.

    El bloque **Try / Catch** hace exactamente eso para tu programa: "intenta hacer esto (Try), pero si algo falla inesperadamente, ejecuta este procedimiento de emergencia (Catch) para manejarlo ordenadamente, en lugar de estrellarte".
informationCard:
  - icon: "🏗️"
    title: "Architecture: Error Bubbling"
    summary: >
      Los errores "burbujean" hacia arriba en la cadena de llamadas hasta ser capturados. Si nadie los captura, llegan al nivel más alto y detienen el programa. Captura los errores en el nivel más apropiado, no en cualquier lugar.
    cardColor: "blue"
---

## Tipos de errores comunes

- **Error de Sintaxis (Syntax Error):** el código está mal escrito y el programa ni puede iniciarse. Como un error de ortografía que hace incomprensible una oración.
- **Error de Ejecución (Runtime Error):** el código está bien escrito, pero algo falla durante la ejecución. Ej.: dividir entre cero, acceder a una variable que no existe.
- **Error de Lógica (Logic Error):** el programa corre sin errores, pero produce resultados incorrectos. El más difícil de detectar.

## Stack Trace (traza de pila)

Es el reporte que el sistema genera cuando ocurre un error, mostrando exactamente qué función llamó a cuál, y en qué línea falló. Es el "historial de pasos" que llevó al error.

## En pseudocódigo

```js
FUNCIÓN dividir(a, b)
  INTENTAR
    SI b ES IGUAL A 0 ENTONCES
      LANZAR ERROR "No se puede dividir entre cero"
    FIN SI
    RETORNAR a ÷ b

  CAPTURAR error EN
    MOSTRAR "Error capturado: " + error.mensaje
    RETORNAR NULO         // Valor de respaldo (fallback)

  FINALMENTE
    // Este bloque siempre se ejecuta, haya o no error
    MOSTRAR "Operación de división finalizada"
  FIN INTENTAR
FIN FUNCIÓN

MOSTRAR dividir(10, 2)    // → 5
MOSTRAR dividir(10, 0)    // → Error capturado, el programa no colapsa
```

> **Nota:** el bloque `FINALMENTE` es útil para liberar recursos (cerrar un archivo, cerrar una conexión) sin importar si la operación tuvo éxito o falló.
