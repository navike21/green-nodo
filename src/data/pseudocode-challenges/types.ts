// Datos de calificación por proyecto integrador — viven fuera de src/lib/pseudocode
// (el core del intérprete) a propósito: son específicos de este sitio/curso, no del
// lenguaje de pseudocódigo en sí.

export interface ScriptCase {
  description: string;
  inputs: unknown[];
  expectedOutput: string[];
}

export interface PseudocodeChallenge {
  topicId: string;
  // El código de la solución de referencia, tal como aparece en el bloque
  // <details><summary>Ver solución paso a paso</summary> del proyecto-integrador.md.
  referenceSource: string;
  // Bloques PRUEBA ocultos (no visibles para el estudiante) que se ejecutan
  // concatenados después del código enviado, para proyectos que definen una
  // función/clase reutilizable.
  hiddenTestSource?: string;
  // Para proyectos tipo guion (RECIBIR/MOSTRAR, sin una función aislada que
  // llamar): casos de entrada/salida completos que se corren contra el programa
  // entero en vez de contra una función puntual.
  scriptCases?: ScriptCase[];
  // Una solución válida pero con un estilo distinto al de la respuesta modelo
  // (ej. MIENTRAS en vez de PARA), para confirmar que el calificador no quedó
  // implícitamente amoldado a la forma exacta de la solución de referencia.
  alternateStyleSource?: string;
}
