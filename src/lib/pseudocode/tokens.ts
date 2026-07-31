// Tabla de tokens del lenguaje de pseudocódigo enseñado en el curso.
// Cada palabra clave es un token independiente; las combinaciones de varias
// palabras (SEGÚN...CASO, FIN SI, PARA CADA, RECIBIR...DEL USUARIO, POR DEFECTO)
// se resuelven en el parser, no aquí — el lexer solo reconoce palabras sueltas.

export enum TokenType {
  // Literales
  NUMBER = "NUMBER",
  STRING = "STRING",
  IDENTIFIER = "IDENTIFIER",

  // Estructura de programa
  INICIO = "INICIO",
  FIN = "FIN",

  // Entrada/salida y variables
  RECIBIR = "RECIBIR",
  DEL = "DEL",
  USUARIO = "USUARIO",
  DEFINIR = "DEFINIR",
  ASIGNAR = "ASIGNAR",
  MODIFICAR = "MODIFICAR",
  CALCULAR = "CALCULAR",
  MOSTRAR = "MOSTRAR",
  TERMINAR = "TERMINAR",

  // Condicionales
  SI = "SI",
  ENTONCES = "ENTONCES",
  SEGUN = "SEGUN",
  CASO = "CASO",
  POR = "POR",
  DEFECTO = "DEFECTO",

  // Bucles
  PARA = "PARA",
  CADA = "CADA",
  EN = "EN",
  DESDE = "DESDE",
  HASTA = "HASTA",
  HACER = "HACER",
  MIENTRAS = "MIENTRAS",
  ROMPER = "ROMPER",
  CONTINUAR = "CONTINUAR",

  // Funciones
  FUNCION = "FUNCION",
  RETORNAR = "RETORNAR",
  LLAMAR = "LLAMAR",

  // Lógica / comparación en palabras
  Y = "Y",
  O = "O",
  NO = "NO",
  MOD = "MOD",
  ES = "ES",
  IGUAL = "IGUAL",
  DIFERENTE = "DIFERENTE",
  VERDADERO = "VERDADERO",
  FALSO = "FALSO",
  NULO = "NULO",
  A = "A",
  DE = "DE",

  // Builtins de conversión / comparación
  CONVERTIR_A_NUMERO = "CONVERTIR_A_NUMERO",
  COMPARAR_LAXA = "COMPARAR_LAXA",
  COMPARAR_ESTRICTA = "COMPARAR_ESTRICTA",
  CON = "CON",
  COPIA_DE = "COPIA_DE",

  // Colecciones
  CONJUNTO_VACIO = "CONJUNTO_VACIO",
  AGREGAR = "AGREGAR",
  AGREGAR_AL_FINAL = "AGREGAR_AL_FINAL",
  ELIMINAR_ULTIMO = "ELIMINAR_ULTIMO",
  TAMANO = "TAMANO",
  EXISTE = "EXISTE",
  UNION = "UNION",
  INTERSECCION = "INTERSECCION",
  DIFERENCIA = "DIFERENCIA",
  PILA_VACIA = "PILA_VACIA",
  APILAR = "APILAR",
  DESAPILAR = "DESAPILAR",
  COLA_VACIA = "COLA_VACIA",
  ENCOLAR = "ENCOLAR",
  DESENCOLAR = "DESENCOLAR",

  // OOP
  CLASE = "CLASE",
  PROPIEDADES = "PROPIEDADES",
  ESTE = "ESTE",
  NUEVA = "NUEVA",

  // Pipeline funcional
  FILTRAR = "FILTRAR",
  TRANSFORMAR = "TRANSFORMAR",
  REDUCIR = "REDUCIR",

  // Manejo de errores
  INTENTAR = "INTENTAR",
  CAPTURAR = "CAPTURAR",
  FINALMENTE = "FINALMENTE",
  LANZAR = "LANZAR",
  ERROR = "ERROR",

  // Testing
  PRUEBA = "PRUEBA",
  VERIFICAR = "VERIFICAR",
  QUE = "QUE",

  // Operadores y puntuación
  PLUS = "PLUS",
  MINUS = "MINUS",
  TIMES = "TIMES",
  DIVIDE = "DIVIDE",
  LT = "LT",
  GT = "GT",
  LTE = "LTE",
  GTE = "GTE",
  EQUALS = "EQUALS",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LBRACKET = "LBRACKET",
  RBRACKET = "RBRACKET",
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",
  COMMA = "COMMA",
  DOT = "DOT",
  COLON = "COLON",
  QUESTION = "QUESTION",
  PIPE = "PIPE", // →
  FATARROW = "FATARROW", // =>

