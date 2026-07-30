---
course: programming-fundamentals
phase: ALGORITHMIC_THINKING
order: 5
name: "Fundamentos de entrada y salida"
description: "Cómo un Programa se Comunica con el Mundo"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Input · Output · Standard Input/Output (stdin/stdout) · I/O Stream"
  summary: >
    Input y Output (Entrada y Salida, o "I/O") son los datos que un programa recibe del exterior y los resultados que produce hacia el exterior. Todo programa útil hace al menos una de las dos cosas.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en un mesero de restaurante. Primero toma tu pedido (**Input**): anota lo que quieres comer. Luego desaparece hacia la cocina, donde ocurre el proceso que ya conoces (el algoritmo). Finalmente regresa a tu mesa con el plato listo (**Output**).

    Sin el pedido inicial, la cocina no sabría qué preparar. Y sin traerte el plato de vuelta, toda la preparación no te serviría de nada. Un programa funciona igual: necesita **recibir** algo para trabajar, y **entregar** un resultado para que ese trabajo tenga sentido.
informationCard:
  - icon: "🧠"
    title: "Mental Model: El ciclo Leer → Procesar → Mostrar"
    summary: >
      Casi todo programa interactivo repite este ciclo: lee una entrada, la procesa con el algoritmo, muestra una salida y, si hace falta, vuelve a empezar. Es la misma idea de Input → Proceso → Output del tema anterior, aplicada de forma continua.
    cardColor: "green"
  - icon: "⚠️"
    title: "Pitfall Frecuente: Asumir que el Input siempre llega bien"
    summary: >
      Un error muy común de principiante es procesar la entrada asumiendo que siempre tendrá el formato correcto. En la práctica, el usuario puede escribir texto donde se esperaba un número, dejar un campo vacío, o cerrar un archivo antes de tiempo. Por eso el Input casi siempre se valida con Guard Clauses antes de usarse.
    cardColor: "red"
---

Un programa que no recibe ni produce absolutamente nada no le sirve a nadie. La **Entrada (Input)** y la **Salida (Output)** son el puente entre tu algoritmo y el mundo real: personas, archivos, redes u otros programas.

## ¿De dónde puede venir un Input?

- **El usuario:** lo que escribe en el teclado o selecciona con el mouse o la pantalla táctil.
- **Un archivo:** datos guardados previamente en el disco (un documento, una imagen, una hoja de cálculo).
- **La red:** información que llega desde otra computadora, por ejemplo la respuesta de un servidor.
- **Un sensor o dispositivo:** temperatura, ubicación GPS, una cámara, etc.

## ¿Hacia dónde puede ir un Output?

- **La pantalla:** el destino más común, como un mensaje o una interfaz visual.
- **Un archivo:** guardar el resultado para usarlo después.
- **La red:** enviar información a otra computadora.
- **Otro programa:** el resultado de un programa puede ser el Input de otro.

## Standard Input y Standard Output

En la mayoría de entornos de programación existen dos canales básicos por convención:

- **Standard Input (stdin):** el canal por defecto de entrada, normalmente el teclado.
- **Standard Output (stdout):** el canal por defecto de salida, normalmente la pantalla o consola.

Estos nombres seguirán apareciendo sin importar el lenguaje o la herramienta que uses, porque son un concepto universal de cómo los programas se comunican con su entorno.

## El ciclo Leer → Procesar → Mostrar

```js
INICIO
  MOSTRAR "¿Cuál es tu nombre?"
  RECIBIR DEL USUARIO nombre                             // Input

  CALCULAR saludo = "Hola, " + nombre + "! Bienvenido."  // Proceso

  MOSTRAR saludo                                         // Output
FIN
```

> **Nota:** Cuando este ciclo se repite indefinidamente esperando una nueva entrada cada vez (como un menú que sigue preguntando "¿qué deseas hacer?"), en realidad estás combinando I/O con un bucle **MIENTRAS**, que verás en la Fase 3.
