// Verifica el intérprete contra las 6 soluciones de referencia reales del curso
// (los bloques <details><summary>Ver solución paso a paso</summary> de cada
// proyecto-integrador.md), usando los comentarios "// →" ya presentes junto a
// cada MOSTRAR como oráculo de resultado esperado.
import { describe, expect, it } from "vitest";
import { runPseudocode } from "../runner";

describe("Fixture: Fase 1 — acceso a un evento", () => {
  const source = `
INICIO
  RECIBIR edad
  RECIBIR tieneInvitacion
  RECIBIR esStaff

  SI edad <= 0 ENTONCES
    MOSTRAR "Error: edad inválida"
    TERMINAR
  FIN SI

  SI edad >= 18 Y (tieneInvitacion ES VERDADERO O esStaff ES VERDADERO) ENTONCES
    MOSTRAR "Acceso permitido"
  SI NO
    MOSTRAR "Acceso denegado"
  FIN SI
FIN
`;

  it("mayor de edad con invitación → acceso permitido", () => {
    const r = runPseudocode(source, { inputs: [20, true, false] });
    expect(r.ok).toBe(true);
    expect(r.output).toEqual(["Acceso permitido"]);
  });

  it("mayor de edad sin invitación ni staff → acceso denegado", () => {
    const r = runPseudocode(source, { inputs: [20, false, false] });
    expect(r.output).toEqual(["Acceso denegado"]);
  });

  it("edad inválida → guard clause y TERMINAR", () => {
    const r = runPseudocode(source, { inputs: [-5, false, false] });
    expect(r.output).toEqual(["Error: edad inválida"]);
  });
});

describe("Fixture: Fase 2 — precio con impuesto sin mutar el original", () => {
  const source = `
FUNCIÓN calcularPrecioConImpuesto(productoOriginal)
  DEFINIR precioNumero = CONVERTIR_A_NUMERO(productoOriginal.precioTexto)
  DEFINIR impuesto = precioNumero × 0.15

  RETORNAR precioNumero + impuesto
FIN FUNCIÓN

DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }

MOSTRAR calcularPrecioConImpuesto(producto)   // → 230
MOSTRAR producto.precioTexto                  // → "200" (el producto original NO cambió)
`;

  it("retorna 230 y no muta producto.precioTexto", () => {
    const r = runPseudocode(source);
    expect(r.ok).toBe(true);
    expect(r.output).toEqual(["230", "200"]);
  });
});

describe("Fixture: Fase 3 — primer múltiplo de 7, dos formas", () => {
  const source = `
FUNCIÓN primerMultiploDeSieteIterativo(n)
  SI n < 1 ENTONCES RETORNAR NULO

  DEFINIR encontrado = NULO
  PARA i DESDE 1 HASTA n HACER
    SI i MOD 7 ES IGUAL A 0 ENTONCES
      CALCULAR encontrado = i
      ROMPER
    FIN SI
  FIN PARA

  RETORNAR encontrado
FIN FUNCIÓN

FUNCIÓN primerMultiploDeSieteRecursivo(actual, limite)
  SI actual > limite ENTONCES RETORNAR NULO

  SI actual MOD 7 ES IGUAL A 0 ENTONCES
    RETORNAR actual
  FIN SI

  RETORNAR primerMultiploDeSieteRecursivo(actual + 1, limite)
FIN FUNCIÓN

MOSTRAR primerMultiploDeSieteIterativo(10)       // → 7
MOSTRAR primerMultiploDeSieteRecursivo(1, 10)    // → 7
`;

  it("ambas versiones retornan 7", () => {
    const r = runPseudocode(source);
    expect(r.ok).toBe(true);
    expect(r.output).toEqual(["7", "7"]);
  });
});

