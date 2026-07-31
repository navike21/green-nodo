---
course: programming-fundamentals
phase: FUNCTIONS_PROGRAMMING_PARADIGMS
order: 5
type: "proyecto"
name: "Proyecto integrador: un mismo problema, cuatro enfoques"
description: "Combina Funciones Puras, Closures, OOP y el Paradigma Funcional"
level: "Intermedio"
technicalTerms:
  title: "📌 Terminología técnica"
  subTitle: "Integration Project · Pure Functions · Closures · OOP · Functional Programming"
  summary: >
    Este proyecto resuelve el mismo problema con los cuatro enfoques de la fase, para que veas en un solo lugar cómo se relacionan la función pura, el closure, la clase y el pipeline funcional.
analogy:
  title: "💡 Para entenderlo sin tecnicismos"
  summary: |
    Es como preparar el mismo plato con cuatro utensilios distintos: el resultado final (la comida) es parecido, pero la forma de llegar ahí -y lo que aprendes de cada método- es diferente.
informationCard:
  - icon: "🏗️"
    title: "Architecture: Cómo abordar un desafío integrador"
    summary: >
      No busques "el enfoque correcto": el objetivo es notar qué parte del problema resuelve mejor cada herramienta (la función pura calcula, el closure recuerda, la clase agrupa, el pipeline transforma colecciones).
    cardColor: "blue"
---

## El desafío

Una tienda aplica un 15% de descuento a ciertos productos. Resuelve estas cuatro partes:

1. Escribe una **función pura** `aplicarDescuento(precio, porcentaje)` que retorne el precio con descuento.
2. Usa un **Closure** para crear un contador que registre cuántas veces se aplicó un descuento, sin usar ninguna variable global.
3. Modela un producto como una **Clase** `Producto` (OOP) con un método `aplicarDescuento`.
4. Dada una lista de productos, usa el **paradigma Funcional** (Filter → Map → Reduce) para calcular el total con descuento solo de los productos activos.

<details>
<summary>Ver solución paso a paso</summary>

```js
// 1) FUNCIÓN PURA: mismo resultado para los mismos argumentos, sin efectos secundarios
FUNCIÓN aplicarDescuento(precio, porcentaje)
  RETORNAR precio - (precio × (porcentaje ÷ 100))
FIN FUNCIÓN

MOSTRAR aplicarDescuento(100, 15)   // → 85

// 2) CLOSURE: cuenta los usos sin variable global
FUNCIÓN crearContadorDeDescuentos()
  DEFINIR usos = 0
  RETORNAR FUNCIÓN registrarUso()
    MODIFICAR usos = usos + 1
    RETORNAR usos
  FIN FUNCIÓN
FIN FUNCIÓN

DEFINIR contador = crearContadorDeDescuentos()
LLAMAR contador()   // → 1
LLAMAR contador()   // → 2

// 3) OOP: la misma operación, ahora dentro de una Clase
CLASE Producto
  PROPIEDADES: nombre, precio, activo

  FUNCIÓN aplicarDescuento(porcentaje)
    RETORNAR ESTE.precio - (ESTE.precio × (porcentaje ÷ 100))
  FIN FUNCIÓN
FIN CLASE

DEFINIR laptop = NUEVA Producto(nombre: "Laptop", precio: 1000, activo: VERDADERO)
MOSTRAR laptop.aplicarDescuento(15)   // → 850

// 4) FUNCIONAL: pipeline sobre una lista completa de productos
DEFINIR productos = [
  { nombre: "Laptop", precio: 1000, activo: VERDADERO },
  { nombre: "Cable",  precio: 5,    activo: FALSO },
  { nombre: "Mouse",  precio: 25,   activo: VERDADERO }
]

DEFINIR totalConDescuento = productos
  → FILTRAR(activo)
  → TRANSFORMAR(producto => aplicarDescuento(producto.precio, 15))
  → REDUCIR((acumulado, actual) => acumulado + actual, 0)

MOSTRAR totalConDescuento   // → 871.25 (850 de la Laptop + 21.25 del Mouse)
```

**Por qué funciona así:**

- `aplicarDescuento` es la misma función pura reutilizada en los cuatro enfoques: la usa directamente, la usa dentro del método de la Clase, y la usa dentro del `TRANSFORMAR` del pipeline. Una función pura bien escrita se reutiliza sin sorpresas en cualquier contexto.
- El Closure resuelve un problema distinto: no calcula nada, solo **recuerda** cuántas veces se usó algo, sin ensuciar el programa con una variable global.
- La Clase agrupa el dato (`precio`) junto con el comportamiento (`aplicarDescuento`) en una sola unidad: cada instancia de `Producto` sabe calcular su propio descuento.
- El pipeline Funcional resuelve el caso donde el problema ya no es "un producto", sino "una colección de productos": ahí es donde Filter, Map y Reduce brillan sobre un bucle manual.

</details>
