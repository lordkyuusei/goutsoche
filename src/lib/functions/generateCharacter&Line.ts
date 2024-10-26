import type { Character, Line } from "$lib/types/character"
import generateColor, { generateColors } from "./generateColor"
import { generateName } from "./generateName";

export const createNewLine = (): Line => ({
    name: crypto.randomUUID(),
    start: '00:00:00.000',
    speech: '',
    end: '00:00:03.000',
});

export const createNewCharacter = (): Character => ({
    name: generateName(),
    ...generateColors(),
    lines: [createNewLine()]
});
