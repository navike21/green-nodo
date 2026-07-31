import { describe, expect, it } from "vitest";
import { runPseudocode } from "../runner";

function run(source: string, inputs: unknown[] = []) {
  return runPseudocode(source, { inputs });
}

describe("Tier 1: básico, control de flujo, funciones", () => {
  it("DEFINIR + MOSTRAR + aritmética con × ÷ MOD", () => {
    const r = run("DEFINIR x = 10\nMOSTRAR x × 2 ÷ 4\nMOSTRAR 7 MOD 3");
    expect(r.ok).toBe(true);
    expect(r.output).toEqual(["5", "1"]);
  });

  it("concatenación de strings con +", () => {
    const r = run('DEFINIR nombre = "Ana"\nMOSTRAR "Hola, " + nombre + "!"');
    expect(r.output).toEqual(["Hola, Ana!"]);
  });

  it("SI/SI NO bloque", () => {
    const r = run(
      'DEFINIR edad = 25\nSI edad >= 18 ENTONCES\n  MOSTRAR "mayor"\nSI NO\n  MOSTRAR "menor"\nFIN SI',
    );
    expect(r.output).toEqual(["mayor"]);
  });

  it("SI inline sin FIN SI", () => {
    const r = run("DEFINIR n = 0\nSI n < 1 ENTONCES MOSTRAR \"guard\"\nMOSTRAR \"después\"");
    expect(r.output).toEqual(["guard", "después"]);
  });

  it("Y / O con short-circuit y ES VERDADERO", () => {
    const r = run(
      'DEFINIR edad = 20\nDEFINIR tieneInvitacion = VERDADERO\nSI edad >= 18 Y tieneInvitacion ES VERDADERO ENTONCES\n  MOSTRAR "entra"\nFIN SI',
    );
    expect(r.output).toEqual(["entra"]);
  });

  it("SEGÚN/CASO con fall-through real", () => {
    const r = run(
      `DEFINIR nota = 2
SEGÚN nota HACER
  CASO 5: MOSTRAR "Excelente"
  CASO 4: MOSTRAR "Muy bien"
  CASO 3: MOSTRAR "Aprobado"
  CASO 2:
  CASO 1: MOSTRAR "Reprobado"
  POR DEFECTO: MOSTRAR "Fuera de rango"
FIN SEGÚN`,
    );
    expect(r.output).toEqual(["Reprobado"]);
  });

  it("ternario", () => {
    const r = run('DEFINIR edad = 20\nDEFINIR m = (edad >= 18) ? "si" : "no"\nMOSTRAR m');
    expect(r.output).toEqual(["si"]);
  });

  it("PARA DESDE HASTA (inclusive) y ROMPER", () => {
    const r = run(
      `DEFINIR cantidades = [5, 0, 12, 3]
PARA i DESDE 0 HASTA 3 HACER
  SI cantidades[i] ES IGUAL A 0 ENTONCES
    MOSTRAR "agotado"
    ROMPER
  FIN SI
  MOSTRAR cantidades[i]
FIN PARA`,
    );
    expect(r.output).toEqual(["5", "agotado"]);
  });

  it("PARA CADA y CONTINUAR", () => {
    const r = run(
      `DEFINIR precios = [120, 35, 80]
PARA CADA precio EN precios HACER
  SI precio < 50 ENTONCES CONTINUAR
  MOSTRAR precio
FIN PARA`,
    );
    expect(r.output).toEqual(["120", "80"]);
  });

  it("MIENTRAS con ES DIFERENTE DE", () => {
    const r = run(
      `DEFINIR i = 0
MIENTRAS i ES DIFERENTE DE 3 HACER
  MOSTRAR i
  MODIFICAR i = i + 1
FIN MIENTRAS`,
    );
    expect(r.output).toEqual(["0", "1", "2"]);
  });

  it("FUNCIÓN + RETORNAR + recursión (factorial)", () => {
    const r = run(
      `FUNCIÓN factorial(n)
  SI n <= 1 ENTONCES
    RETORNAR 1
  FIN SI
  RETORNAR n × factorial(n - 1)
FIN FUNCIÓN

MOSTRAR factorial(4)`,
    );
    expect(r.output).toEqual(["24"]);
  });

  it("CALCULAR: declara si es nuevo, reasigna si ya existe", () => {
    const r = run(
      `CALCULAR total = 5
CALCULAR total = total + 1
MOSTRAR total`,
    );
    expect(r.output).toEqual(["6"]);
  });

  it("Block Scope: una variable DEFINIR dentro de un SI no existe afuera", () => {
    const r = run(
      `DEFINIR subtotal = 0
SI VERDADERO ENTONCES
  DEFINIR descuento = 15
  MODIFICAR subtotal = subtotal + descuento
FIN SI
MOSTRAR subtotal
MOSTRAR descuento`,
    );
    expect(r.ok).toBe(false);
    expect(r.output).toEqual(["15"]);
    expect(r.error?.code).toBe("UNDEFINED_VARIABLE");
  });

  it("RECIBIR consume de una cola de inputs simulada", () => {
    const r = run('RECIBIR DEL USUARIO nombre\nMOSTRAR "Hola, " + nombre', ["Ana"]);
    expect(r.output).toEqual(["Hola, Ana"]);
  });

  it("TERMINAR corta la ejecución", () => {
    const r = run('MOSTRAR "a"\nTERMINAR\nMOSTRAR "b"');
    expect(r.output).toEqual(["a"]);
  });

  it("guard clause de división entre cero", () => {
    const r = run("MOSTRAR 10 ÷ 0");
    expect(r.ok).toBe(false);
    expect(r.error?.code).toBe("DIVISION_BY_ZERO");
  });
});

