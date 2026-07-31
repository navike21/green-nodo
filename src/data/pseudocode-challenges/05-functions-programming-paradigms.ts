import type { PseudocodeChallenge } from "./types";

export const challenge: PseudocodeChallenge = {
  topicId: "programming-fundamentals/functions-programming-paradigms/proyecto-integrador",
  referenceSource: `
FUNCIÓN aplicarDescuento(precio, porcentaje)
  RETORNAR precio - (precio × (porcentaje ÷ 100))
FIN FUNCIÓN

MOSTRAR aplicarDescuento(100, 15)   // → 85

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

CLASE Producto
  PROPIEDADES: nombre, precio, activo

  FUNCIÓN aplicarDescuento(porcentaje)
    RETORNAR ESTE.precio - (ESTE.precio × (porcentaje ÷ 100))
  FIN FUNCIÓN
FIN CLASE

DEFINIR laptop = NUEVA Producto(nombre: "Laptop", precio: 1000, activo: VERDADERO)
MOSTRAR laptop.aplicarDescuento(15)   // → 850

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
`,
  hiddenTestSource: `
PRUEBA "función pura: mismo resultado ante los mismos argumentos"
  VERIFICAR QUE aplicarDescuento(100, 15) ES IGUAL A 85
  VERIFICAR QUE aplicarDescuento(100, 15) ES IGUAL A 85
FIN PRUEBA

PRUEBA "closure: cada contador lleva su propio estado privado"
  DEFINIR contadorA = crearContadorDeDescuentos()
  DEFINIR contadorB = crearContadorDeDescuentos()
  VERIFICAR QUE contadorA() ES IGUAL A 1
  VERIFICAR QUE contadorA() ES IGUAL A 2
  VERIFICAR QUE contadorB() ES IGUAL A 1
FIN PRUEBA

PRUEBA "clase: cada instancia calcula su propio descuento (ESTE ligado por instancia)"
  DEFINIR laptopTest = NUEVA Producto(nombre: "Laptop", precio: 1000, activo: VERDADERO)
  DEFINIR mouseTest  = NUEVA Producto(nombre: "Mouse", precio: 25, activo: VERDADERO)
  VERIFICAR QUE laptopTest.aplicarDescuento(20) ES IGUAL A 800
  VERIFICAR QUE mouseTest.aplicarDescuento(20) ES IGUAL A 20
FIN PRUEBA

PRUEBA "pipeline funcional: filtra activos, transforma con descuento y reduce"
  DEFINIR productosTest = [
    { nombre: "A", precio: 200, activo: VERDADERO },
    { nombre: "B", precio: 40,  activo: FALSO },
    { nombre: "C", precio: 60,  activo: VERDADERO }
  ]
  DEFINIR totalTest = productosTest
    → FILTRAR(activo)
    → TRANSFORMAR(p => aplicarDescuento(p.precio, 15))
    → REDUCIR((acc, actual) => acc + actual, 0)
  VERIFICAR QUE totalTest ES IGUAL A 221
FIN PRUEBA
`,
};
