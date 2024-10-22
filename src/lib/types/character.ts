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