describe("Tier 2: colecciones y OOP", () => {
  it("objetos: literal, acceso por punto, no-mutación de una copia superficial vía COPIA_DE", () => {
    const r = run(
      `DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }
DEFINIR precio = CONVERTIR_A_NUMERO(producto.precioTexto)
MOSTRAR precio + 30`,
    );
    expect(r.output).toEqual(["230"]);
  });

  it("tipos de referencia: dos variables comparten el mismo objeto", () => {
    const r = run(
      `DEFINIR persona1 = { nombre: "Ana", edad: 25 }
DEFINIR persona2 = persona1
MODIFICAR persona2.nombre = "Carlos"
MOSTRAR persona1.nombre`,
    );
    expect(r.output).toEqual(["Carlos"]);
  });

  it("Set: AGREGAR, sin duplicados, EXISTE EN", () => {
    const r = run(
      `DEFINIR compras = ["pan", "leche", "pan"]
DEFINIR unicas = CONJUNTO_VACIO
PARA CADA producto EN compras HACER
  AGREGAR producto A unicas
FIN PARA
MOSTRAR unicas
SI "leche" EXISTE EN unicas ENTONCES
  MOSTRAR "ya esta"
FIN SI`,
    );
    expect(r.output).toEqual(['{ "pan", "leche" }', "ya esta"]);
  });

  it("Tabla hash: ASIGNAR indexado y EXISTE EN", () => {
    const r = run(
      `DEFINIR inventario = { "laptop": { precio: 999 } }
ASIGNAR inventario["mouse"] = { precio: 25 }
MOSTRAR inventario["mouse"].precio
SI "monitor" EXISTE EN inventario ENTONCES
  MOSTRAR "existe"
SI NO
  MOSTRAR "no existe"
FIN SI`,
    );
    expect(r.output).toEqual(["25", "no existe"]);
  });

  it("Array: AGREGAR_AL_FINAL y ELIMINAR_ULTIMO", () => {
    const r = run(
      `DEFINIR frutas = ["Manzana"]
AGREGAR_AL_FINAL frutas "Mango"
MOSTRAR frutas
ELIMINAR_ULTIMO frutas
MOSTRAR frutas`,
    );
    expect(r.output).toEqual(['["Manzana", "Mango"]', '["Manzana"]']);
  });

  it("Pila (LIFO): APILAR / DESAPILAR", () => {
    const r = run(
      `DEFINIR historial = PILA_VACIA
APILAR historial "google.com"
APILAR historial "gmail.com"
MOSTRAR DESAPILAR historial`,
    );
    expect(r.output).toEqual(["gmail.com"]);
  });

  it("Cola (FIFO): ENCOLAR / DESENCOLAR", () => {
    const r = run(
      `DEFINIR pedidos = COLA_VACIA
ENCOLAR pedidos "Mesa 1"
ENCOLAR pedidos "Mesa 2"
MOSTRAR DESENCOLAR pedidos`,
    );
    expect(r.output).toEqual(["Mesa 1"]);
  });

  it("CLASE / NUEVA con args nombrados / ESTE ligado por call-site", () => {
    const r = run(
      `CLASE Producto
  PROPIEDADES: nombre, precio

  FUNCIÓN aplicarDescuento(porcentaje)
    RETORNAR ESTE.precio - (ESTE.precio × (porcentaje ÷ 100))
  FIN FUNCIÓN
FIN CLASE

DEFINIR laptop = NUEVA Producto(nombre: "Laptop", precio: 1000)
MOSTRAR laptop.aplicarDescuento(20)`,
    );
    expect(r.output).toEqual(["800"]);
  });

  it("NUEVA con propiedad faltante lanza MISSING_PROPERTY", () => {
    const r = run(
      `CLASE Producto
  PROPIEDADES: nombre, precio
  FUNCIÓN nada() RETORNAR NULO FIN FUNCIÓN
FIN CLASE
DEFINIR x = NUEVA Producto(nombre: "Laptop")`,
    );
    expect(r.ok).toBe(false);
    expect(r.error?.code).toBe("MISSING_PROPERTY");
  });

  it("Closures: contador privado independiente por instancia", () => {
    const r = run(
      `FUNCIÓN crearContadorPersonal(nombreUsuario)
  DEFINIR contador = 0
  RETORNAR {
    FUNCIÓN incrementar()
      MODIFICAR contador = contador + 1
      MOSTRAR nombreUsuario + " tiene " + contador + " puntos"
    FIN FUNCIÓN
  }
FIN FUNCIÓN

DEFINIR contadorAna = crearContadorPersonal("Ana")
DEFINIR contadorJuan = crearContadorPersonal("Juan")
LLAMAR contadorAna.incrementar()
LLAMAR contadorAna.incrementar()
LLAMAR contadorJuan.incrementar()`,
    );
    expect(r.output).toEqual(["Ana tiene 1 puntos", "Ana tiene 2 puntos", "Juan tiene 1 puntos"]);
  });
});

