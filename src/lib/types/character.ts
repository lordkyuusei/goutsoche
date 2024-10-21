import generateColor from "$lib/functions/generateColor"

export type Character = {
    name: string,
    foreground: string,
    background: string,
    lines: Line[]
}

export type Line = {
    name: string,
    start: string,
    end: string,
    speech: string,
    htmlElement?: HTMLLIElement
}

export const createNewLine = () => ({
    name: crypto.randomUUID(),
    start: '',
    speech: '',
    end: '',
})

export const createNewCharacter = () => ({
    name: crypto.randomUUID().split('-')[Math.floor(Math.random() * 4)],
    foreground: generateColor(),
    background: generateColor(),
    lines: [createNewLine()]
})
