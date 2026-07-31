import { ErrorCode, PseudocodeError } from "./errors";
import { KEYWORDS, type Token, TokenType } from "./tokens";

const IDENTIFIER_START = /[A-Za-zÀ-ÖØ-öø-ÿÑñ_]/;
const IDENTIFIER_PART = /[A-Za-z0-9À-ÖØ-öø-ÿÑñ_]/;
const DIGIT = /[0-9]/;

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let column = 1;

  function peek(offset = 0): string {
    return source[pos + offset] ?? "";
  }

  function advance(): string {
    const ch = source[pos];
    pos += 1;
    if (ch === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
    return ch;
  }

  function push(type: TokenType, value: string, startLine: number, startColumn: number) {
    tokens.push({ type, value, line: startLine, column: startColumn });
  }

  while (pos < source.length) {
    const ch = peek();

    // Espacios (las líneas nuevas importan para desambiguar SI en una línea vs bloque,
    // pero no se emiten como token: cada token ya lleva su propia línea).
    if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
      advance();
      continue;
    }

    // Comentarios de línea
    if (ch === "/" && peek(1) === "/") {
      while (pos < source.length && peek() !== "\n") advance();
      continue;
    }

    const startLine = line;
    const startColumn = column;

    // Números
    if (DIGIT.test(ch)) {
      let value = "";
      while (DIGIT.test(peek())) value += advance();
      if (peek() === "." && DIGIT.test(peek(1))) {
        value += advance();
        while (DIGIT.test(peek())) value += advance();
      }
      push(TokenType.NUMBER, value, startLine, startColumn);
      continue;
    }

    // Strings
    if (ch === '"') {
      advance();
      let value = "";
      while (pos < source.length && peek() !== '"') {
        if (peek() === "\\" && peek(1) === '"') {
          value += '"';
          advance();
          advance();
        } else {
          value += advance();
        }
      }
      if (peek() !== '"') {
        throw new PseudocodeError(
          ErrorCode.SYNTAX_ERROR,
          "Falta la comilla de cierre (\") de un texto.",
          startLine,
          startColumn,
        );
      }
      advance(); // comilla de cierre
      push(TokenType.STRING, value, startLine, startColumn);
      continue;
    }

    // Identificadores / palabras clave
    if (IDENTIFIER_START.test(ch)) {
      let value = "";
      while (pos < source.length && IDENTIFIER_PART.test(peek())) value += advance();
      const keyword = KEYWORDS[value];
      push(keyword ?? TokenType.IDENTIFIER, value, startLine, startColumn);
      continue;
    }

    // Operadores de dos caracteres
    if (ch === "<" && peek(1) === "=") {
      advance();
      advance();
      push(TokenType.LTE, "<=", startLine, startColumn);
      continue;
    }
    if (ch === ">" && peek(1) === "=") {
      advance();
      advance();
      push(TokenType.GTE, ">=", startLine, startColumn);
      continue;
    }
    if (ch === "=" && peek(1) === ">") {
      advance();
      advance();
      push(TokenType.FATARROW, "=>", startLine, startColumn);
      continue;
    }

    // Operadores/puntuación de un caracter
    const single: Partial<Record<string, TokenType>> = {
      "+": TokenType.PLUS,
      "-": TokenType.MINUS,
      "×": TokenType.TIMES,
      "÷": TokenType.DIVIDE,
      "<": TokenType.LT,
      ">": TokenType.GT,
      "=": TokenType.EQUALS,
      "(": TokenType.LPAREN,
      ")": TokenType.RPAREN,
      "[": TokenType.LBRACKET,
      "]": TokenType.RBRACKET,
      "{": TokenType.LBRACE,
      "}": TokenType.RBRACE,
      ",": TokenType.COMMA,
      ".": TokenType.DOT,
      ":": TokenType.COLON,
      "?": TokenType.QUESTION,
      "→": TokenType.PIPE,
    };
    const tokenType = single[ch];
    if (tokenType) {
      advance();
      push(tokenType, ch, startLine, startColumn);
      continue;
    }

    throw new PseudocodeError(
      ErrorCode.SYNTAX_ERROR,
      `Carácter inesperado: "${ch}".`,
      startLine,
      startColumn,
    );
  }

  push(TokenType.EOF, "", line, column);
  return tokens;
}