  EOF = "EOF",
}

// Palabras clave reconocidas exactamente como aparecen en el corpus (mayúsculas, con sus tildes/eñes reales).
export const KEYWORDS: Record<string, TokenType> = {
  INICIO: TokenType.INICIO,
  FIN: TokenType.FIN,
  RECIBIR: TokenType.RECIBIR,
  DEL: TokenType.DEL,
  USUARIO: TokenType.USUARIO,
  DEFINIR: TokenType.DEFINIR,
  ASIGNAR: TokenType.ASIGNAR,
  MODIFICAR: TokenType.MODIFICAR,
  CALCULAR: TokenType.CALCULAR,
  MOSTRAR: TokenType.MOSTRAR,
  TERMINAR: TokenType.TERMINAR,
  SI: TokenType.SI,
  ENTONCES: TokenType.ENTONCES,
  SEGÚN: TokenType.SEGUN,
  CASO: TokenType.CASO,
  POR: TokenType.POR,
  DEFECTO: TokenType.DEFECTO,
  PARA: TokenType.PARA,
  CADA: TokenType.CADA,
  EN: TokenType.EN,
  DESDE: TokenType.DESDE,
  HASTA: TokenType.HASTA,
  HACER: TokenType.HACER,
  MIENTRAS: TokenType.MIENTRAS,
  ROMPER: TokenType.ROMPER,
  CONTINUAR: TokenType.CONTINUAR,
  FUNCIÓN: TokenType.FUNCION,
  RETORNAR: TokenType.RETORNAR,
  LLAMAR: TokenType.LLAMAR,
  Y: TokenType.Y,
  O: TokenType.O,
  NO: TokenType.NO,
  MOD: TokenType.MOD,
  ES: TokenType.ES,
  IGUAL: TokenType.IGUAL,
  DIFERENTE: TokenType.DIFERENTE,
  VERDADERO: TokenType.VERDADERO,
  FALSO: TokenType.FALSO,
  NULO: TokenType.NULO,
  A: TokenType.A,
  DE: TokenType.DE,
  CONVERTIR_A_NUMERO: TokenType.CONVERTIR_A_NUMERO,
  COMPARAR_LAXA: TokenType.COMPARAR_LAXA,
  COMPARAR_ESTRICTA: TokenType.COMPARAR_ESTRICTA,
  CON: TokenType.CON,
  COPIA_DE: TokenType.COPIA_DE,
  CONJUNTO_VACIO: TokenType.CONJUNTO_VACIO,
  AGREGAR: TokenType.AGREGAR,
  AGREGAR_AL_FINAL: TokenType.AGREGAR_AL_FINAL,
  ELIMINAR_ULTIMO: TokenType.ELIMINAR_ULTIMO,
  TAMAÑO: TokenType.TAMANO,
  EXISTE: TokenType.EXISTE,
  UNION: TokenType.UNION,
  INTERSECCION: TokenType.INTERSECCION,
  DIFERENCIA: TokenType.DIFERENCIA,
  PILA_VACIA: TokenType.PILA_VACIA,
  APILAR: TokenType.APILAR,
  DESAPILAR: TokenType.DESAPILAR,
  COLA_VACIA: TokenType.COLA_VACIA,
  ENCOLAR: TokenType.ENCOLAR,
  DESENCOLAR: TokenType.DESENCOLAR,
  CLASE: TokenType.CLASE,
  PROPIEDADES: TokenType.PROPIEDADES,
  ESTE: TokenType.ESTE,
  NUEVA: TokenType.NUEVA,
  FILTRAR: TokenType.FILTRAR,
  TRANSFORMAR: TokenType.TRANSFORMAR,
  REDUCIR: TokenType.REDUCIR,
  INTENTAR: TokenType.INTENTAR,
  CAPTURAR: TokenType.CAPTURAR,
  FINALMENTE: TokenType.FINALMENTE,
  LANZAR: TokenType.LANZAR,
  ERROR: TokenType.ERROR,
  PRUEBA: TokenType.PRUEBA,
  VERIFICAR: TokenType.VERIFICAR,
  QUE: TokenType.QUE,
};

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
