import type { Character, Line } from "$lib/types/character"
import generateColor, { generateColors } from "./generateColor"
import { generateName } from "./generateName";

export const createNewLine = (): Line => ({
    name: crypto.randomUUID(),
    start: '',
    speech: '',
    end: '',
});

export const createNewCharacter = (): Character => ({
    name: generateName(),
    ...generateColors(),
    lines: [createNewLine()]
});
