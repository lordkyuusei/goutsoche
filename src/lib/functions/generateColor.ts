import computeContrastRatio from "./computeConstrastRatio";

const HEXACHARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

const generateColor = () => {
    const indexes = [...new Array(6)].map(() => Math.floor(Math.random() * HEXACHARS.length));

    const color = indexes.reduce((color: string, index: number) => `${color}${HEXACHARS[index]}`, '#');
    return color;
}

export const generateColors = (): { foreground: string, background: string } => {
    let contrast = 0;
    let firstColor: string = '';
    let secondColor: string = '';

    while (contrast <= 4.5) {
        firstColor = generateColor();
        secondColor = generateColor();

        contrast = computeContrastRatio(firstColor, secondColor);
    }

    return {
        foreground: firstColor,
        background: secondColor
    }
}

export default generateColor;