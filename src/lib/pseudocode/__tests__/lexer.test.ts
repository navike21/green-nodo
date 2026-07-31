import { describe, expect, it } from "vitest";
import { tokenize } from "../lexer";
import { TokenType } from "../tokens";

function types(source: string): TokenType[] {
  return tokenize(source).map((t) => t.type);
}

describe("lexer", () => {
  it("tokeniza declaración simple", () => {
    expect(types('DEFINIR edad = 25')).toEqual([
      TokenType.DEFINIR,
      TokenType.IDENTIFIER,
      TokenType.EQUALS,
      TokenType.NUMBER,
      TokenType.EOF,
    ]);
  });

  it("reconoce operadores unicode × ÷ y comparaciones", () => {
    expect(types("precio × (descuento ÷ 100) >= 5")).toEqual([
      TokenType.IDENTIFIER,
      TokenType.TIMES,
      TokenType.LPAREN,
      TokenType.IDENTIFIER,
      TokenType.DIVIDE,
      TokenType.NUMBER,
      TokenType.RPAREN,
      TokenType.GTE,
      TokenType.NUMBER,
      TokenType.EOF,
    ]);
  });

  it("distingue SI en una sola línea de un bloque vía número de línea", () => {
    const tokens = tokenize("SI n < 1 ENTONCES RETORNAR NULO");
    const entonces = tokens.find((t) => t.type === TokenType.ENTONCES)!;
    const retornar = tokens.find((t) => t.type === TokenType.RETORNAR)!;
    expect(entonces.line).toBe(retornar.line);
  });

  it("detecta bloque SI en líneas distintas", () => {
    const tokens = tokenize("SI actual > limite ENTONCES\n  RETORNAR NULO\nFIN SI");
    const entonces = tokens.find((t) => t.type === TokenType.ENTONCES)!;
    const retornar = tokens.find((t) => t.type === TokenType.RETORNAR)!;
    expect(entonces.line).not.toBe(retornar.line);
  });

  it("ignora comentarios de línea", () => {
    expect(types('MOSTRAR 1 // esto es un comentario\nMOSTRAR 2')).toEqual([
      TokenType.MOSTRAR,
      TokenType.NUMBER,
      TokenType.MOSTRAR,
      TokenType.NUMBER,
      TokenType.EOF,
    ]);
  });

  it("tokeniza strings con espacios y signos", () => {
    const tokens = tokenize('MOSTRAR "Hola, mundo!"');
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].value).toBe("Hola, mundo!");
  });

  it("reconoce identificadores con eñes y tildes", () => {
    const tokens = tokenize("DEFINIR tamaño = 1");
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[1].value).toBe("tamaño");
  });

  it("reconoce palabras clave compuestas por partes (FIN, SI, SEGÚN, POR, DEFECTO)", () => {
    expect(types("FIN SI")).toEqual([TokenType.FIN, TokenType.SI, TokenType.EOF]);
    expect(types("SEGÚN x HACER")).toEqual([
      TokenType.SEGUN,
      TokenType.IDENTIFIER,
      TokenType.HACER,
      TokenType.EOF,
    ]);
    expect(types("POR DEFECTO")).toEqual([TokenType.POR, TokenType.DEFECTO, TokenType.EOF]);
  });

  it("reconoce el operador ternario ? :", () => {
    expect(types('(edad >= 18) ? "si" : "no"')).toEqual([
      TokenType.LPAREN,
      TokenType.IDENTIFIER,
      TokenType.GTE,
      TokenType.NUMBER,
      TokenType.RPAREN,
      TokenType.QUESTION,
      TokenType.STRING,
      TokenType.COLON,
      TokenType.STRING,
      TokenType.EOF,
    ]);
  });

  it("distingue el pipe → de la lambda =>", () => {
    expect(types("productos → FILTRAR(x)")).toEqual([
      TokenType.IDENTIFIER,
      TokenType.PIPE,
      TokenType.FILTRAR,
      TokenType.LPAREN,
      TokenType.IDENTIFIER,
      TokenType.RPAREN,
      TokenType.EOF,
    ]);
    expect(types("x => x + 1")).toEqual([
      TokenType.IDENTIFIER,
      TokenType.FATARROW,
      TokenType.IDENTIFIER,
      TokenType.PLUS,
      TokenType.NUMBER,
      TokenType.EOF,
    ]);
  });

  it("lanza PseudocodeError con línea/columna en un string sin cerrar", () => {
    expect(() => tokenize('MOSTRAR "sin cerrar')).toThrowError(/comilla/i);
  });
});
