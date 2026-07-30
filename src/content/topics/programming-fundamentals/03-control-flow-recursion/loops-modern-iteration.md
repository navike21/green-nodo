---
course: programming-fundamentals
phase: CONTROL_FLOW_RECURSION
order: 2
name: "Bucles e iteración moderna"
description: "Bucles e Iteración"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Loop · For Loop · While Loop · Do-While · Break · Continue · Iteration · Infinite Loop"
  summary: >
    Los bucles permiten repetir un bloque de instrucciones múltiples veces sin copiar y pegar el código. Controlar cuándo el bucle se detiene es fundamental para evitar bucles infinitos.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Si tuvieras que enviar 500 invitaciones por correo, no escribirías el mensaje 500 veces. Escribes el mensaje una vez, y dices: "repite este proceso 500 veces, cambiando el nombre del destinatario cada vez".

    Un **bucle (Loop)** es exactamente eso: "haz esto repetidamente hasta que se cumpla una condición de parada". La condición de parada es crucial: sin ella, el proceso nunca termina (el equivalente a que el asistente nunca deje de enviar correos, para siempre).
informationCard:
  - icon: "🚀"
    title: "Modern Paradigm: Iteración Declarativa"
    summary: >
      Los lenguajes modernos prefieren decirle al programa QUÉ quieres hacer con cada elemento (filtrar los mayores de 18, transformar precios con descuento) en lugar de decirle CÓMO hacerlo paso a paso con contadores manuales.
    cardColor: "purple"
  - icon: "⚠️"
    title: "Pitfall: Bucle Infinito"
    summary: >
      Si la condición de parada nunca se cumple, el programa queda atrapado para siempre en el bucle. Esto congela la aplicación y consume toda la memoria disponible.
    cardColor: "red"
---

## Tipos de bucles

- **PARA (For):** cuando sabes exactamente cuántas veces repetir algo.
- **MIENTRAS (While):** cuando repites mientras una condición sea verdadera (no sabes cuántas veces de antemano).
- **HAZ-MIENTRAS (Do-While):** igual que While, pero garantiza que el bloque se ejecute al menos una vez antes de revisar la condición.

## Control de bucles: Break y Continue

- **ROMPER (Break):** detiene el bucle inmediatamente y sale.
- **CONTINUAR (Continue):** salta la iteración actual y pasa a la siguiente sin salir del bucle.

## Bucle PARA — ejemplo con salida paso a paso

```js
DEFINIR invitados = ["Ana", "Carlos", "María", "Pedro", "Lucía"]

PARA i DESDE 0 HASTA 4 HACER
  MOSTRAR "Invitación " + (i + 1) + " — Hola " + invitados[i] + ", estás invitado/a!"
FIN PARA
```

Salida:

```
Invitación 1 — Hola Ana, estás invitado/a!
Invitación 2 — Hola Carlos, estás invitado/a!
Invitación 3 — Hola María, estás invitado/a!
Invitación 4 — Hola Pedro, estás invitado/a!
Invitación 5 — Hola Lucía, estás invitado/a!
```

## ROMPER (Break) — detener el bucle ante una condición

```js
DEFINIR productos  = ["Laptop", "Mouse", "Cable", "Monitor"]
DEFINIR cantidades = [5, 0, 12, 3]

PARA i DESDE 0 HASTA 3 HACER
  SI cantidades[i] ES IGUAL A 0 ENTONCES
    MOSTRAR "Agotado encontrado: " + productos[i]
    ROMPER                       // sal del bucle, ya no revises el resto
  FIN SI
  MOSTRAR productos[i] + " — en stock: " + cantidades[i]
FIN PARA
```

Salida:

```
Laptop — en stock: 5
Agotado encontrado: Mouse
(el bucle se detiene aquí: Cable y Monitor no se revisan)
```

## CONTINUAR (Continue) — saltar una iteración

```js
DEFINIR precios = [120, 35, 80, 15, 200, 45, 95]

PARA CADA precio EN precios HACER
  SI precio < 50 ENTONCES CONTINUAR    // salta este precio, ve al siguiente
  MOSTRAR "Precio incluido: $" + precio
FIN PARA
```

Salida:

```
Precio incluido: $120
Precio incluido: $80
Precio incluido: $200
Precio incluido: $95
(35, 15 y 45 fueron saltados por el CONTINUAR)
```

## Bucle MIENTRAS — cuando no sabes cuántas veces repetir

```js
DEFINIR secreto  = 7
DEFINIR intento  = 0
DEFINIR rondas   = 0

MIENTRAS intento ES DIFERENTE DE secreto HACER
  CALCULAR rondas = rondas + 1
  RECIBIR intento DEL USUARIO
  SI intento < secreto ENTONCES MOSTRAR "Muy bajo, intenta de nuevo"
  SI intento > secreto ENTONCES MOSTRAR "Muy alto, intenta de nuevo"
FIN MIENTRAS

MOSTRAR "¡Correcto! Lo lograste en " + rondas + " intento(s)"
```

Simulación (el usuario ingresa 3, luego 9, luego 7):

```
Ronda 1 → usuario ingresa 3 → "Muy bajo, intenta de nuevo"
Ronda 2 → usuario ingresa 9 → "Muy alto, intenta de nuevo"
Ronda 3 → usuario ingresa 7 → condición cumplida, sale del MIENTRAS
¡Correcto! Lo lograste en 3 intento(s)
```

> **Nota:** todo bucle MIENTRAS necesita que, en algún momento dentro de su cuerpo, la condición de parada pueda volverse falsa. Si `intento` nunca cambiara, este bucle jamás terminaría.