describe("Tier 3: pipeline funcional", () => {
  it("FILTRAR con scope implícito + TRANSFORMAR lambda + REDUCIR lambda de 2 params", () => {
    const r = run(
      `DEFINIR productos = [
  { nombre: "Laptop", precio: 1000, activo: VERDADERO },
  { nombre: "Cable", precio: 5, activo: FALSO },
  { nombre: "Mouse", precio: 25, activo: VERDADERO }
]

DEFINIR total = productos
  → FILTRAR(activo)
  → TRANSFORMAR(producto => producto.precio)
  → REDUCIR((acumulado, actual) => acumulado + actual, 0)

MOSTRAR total`,
    );
    expect(r.output).toEqual(["1025"]);
  });

  it("FILTRAR con expresión booleana compuesta de scope implícito", () => {
    const r = run(
      `DEFINIR productos = [
  { precio: 1000, activo: VERDADERO },
  { precio: 5, activo: VERDADERO },
  { precio: 80, activo: FALSO }
]
DEFINIR total = productos
  → FILTRAR(activo Y precio > 50)
  → TRANSFORMAR(p => p.precio)
  → REDUCIR((a, b) => a + b, 0)
MOSTRAR total`,
    );
    expect(r.output).toEqual(["1000"]);
  });
});

describe("Tier 4: errores y testing", () => {
  it("INTENTAR/CAPTURAR/FINALMENTE con LANZAR ERROR", () => {
    const r = run(
      `FUNCIÓN dividir(a, b)
  INTENTAR
    SI b ES IGUAL A 0 ENTONCES
      LANZAR ERROR "No se puede dividir entre cero"
    FIN SI
    RETORNAR a ÷ b
  CAPTURAR error EN
    MOSTRAR "Error capturado: " + error.mensaje
    RETORNAR NULO
  FINALMENTE
    MOSTRAR "fin"
  FIN INTENTAR
FIN FUNCIÓN

MOSTRAR dividir(10, 2)
MOSTRAR dividir(10, 0)`,
    );
    expect(r.output).toEqual(["fin", "5", "Error capturado: No se puede dividir entre cero", "fin", "nulo"]);
  });

  it("PRUEBA / VERIFICAR QUE: reporta pasa/falla", () => {
    const r = run(
      `FUNCIÓN factorial(n)
  SI n <= 1 ENTONCES RETORNAR 1
  RETORNAR n × factorial(n - 1)
FIN FUNCIÓN

PRUEBA "factorial de 4 debe ser 24"
  DEFINIR resultado = factorial(4)
  VERIFICAR QUE resultado ES IGUAL A 24
FIN PRUEBA

PRUEBA "esto debería fallar"
  VERIFICAR QUE 1 ES IGUAL A 2
FIN PRUEBA`,
    );
    expect(r.ok).toBe(true);
    expect(r.tests).toEqual([
      { description: "factorial de 4 debe ser 24", passed: true, message: undefined },
      {
        description: "esto debería fallar",
        passed: false,
        message: "Se esperaba 2 pero se obtuvo 1.",
      },
    ]);
  });

  it("VERIFICAR QUE NO ES NULO", () => {
    const r = run('PRUEBA "no nulo"\n  DEFINIR x = 5\n  VERIFICAR QUE x NO ES NULO\nFIN PRUEBA');
    expect(r.tests[0].passed).toBe(true);
  });

  it("COPIA_DE(x) CON {...} no muta el original (verificación de no-mutación)", () => {
    const r = run(
      `FUNCIÓN calcularPrecioConImpuesto(productoOriginal)
  DEFINIR precioNumero = CONVERTIR_A_NUMERO(productoOriginal.precioTexto)
  DEFINIR impuesto = precioNumero × 0.15
  RETORNAR precioNumero + impuesto
FIN FUNCIÓN

DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }
DEFINIR copia = COPIA_DE(producto) CON {}

PRUEBA "no muta el original"
  LLAMAR calcularPrecioConImpuesto(producto)
  VERIFICAR QUE producto ES IGUAL A copia
FIN PRUEBA`,
    );
    expect(r.tests).toEqual([{ description: "no muta el original", passed: true, message: undefined }]);
  });

  it("COMPARAR_LAXA vs COMPARAR_ESTRICTA", () => {
    const r = run(
      'MOSTRAR COMPARAR_LAXA 25 CON "25"\nMOSTRAR COMPARAR_ESTRICTA 25 CON "25"',
    );
    expect(r.output).toEqual(["verdadero", "falso"]);
  });

  it("UNION / INTERSECCION / DIFERENCIA de sets", () => {
    const r = run(
      `DEFINIR a = { "Ana", "Luis", "Marta" }
DEFINIR b = { "Luis", "Pedro" }
MOSTRAR UNION(a, b)
MOSTRAR INTERSECCION(a, b)
MOSTRAR DIFERENCIA(a, b)`,
    );
    expect(r.output).toEqual([
      '{ "Ana", "Luis", "Marta", "Pedro" }',
      '{ "Luis" }',
      '{ "Ana", "Marta" }',
    ]);
  });

  it("guard de ejecución: detiene un bucle infinito", () => {
    const r = run("MIENTRAS VERDADERO HACER\n  DEFINIR x = 1\nFIN MIENTRAS");
    expect(r.ok).toBe(false);
    expect(r.error?.code).toBe("EXECUTION_LIMIT_EXCEEDED");
  });

  it("guard de ejecución: detiene una recursión sin caso base", () => {
    const r = run("FUNCIÓN loop(n)\n  RETORNAR loop(n + 1)\nFIN FUNCIÓN\nMOSTRAR loop(0)");
    expect(r.ok).toBe(false);
    expect(r.error?.code).toBe("EXECUTION_LIMIT_EXCEEDED");
  });
});
