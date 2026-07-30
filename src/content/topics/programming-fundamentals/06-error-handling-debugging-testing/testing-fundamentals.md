---
course: programming-fundamentals
phase: ERROR_HANDLING_DEBUGGING_TESTING
order: 3
name: "Testing y pensamiento de pruebas"
description: "Verificar que el Código Hace lo que Debe"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Test Case · Assertion · Expected vs Actual · Edge Case · Regression"
  summary: >
    Testing es escribir código que verifica automáticamente que otro código hace lo que debe, comparando el resultado obtenido (Actual) contra el resultado esperado (Expected).
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Piensa en el control de calidad de una fábrica de autos: cada auto pasa por una serie de pruebas antes de salir a la venta (frenos, luces, motor) en lugar de esperar a que el cliente se queje por la calle.

    El **Testing** en programación es exactamente ese control de calidad: en vez de confiar en que "probablemente funciona", escribes casos de prueba que revisan automáticamente cada parte del código, cada vez que algo cambia.
informationCard:
  - icon: "🚀"
    title: "Modern Paradigm: Pruebas Automatizadas vs Manuales"
    summary: >
      Probar algo manualmente (hacer clic tú mismo y ver qué pasa) solo verifica ese momento puntual. Una prueba automatizada queda guardada y se puede volver a ejecutar en segundos, las veces que quieras, sin esfuerzo humano repetido.
    cardColor: "purple"
  - icon: "⚠️"
    title: "Pitfall: Solo probar el Camino Feliz"
    summary: >
      El "camino feliz" es cuando todo sale como se espera (datos válidos, todo presente). El error más común es probar solo eso y olvidar los Edge Cases: listas vacías, números negativos, valores nulos, textos gigantes. Ahí es donde más fallan los programas reales.
    cardColor: "red"
---

## Anatomía de un Test Case (caso de prueba)

- **Arrange (Preparar):** dejar listos los datos de entrada que se van a usar.
- **Act (Actuar):** ejecutar la función o el proceso que se quiere probar.
- **Assert (Verificar / Assertion):** comparar el resultado obtenido (**Actual**) contra el resultado que se esperaba (**Expected**). Si no coinciden, la prueba falla.

## Camino feliz vs Edge Cases

- **Camino feliz (Happy Path):** el escenario normal, con datos válidos y completos.
- **Edge Case (caso borde):** situaciones límite o poco comunes que igual pueden ocurrir: una lista vacía, un número negativo donde se esperaba uno positivo, un texto vacío, un valor nulo.

Un buen conjunto de pruebas cubre ambos, no solo el camino feliz.

## Regression (regresión)

Una Regresión ocurre cuando un cambio nuevo en el código rompe algo que antes funcionaba correctamente. Las pruebas automatizadas existen precisamente para detectar esto de inmediato, en lugar de que el error llegue sin avisar hasta el usuario final.

## En pseudocódigo

```js
FUNCIÓN factorial(n)
  SI n <= 1 ENTONCES RETORNAR 1
  RETORNAR n × factorial(n - 1)
FIN FUNCIÓN

// Casos de prueba (Test Cases)
PRUEBA "factorial de 4 debe ser 24"
  DEFINIR resultado = factorial(4)
  VERIFICAR QUE resultado ES IGUAL A 24     // Expected: 24, Actual: resultado
FIN PRUEBA

PRUEBA "factorial de 0 debe ser 1 (Edge Case)"
  DEFINIR resultado = factorial(0)
  VERIFICAR QUE resultado ES IGUAL A 1
FIN PRUEBA

PRUEBA "factorial de un número negativo no debería colapsar (Edge Case)"
  DEFINIR resultado = factorial(-3)
  VERIFICAR QUE resultado NO ES NULO
FIN PRUEBA
```

> **Nota:** si la última prueba fallara, no significa que `factorial` esté "roto" en el camino feliz — significa que nadie consideró qué debía pasar con un Edge Case. Encontrar eso antes de que un usuario real lo encuentre es exactamente el valor del Testing.
