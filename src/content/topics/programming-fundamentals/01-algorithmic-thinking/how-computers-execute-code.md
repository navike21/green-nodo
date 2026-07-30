---
course: programming-fundamentals
phase: ALGORITHMIC_THINKING
order: 2
name: "Cómo las computadoras ejecutan el código"
description: "Modelo de Ejecución y Memoria"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Execution Model · CPU · RAM · Call Stack · Heap Memory"
  summary: >
    Cómo la CPU procesa instrucciones paso a paso y cómo se organiza la memoria: la Pila de Llamadas (Call Stack) para ejecución inmediata y el Montículo (Heap) para datos más grandes.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina que la computadora es un cocinero de un restaurante de comida rápida. Ese cocinero tiene una pequeña tablita de trabajo justo frente a él (la **memoria Call Stack**): ahí solo caben las cosas pequeñas que está usando en este exacto momento, como la espátula o la sal. Pero en la cocina grande detrás hay una refrigeradora enorme (el **Heap**) donde se guardan los ingredientes grandes: las ollas con salsas, los recipientes con queso, etc.

    La clave: cuando el cocinero quiere algo del refrigerador, no va y lo carga todo. Simplemente pone una notita en su tablita que dice **"el queso está en el estante 3"**. Eso es lo que los programadores llaman una **referencia de memoria**.
informationCard:
  - icon: "🧠"
    title: "Mental Model: Instruction Cycle"
    summary: >
      La CPU no improvisa nada. Ejecuta instrucciones de forma estrictamente secuencial una por una: lee la instrucción, la decodifica, la ejecuta. Como seguir los pasos de una receta sin saltarse ninguno.
    cardColor: "green"
  - icon: "🚀"
    title: "Modern Paradigm: JIT Compilation"
    summary: >
      Los motores modernos de ejecución no leen el código instrucción por instrucción como un humano lee un libro. Lo traducen a instrucciones nativas de la CPU justo antes de ejecutarlas (Compilación Just-In-Time), haciéndolas mucho más rápidas.
    cardColor: "purple"
---

Para aprender a programar en cualquier lenguaje, primero necesitas entender en qué entorno corre tu código. No escribes para humanos: escribes para una máquina que sigue instrucciones muy precisas.

## ¿Qué es la CPU?

La **CPU (Unidad Central de Procesamiento)** es el cerebro de la computadora. Su único trabajo es ejecutar instrucciones, millones por segundo.

No entiende historias ni conceptos, solo pasos concretos:

- Suma este número.
- Guarda este valor.
- Compara estos dos datos.

## ¿Qué es la RAM?

La **RAM (Memoria de Acceso Aleatorio)** es el espacio de trabajo temporal de la CPU.

Es ultrarrápida, pero pequeña, y se borra al apagar el equipo. Todo el código que ejecutas y sus datos temporales viven aquí mientras el programa está corriendo.

## La RAM tiene dos zonas principales

- **Call Stack (Pila de Llamadas):** Es la zona de trabajo inmediata. Guarda qué tareas están activas en este momento y en qué orden se iniciaron. Funciona como una pila de platos: **el último que pusiste es el primero que sacas**, siguiendo el principio **LIFO (Last In, First Out)**.

- **Heap (Montículo):** Es la zona de almacenamiento flexible para datos de tamaño variable. Cuando guardas algo grande o que puede crecer (como una lista de elementos), va aquí. El **Call Stack** solo guarda una **referencia** indicando dónde encontrar esos datos.

## Pseudocódigo: ¿Cómo se vería esto?

El pseudocódigo es una forma de escribir instrucciones en un lenguaje casi humano, sin preocuparte por la sintaxis de un lenguaje real.

Es la herramienta de planificación de todo programador.

```js
INICIO del programa

  DEFINIR precio = 100
  DEFINIR impuesto = 15

  CALCULAR total = precio + (precio × impuesto ÷ 100)

  MOSTRAR total

  DEFINIR carrito = {
    articulos: 3,
    total: 115
  }

FIN del programa
```

> **Nota:** Los datos simples (como números o textos cortos) normalmente se almacenan directamente en el **Call Stack**, mientras que los datos complejos (como listas, objetos o colecciones con múltiples propiedades) se almacenan en el **Heap** y son referenciados desde el Stack.
