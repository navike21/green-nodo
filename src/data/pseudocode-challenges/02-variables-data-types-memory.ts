import type { PseudocodeChallenge } from "./types";

export const challenge: PseudocodeChallenge = {
  topicId: "programming-fundamentals/variables-data-types-memory/proyecto-integrador",
  referenceSource: `
FUNCIÓN calcularPrecioConImpuesto(productoOriginal)
  DEFINIR precioNumero = CONVERTIR_A_NUMERO(productoOriginal.precioTexto)
  DEFINIR impuesto = precioNumero × 0.15

  RETORNAR precioNumero + impuesto
FIN FUNCIÓN

DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }

MOSTRAR calcularPrecioConImpuesto(producto)   // → 230
MOSTRAR producto.precioTexto                  // → "200" (el producto original NO cambió)
`,
  hiddenTestSource: `
PRUEBA "retorna el precio con 15% de impuesto agregado"
  DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }
  VERIFICAR QUE calcularPrecioConImpuesto(producto) ES IGUAL A 230
FIN PRUEBA

PRUEBA "convierte el texto a número antes de operar (Type Casting)"
  DEFINIR producto2 = { nombre: "Cable", precioTexto: "10" }
  VERIFICAR QUE calcularPrecioConImpuesto(producto2) ES IGUAL A 11.5
FIN PRUEBA

PRUEBA "no muta el objeto original (Tipos por Referencia)"
  DEFINIR original = { nombre: "Mouse", precioTexto: "50" }
  DEFINIR copia = COPIA_DE(original) CON {}
  LLAMAR calcularPrecioConImpuesto(original)
  VERIFICAR QUE original ES IGUAL A copia
FIN PRUEBA
`,
  // Estilo alternativo: usa MODIFICAR en vez de DEFINIR para la variable intermedia,
  // y ASIGNAR en vez de DEFINIR para armar el objeto de prueba — misma lógica, otra forma.
  alternateStyleSource: `
FUNCIÓN calcularPrecioConImpuesto(productoOriginal)
  DEFINIR precioNumero = CONVERTIR_A_NUMERO(productoOriginal.precioTexto)
  DEFINIR resultado = precioNumero
  MODIFICAR resultado = resultado + (precioNumero × 0.15)
  RETORNAR resultado
FIN FUNCIÓN

DEFINIR producto = { nombre: "Teclado", precioTexto: "200" }
MOSTRAR calcularPrecioConImpuesto(producto)
MOSTRAR producto.precioTexto
`,
};
