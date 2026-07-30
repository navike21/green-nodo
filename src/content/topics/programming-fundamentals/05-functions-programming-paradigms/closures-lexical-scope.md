---
course: programming-fundamentals
phase: FUNCTIONS_PROGRAMMING_PARADIGMS
order: 2
name: "Closures y ámbito léxico"
description: "Cierres y Ámbito Léxico"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Closure · Lexical Scope · Encapsulation · Private State · Factory Function"
  summary: >
    Un Closure (Cierre) ocurre cuando una función interna "recuerda" y conserva acceso a las variables de su función contenedora, incluso después de que esa función contenedora ya haya terminado de ejecutarse.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Imagina que vives con tus padres y tu mamá tiene una caja fuerte personal con sus joyas. Cuando te mudas a tu propio departamento (la función interna sale del ámbito de la función externa), tu mamá te entrega una *copia de la llave* de esa caja fuerte, específicamente para ti.

    Aunque la casa de tus padres "cierre" (la función contenedora termina), tú conservas esa llave en tu bolsillo. Puedes abrir la caja fuerte cuando quieras y ver o modificar el contenido. Nadie más tiene esa llave — eso es el **estado privado encapsulado** en el Closure.
informationCard:
  - icon: "🧠"
    title: "Mental Model: La Mochila de Variables"
    summary: >
      Cada función lleva una "mochila" invisible con las variables del entorno donde fue creada. Aunque el entorno externo desaparezca de la pila, la mochila persiste mientras la función interna exista.
    cardColor: "green"
---

## ¿Por qué son útiles los Closures?

- **Encapsulación:** crean variables privadas que no pueden ser accedidas ni modificadas desde afuera del closure.
- **Estado persistente:** la función recuerda valores entre llamadas sin necesitar variables globales.
- **Factory Functions:** permiten crear múltiples instancias independientes con su propio estado.

## En pseudocódigo

```js
FUNCIÓN crearContadorPersonal(nombreUsuario)
  DEFINIR contador = 0          // Variable privada del closure

  // Retornamos un bloque de funciones que recuerdan 'contador'
  RETORNAR {
    FUNCIÓN incrementar()
      MODIFICAR contador = contador + 1
      MOSTRAR nombreUsuario + " tiene " + contador + " puntos"
    FIN FUNCIÓN

    FUNCIÓN reiniciar()
      MODIFICAR contador = 0
      MOSTRAR nombreUsuario + ": reiniciado"
    FIN FUNCIÓN
  }
FIN FUNCIÓN

// Cada usuario tiene su propio contador independiente
DEFINIR contadorAna  = crearContadorPersonal("Ana")
DEFINIR contadorJuan = crearContadorPersonal("Juan")

LLAMAR contadorAna.incrementar()    // "Ana tiene 1 puntos"
LLAMAR contadorAna.incrementar()    // "Ana tiene 2 puntos"
LLAMAR contadorJuan.incrementar()   // "Juan tiene 1 puntos" (independiente)

// 'contador' no puede accederse directamente desde afuera (encapsulado)
```

> **Nota:** el nombre "Ámbito Léxico" (Lexical Scope) viene de que la función recuerda las variables según **dónde fue escrita en el código**, no según desde dónde fue llamada. Por eso la "mochila" de `crearContadorPersonal` viaja con cada función interna sin importar quién las use después.