describe("Fixture: Fase 4 — productos únicos y repeticiones", () => {
  const source = `
DEFINIR pedidos = ["Laptop", "Mouse", "Laptop", "Teclado", "Mouse", "Laptop"]

DEFINIR productosUnicos = CONJUNTO_VACIO
PARA CADA producto EN pedidos HACER
  AGREGAR producto A productosUnicos
FIN PARA
MOSTRAR productosUnicos   // → { "Laptop", "Mouse", "Teclado" }

DEFINIR conteo = {}
PARA CADA producto EN pedidos HACER
  SI producto EXISTE EN conteo ENTONCES
    ASIGNAR conteo[producto] = conteo[producto] + 1
  SI NO
    ASIGNAR conteo[producto] = 1
  FIN SI
FIN PARA
MOSTRAR conteo   // → { "Laptop": 3, "Mouse": 2, "Teclado": 1 }
`;

  it("Set sin duplicados y conteo por Tabla Hash", () => {
    const r = runPseudocode(source);
    expect(r.ok).toBe(true);
    expect(r.output).toEqual(['{ "Laptop", "Mouse", "Teclado" }', '{ "Laptop": 3, "Mouse": 2, "Teclado": 1 }']);
  });
});

describe("Fixture: Fase 5 — un mismo problema, cuatro enfoques", () => {
  const source = `
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
`;
  // Nota: las líneas "LLAMAR contador()   // → 1/2" describen el valor de retorno de esa
  // llamada, no algo impreso con MOSTRAR — por eso no aparecen en r.output. Se valida el
  // comportamiento real del closure por separado con MOSTRAR explícito.

  it("función pura, closure con estado privado, clase y pipeline funcional", () => {
    const r = runPseudocode(source);
    expect(r.ok).toBe(true);
    expect(r.output).toEqual(["85", "850", "871.25"]);
  });

  it("el closure realmente incrementa su contador privado en cada llamada", () => {
    // Variante mínima del mismo patrón de closure, solo para verificar el valor de retorno real
    // (el fixture completo de arriba no lo imprime, ya que usa LLAMAR sin MOSTRAR).
    const check = runPseudocode(`
FUNCIÓN crearContadorDeDescuentos()
  DEFINIR usos = 0
  RETORNAR FUNCIÓN registrarUso()
    MODIFICAR usos = usos + 1
    RETORNAR usos
  FIN FUNCIÓN
FIN FUNCIÓN
DEFINIR contador = crearContadorDeDescuentos()
MOSTRAR contador()
MOSTRAR contador()
`);
    expect(check.output).toEqual(["1", "2"]);
  });
});

describe("Fixture: Fase 6 — depurar, corregir y probar", () => {
  const source = `
FUNCIÓN dividirLista(lista, divisor)
  INTENTAR
    SI divisor ES IGUAL A 0 ENTONCES
      LANZAR ERROR "No se puede dividir entre cero"
    FIN SI

    DEFINIR resultados = []
    PARA CADA numero EN lista HACER
      AGREGAR_AL_FINAL resultados (numero ÷ divisor)
    FIN PARA
    RETORNAR resultados

  CAPTURAR error EN
    MOSTRAR "Error capturado: " + error.mensaje
    RETORNAR NULO
  FIN INTENTAR
FIN FUNCIÓN

PRUEBA "camino feliz: dividir [10, 20, 30] entre 2"
  DEFINIR resultado = dividirLista([10, 20, 30], 2)
  VERIFICAR QUE resultado ES IGUAL A [5, 10, 15]
FIN PRUEBA

PRUEBA "edge case: dividir entre 0 no debe colapsar el programa"
  DEFINIR resultado = dividirLista([10, 20, 30], 0)
  VERIFICAR QUE resultado ES IGUAL A NULO
FIN PRUEBA
`;

  it("ambos test cases (camino feliz y edge case) pasan", () => {
    const r = runPseudocode(source);
    expect(r.ok).toBe(true);
    expect(r.tests.map((t) => t.passed)).toEqual([true, true]);
    expect(r.output).toEqual(["Error capturado: No se puede dividir entre cero"]);
  });
});
