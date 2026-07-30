---
course: programming-fundamentals
phase: ALGORITHMIC_THINKING
order: 6
type: "proyecto"
name: "Proyecto integrador: acceso a un evento"
description: "Combina Lógica Booleana, Guard Clauses e Input/Output"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Integration Project · Boolean Logic · Guard Clauses · Input/Output"
  summary: >
    Este proyecto no trae conceptos nuevos: te reta a combinar los tres temas ya vistos en esta fase (lógica booleana, guard clauses e input/output) para resolver un problema completo, tal como ocurre en el desarrollo de software real.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Ya aprendiste a cortar, sazonar y emplatar por separado. Este proyecto es la primera vez que te piden cocinar el plato completo: no hay una lección nueva que seguir, solo tus propias herramientas ya aprendidas, combinadas en el orden correcto.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      Antes de escribir una sola línea, identifica: ¿qué Input necesitas?, ¿qué condiciones inválidas debes rechazar primero con Guard Clauses?, y ¿qué combinación de AND/OR representa la regla de negocio real? Resolver esas tres preguntas en papel evita reescribir el algoritmo a mitad de camino.
    cardColor: "blue"
---

## El desafío

Un evento exclusivo tiene esta regla de acceso: **se permite entrar solo si la persona es mayor de edad Y (tiene invitación O es parte del staff)**.

Diseña en pseudocódigo un algoritmo que:

1. **Reciba** (Input) tres datos: `edad`, `tieneInvitacion` y `esStaff`.
2. Use una **Guard Clause** para rechazar de inmediato una edad inválida (por ejemplo, un número menor o igual a 0).
3. Use **lógica booleana** (AND/OR) para decidir si la persona puede entrar, aplicando exactamente la regla de arriba.
4. **Muestre** (Output) el mensaje final: "Acceso permitido" o "Acceso denegado".

Piensa tu solución en papel o en tu cabeza antes de revisar la respuesta.

<details>
<summary>Ver solución paso a paso</summary>

```js
INICIO
  RECIBIR edad
  RECIBIR tieneInvitacion
  RECIBIR esStaff

  // Guard Clause: rechazar datos inválidos antes de aplicar cualquier regla
  SI edad <= 0 ENTONCES
    MOSTRAR "Error: edad inválida"
    TERMINAR
  FIN SI

  // Lógica booleana: mayor de edad Y (invitación O staff)
  SI edad >= 18 Y (tieneInvitacion ES VERDADERO O esStaff ES VERDADERO) ENTONCES
    MOSTRAR "Acceso permitido"
  SI NO
    MOSTRAR "Acceso denegado"
  FIN SI
FIN
```

**Por qué funciona así:**

- La Guard Clause va primero porque no tiene sentido evaluar la regla de acceso con una edad que ni siquiera es válida.
- Los paréntesis en `(tieneInvitacion ES VERDADERO O esStaff ES VERDADERO)` son necesarios: sin ellos, el orden de evaluación podría cambiar el resultado. Esa sub-condición debe resolverse primero, y su resultado (Verdadero/Falso) es lo que después se combina con `edad >= 18` usando AND.
- Si `edad >= 18` es Falso, por Short-circuit ni siquiera hace falta revisar la parte de la invitación o el staff: ya se sabe que el resultado completo será Falso.

</details>
