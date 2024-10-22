const MAX_LENGTH = 12;
const MIN_LENGTH = 3;

const CONSONNANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];

export const generateName = () => {
    const letters = [CONSONNANTS, VOWELS];
    const nameLength = random(MAX_LENGTH - MIN_LENGTH, MIN_LENGTH);
    
    let previousLetterKind = -1;
    const name = [...new Array(nameLength)].map(_ => {
        const letterKind = previousLetterKind === 0 ? 1 : random(2);
        previousLetterKind = letterKind;

        const arraySize = letters[letterKind].length;
        const letter = letters[letterKind][random(arraySize)];
        return letter;
    })

    return name.with(0, name[0].toLocaleUpperCase()).join('');
}

const random = (max: number, min: number = 0) => Math.floor(Math.random() * max + min)