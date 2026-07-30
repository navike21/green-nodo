---
course: programming-fundamentals
phase: ALGORITHMIC_THINKING
order: 1
name: "¿Qué es el pseudocódigo?"
description: "El Borrador de Instrucciones Antes de Programar"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Pseudocode · Natural Language · Syntax · Keyword"
  summary: >
    El Pseudocódigo es una forma de escribir los pasos de una solución en un lenguaje simple y cercano al español, sin la sintaxis estricta de ningún lenguaje de programación real. Es el punto de partida de absolutamente todo este curso.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en la receta que tu abuela anota a mano en un cuaderno: "le pones un puñado de sal, lo dejas dorar hasta que huela rico, y si ves que le falta líquido, le agregas un poco más". No usa gramos exactos ni técnicas con nombre en francés, pero cualquiera que la lea entiende exactamente qué hacer, en qué orden.

    Esa receta casera es, ni más ni menos, lo que el **Pseudocódigo** es para la programación: una forma de anotar los pasos de una solución en tus propias palabras, sin preocuparte todavía por la sintaxis exacta de ningún lenguaje real. Más adelante, un "cocinero profesional" (Python, JavaScript, Java, o cualquier otro lenguaje) puede traducir esa misma receta a su forma exacta de escribirla. Pero la lógica — el orden de los pasos, las decisiones, las repeticiones — ya la pensaste desde antes, en pseudocódigo.
informationCard:
  - icon: "🧠"
    title: "Mental Model: Pseudocódigo no es código real"
    summary: >
      Ninguna computadora puede "ejecutar" pseudocódigo directamente: no es un lenguaje de programación, es una herramienta de pensamiento. Sirve para diseñar la lógica de una solución antes de traducirla a la sintaxis exacta de un lenguaje real.
    cardColor: "green"
  - icon: "⚠️"
    title: "Pitfall Frecuente: Buscar 'la sintaxis oficial' del pseudocódigo"
    summary: >
      No existe una única forma "correcta" de escribir pseudocódigo — varía de persona a persona, de libro a libro, de empresa a empresa. Lo importante no es seguir una regla oficial, sino que cualquiera que lo lea entienda claramente qué hace cada paso.
    cardColor: "red"
---

Antes de aprender cualquier concepto de programación, necesitas una forma de anotar tus ideas sin trabarte en la sintaxis de un lenguaje real. Para eso existe el pseudocódigo, y es exactamente lo que vas a usar en cada uno de los temas que siguen.

## ¿Por qué no empezamos directo con un lenguaje real?

Si empezaras aprendiendo Python, JavaScript o cualquier otro lenguaje al mismo tiempo que aprendes qué es una variable o un bucle, estarías resolviendo dos problemas difíciles a la vez: entender el concepto, Y memorizar la sintaxis exacta de ese lenguaje en particular (dónde van los paréntesis, los puntos y comas, las mayúsculas).

El pseudocódigo separa esos dos problemas. Primero entiendes el concepto con palabras simples en español. Cuando más adelante elijas un lenguaje real para programar, ya vas a tener la lógica clara — solo te va a faltar aprender su sintaxis particular, que es la parte más fácil.

## Las palabras clave que usaremos en todo el curso

Cada vez que veas un bloque de pseudocódigo en este curso (como los que ya viste, o los que vienen), vas a reconocer siempre las mismas palabras:

- **INICIO / FIN:** marcan dónde empieza y termina un algoritmo completo.
- **DEFINIR:** crea una variable nueva y le asigna un valor. Ej.: `DEFINIR edad = 25`.
- **MODIFICAR:** cambia el valor de una variable que ya existía.
- **CALCULAR:** hace una operación matemática y guarda el resultado.
- **MOSTRAR:** despliega un resultado, como salida del programa.
- **RECIBIR (DEL USUARIO):** pide un dato de entrada.
- **SI / SI NO / FIN SI:** toma una decisión según se cumpla o no una condición.
- **MIENTRAS / FIN MIENTRAS:** repite un bloque de instrucciones mientras una condición sea verdadera.
- **PARA / FIN PARA:** repite un bloque de instrucciones un número determinado de veces.
- **FUNCIÓN / FIN FUNCIÓN / RETORNAR:** agrupa instrucciones reutilizables y devuelve un resultado.

No necesitas memorizar esta lista ahora — la vas a ver una y otra vez en los siguientes temas hasta que se vuelva natural.

## Un primer ejemplo completo

```js
INICIO
  DEFINIR nombre = "Ana"
  DEFINIR edad = 25

  SI edad >= 18 ENTONCES
    MOSTRAR nombre + " es mayor de edad"
  SI NO
    MOSTRAR nombre + " es menor de edad"
  FIN SI
FIN
```

Lee esas líneas en voz alta: "define un nombre, define una edad, si la edad es mayor o igual a 18 entonces muestra un mensaje, si no muestra otro mensaje". No hace falta saber programar para entender exactamente qué va a pasar. Esa es, precisamente, la idea.

> **Nota:** de aquí en adelante, cada tema del curso usará este mismo pseudocódigo — sin inclinarse hacia ningún lenguaje de programación real — para que puedas enfocarte en el concepto, sin importar qué lenguaje elijas aprender después.
