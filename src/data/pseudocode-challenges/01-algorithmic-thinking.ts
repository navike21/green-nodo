import type { PseudocodeChallenge } from "./types";

export const challenge: PseudocodeChallenge = {
  topicId: "programming-fundamentals/algorithmic-thinking/proyecto-integrador",
  referenceSource: `
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
`,
  scriptCases: [
    {
      description: "mayor de edad con invitación",
      inputs: [20, true, false],
      expectedOutput: ["Acceso permitido"],
    },
    {
      description: "mayor de edad sin invitación ni staff",
      inputs: [20, false, false],
      expectedOutput: ["Acceso denegado"],
    },
    {
      description: "menor de edad con invitación (AND debe fallar aunque tenga invitación)",
      inputs: [15, true, false],
      expectedOutput: ["Acceso denegado"],
    },
    {
      description: "staff sin invitación también entra (OR)",
      inputs: [30, false, true],
      expectedOutput: ["Acceso permitido"],
    },
    {
      description: "edad inválida corta con guard clause antes de evaluar la regla",
      inputs: [0, true, true],
      expectedOutput: ["Error: edad inválida"],
    },
  ],
};
