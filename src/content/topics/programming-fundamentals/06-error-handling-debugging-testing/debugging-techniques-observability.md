---
course: programming-fundamentals
phase: ERROR_HANDLING_DEBUGGING_TESTING
order: 2
name: "Técnicas de depuración y observabilidad"
description: "Debugging, Breakpoints y Observabilidad"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Debugging · Breakpoint · Step Over · Step Into · Step Out · Call Stack Inspection · Watcher"
  summary: >
    El Debugging es el proceso metódico de encontrar y corregir errores en el código. Los Breakpoints (Puntos de Interrupción) pausan la ejecución para inspeccionar el estado exacto del programa en ese instante.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina que eres un detective investigando una escena. En lugar de adivinar qué pasó, buscas pistas: huellas, testimonios, objetos fuera de lugar. Usas un método, no la intuición.

    El **Debugging** es ser ese detective de tu propio código. Un **Breakpoint** es como poner el video en pausa en el segundo exacto del "crimen": puedes ver cada objeto, cada variable, exactamente en qué estado estaba cuando todo salió mal.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Debugging Metódico"
    summary: >
      No adivines. El proceso correcto: 1) Reproduce el error de forma consistente. 2) Formula una hipótesis de causa. 3) Pon un Breakpoint cerca del error. 4) Inspecciona variables. 5) Confirma o refuta la hipótesis.
    cardColor: "blue"
---

## Herramientas de debugging

- **Breakpoint (Punto de Interrupción):** pausa el programa en esa línea específica para inspección.
- **Step Over:** ejecuta la línea actual completa y avanza a la siguiente, sin entrar en las funciones que llama.
- **Step Into:** entra al interior de la función que se está llamando en la línea actual.
- **Step Out:** termina la función actual y regresa al código que la llamó.
- **Watcher:** monitorea el valor de una variable específica en tiempo real mientras el código avanza.
- **Call Stack Panel:** muestra la cadena completa de llamadas activas en ese momento.

## Proceso de debugging en pseudocódigo

```js
// Síntoma: la función de cálculo de descuento retorna resultados incorrectos

FUNCIÓN calcularPrecioFinal(precio, descuento)
  // ← BREAKPOINT aquí: ¿qué valor tienen precio y descuento al llegar?

  CALCULAR factor = descuento ÷ 100
  // ← STEP OVER: inspeccionar si factor es el esperado (0.2 para 20%)

  CALCULAR resultado = precio × (1 - factor)
  // ← WATCHER en resultado: ¿es 80 para precio=100 y descuento=20?

  RETORNAR resultado
FIN FUNCIÓN
```

> **Nota:** si `precio` llegó como el texto `"100"` en lugar del número `100`, la multiplicación daría un resultado inesperado (recuerda la Type Coercion de la Fase 2). El debugger te mostraría exactamente ese tipo de error al inspeccionar el valor y su tipo en el Breakpoint.
