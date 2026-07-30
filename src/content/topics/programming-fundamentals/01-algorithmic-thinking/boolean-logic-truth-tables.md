---
course: programming-fundamentals
phase: ALGORITHMIC_THINKING
order: 3
name: "Lógica booleana y tablas de verdad"
description: "Álgebra Booleana y Tablas de Verdad"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Boolean Algebra · AND · OR · NOT · XOR · Short-circuit Evaluation"
  summary: >
    Toda decisión que toma un programa se reduce a Verdadero (true) o Falso (false). La Lógica Booleana es el sistema matemático que rige esas decisiones.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en un sistema de seguridad para tu casa. Si configuras la alarma con la regla **AND (Y)** — "suena si la puerta está abierta Y la ventana está abierta al mismo tiempo" — la alarma solo se activa cuando ambas condiciones se cumplen a la vez. Si solo se abre una, no pasa nada.

    Con la regla **OR (O)** — "suena si la puerta O la ventana se abre" — con que cualquiera de las dos se abra, ya se activa la alarma.

    El **Short-circuit** (cortocircuito) es simplemente eficiencia: si la alarma ya detectó que la puerta está abierta con un OR, no necesita revisar la ventana. Ya sabe la respuesta. Se ahorra trabajo innecesario.
informationCard:
  - icon: "⚡"
    title: "Performance: Short-Circuit Evaluation"
    summary: >
      Con AND: si la primera condición es FALSA, el programa ni revisa la segunda (ya sabe que el resultado será falso). Con OR: si la primera es VERDADERA, tampoco revisa la segunda. Esto ahorra procesamiento.
    cardColor: "yellow"
  - icon: "⚠️"
    title: "Pitfall Frecuente: Valores que se comportan como Falso"
    summary: >
      En la mayoría de lenguajes, ciertos valores se tratan automáticamente como FALSO aunque no lo sean explícitamente: el número 0, un texto vacío, un valor nulo o un valor inexistente.
    cardColor: "red"
---

Toda decisión que un programa toma (¿el usuario está autenticado?, ¿el número es mayor de 18?, ¿el saldo es suficiente?) se convierte en una expresión booleana que produce **Verdadero** o **Falso**.

## Los 4 operadores lógicos fundamentales

- **AND — "Y":** Verdadero solo si AMBAS condiciones son verdaderas.
- **OR — "O":** Verdadero si AL MENOS UNA condición es verdadera.
- **NOT — "No / Contrario":** Invierte el resultado. Si era Verdadero, lo convierte en Falso, y viceversa.
- **XOR — "O Exclusivo":** Verdadero solo si UNA de las dos condiciones es verdadera, pero no ambas al mismo tiempo.

## Tabla de verdad (Truth Table)

| A | B | A AND B | A OR B | NOT A |
|---|---|---------|--------|-------|
| Verdadero | Verdadero | Verdadero | Verdadero | Falso |
| Verdadero | Falso | Falso | Verdadero | Falso |
| Falso | Verdadero | Falso | Verdadero | Verdadero |
| Falso | Falso | Falso | Falso | Verdadero |

## Leyes de De Morgan

Estas leyes matemáticas permiten transformar expresiones lógicas complejas en formas más simples:

- La negación de (A Y B) es igual a (NO A) O (NO B).
- La negación de (A O B) es igual a (NO A) Y (NO B).

## En pseudocódigo

```js
DEFINIR edad = 25
DEFINIR tieneMembresia = VERDADERO

SI edad >= 18 Y tieneMembresia ES VERDADERO ENTONCES
  MOSTRAR "Acceso permitido"
SI NO
  MOSTRAR "Acceso denegado"
FIN SI

// Short-circuit: si edad < 18, ni siquiera se revisa tieneMembresia
```

> **Nota:** El Short-circuit no es solo una optimización de rendimiento: también se usa a propósito para evitar errores, por ejemplo comprobando primero que un dato existe antes de intentar usarlo dentro de la misma condición.
