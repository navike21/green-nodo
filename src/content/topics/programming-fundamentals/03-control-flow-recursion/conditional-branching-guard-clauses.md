---
course: programming-fundamentals
phase: CONTROL_FLOW_RECURSION
order: 1
name: "Bifurcaciones condicionales y guard clauses"
description: "Condicionales y Cláusulas de Guardia"
level: "Básico"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Conditional Branching · If/Else · Switch/Case · Ternary Operator · Guard Clauses · Early Return"
  summary: >
    Las estructuras condicionales permiten al programa tomar diferentes caminos según las condiciones que se cumplan. Las Guard Clauses son una técnica para mantener ese código limpio y legible.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    En la entrada de un club nocturno, el portero aplica Guard Clauses sin saberlo: primero revisa si traes identificación — si no, te rechaza de inmediato. Luego revisa si eres mayor de edad — si no, también te regresa. Solo cuando pasas TODAS las verificaciones te deja entrar.

    Esto es mucho más eficiente que el enfoque incorrecto: dejarte entrar al lobby, luego a una segunda sala, luego a una tercera sala, y recién ahí revisar si traes identificación. Ese enfoque anidado se llama **"Pirámide de la Muerte"** y hace el código muy difícil de leer y mantener.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Guard Clauses = Early Return"
    summary: >
      La regla es simple: si una condición invalida el proceso, sal (retorna) inmediatamente al inicio del bloque. No permitas que el código principal se ejecute con datos incorrectos.
    cardColor: "blue"
---

## Tipos de estructuras condicionales

- **SI / SI NO (If / Else):** la bifurcación más básica: si algo se cumple, haz esto; de lo contrario, haz aquello.
- **SEGÚN / CASO (Switch / Case):** cuando tienes múltiples valores posibles para una misma variable. Más limpio que encadenar muchos SI / SI NO anidados.
- **Operador Ternario:** una forma compacta de expresar una condición simple en una sola línea: `resultado = condición ? valorSiVerdadero : valorSiFalso`.

## SI / SI NO — ejemplo con salida

```js
DEFINIR temperatura = 38

SI temperatura > 37.5 ENTONCES
  MOSTRAR "Tienes fiebre. Descansa y toma agua."
SI NO
  MOSTRAR "Temperatura normal. Todo bien."
FIN SI

// SALIDA: Tienes fiebre. Descansa y toma agua.
```

## SEGÚN / CASO (Switch / Case) — ejemplo con salida

Ideal cuando una misma variable puede tomar muchos valores distintos y cada uno requiere una acción diferente.

```js
DEFINIR diaDeSemana = 3

SEGÚN diaDeSemana HACER
  CASO 1: MOSTRAR "Lunes — Inicio de semana"
  CASO 2: MOSTRAR "Martes — Día de reuniones"
  CASO 3: MOSTRAR "Miércoles — Punto medio"     // este caso se activa
  CASO 4: MOSTRAR "Jueves — Casi termina"
  CASO 5: MOSTRAR "Viernes — ¡Por fin!"
  CASO 6: MOSTRAR "Sábado — Fin de semana"
  CASO 7: MOSTRAR "Domingo — Descanso"
  POR DEFECTO: MOSTRAR "Número de día inválido"
FIN SEGÚN

// SALIDA: Miércoles — Punto medio
```

También puedes agrupar varios casos bajo la misma acción, sin repetir código:

```js
DEFINIR nota = 4

SEGÚN nota HACER
  CASO 5: MOSTRAR "Excelente"
  CASO 4: MOSTRAR "Muy bien"     // este caso se activa (nota = 4)
  CASO 3: MOSTRAR "Aprobado"
  CASO 2:
  CASO 1: MOSTRAR "Reprobado"    // los casos 1 y 2 comparten la misma acción
  POR DEFECTO: MOSTRAR "Nota fuera de rango"
FIN SEGÚN

// SALIDA: Muy bien
```

## Operador ternario — ejemplo con salida

Es un atajo visual para decisiones simples de sí o no. Evita escribir un bloque SI/SI NO completo cuando la lógica cabe en una línea.

```js
DEFINIR edad = 20
DEFINIR mensaje = (edad >= 18) ? "Bienvenido, puedes entrar" : "Lo sentimos, no puedes entrar"
MOSTRAR mensaje

// SALIDA: Bienvenido, puedes entrar

DEFINIR esClienteVIP = VERDADERO
DEFINIR precioBase   = 100
DEFINIR precioFinal  = esClienteVIP ? precioBase × 0.7 : precioBase
MOSTRAR "Precio final: $" + precioFinal

// SALIDA: Precio final: $70
```

> **Regla de oro:** el operador ternario es solo para decisiones de una línea. Si la lógica es compleja, usa SI / SI NO — es más legible.

## Pirámide de la muerte — código a evitar

```js
FUNCIÓN procesarPago(usuario, monto)
  SI usuario NO ES NULO ENTONCES
    SI usuario.cuentaActiva ES VERDADERO ENTONCES
      SI monto > 0 ENTONCES
        SI usuario.saldo >= monto ENTONCES
          // Finalmente el proceso real... muy adentro
          PROCESAR pago
        FIN SI
      FIN SI
    FIN SI
  FIN SI
FIN FUNCIÓN
```

## Guard Clauses — la forma correcta

```js
FUNCIÓN procesarPago(usuario, monto)
  SI usuario ES NULO             ENTONCES RETORNAR "Error: usuario inválido"
  SI usuario.cuentaActiva ES FALSO ENTONCES RETORNAR "Error: cuenta inactiva"
  SI monto <= 0                  ENTONCES RETORNAR "Error: monto inválido"
  SI usuario.saldo < monto       ENTONCES RETORNAR "Error: saldo insuficiente"

  // Proceso principal, plano y limpio
  PROCESAR pago
  RETORNAR "Pago exitoso"
FIN FUNCIÓN
```

> **Nota:** cada Guard Clause sale inmediatamente si algo falla. El proceso real nunca se ejecuta con datos incorrectos, y el código queda plano en lugar de anidado.
