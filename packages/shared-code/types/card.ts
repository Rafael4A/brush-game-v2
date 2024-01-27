type CodeValue = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "Q" | "J" | "K";
type CodeSuit = "S" | "C" | "D" | "H";
export type CardCode = `${CodeValue}${CodeSuit}`;
