const HEXACHARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

const generateColor = () => {
    const indexes = [...new Array(6)].map(() => Math.floor(Math.random() * HEXACHARS.length));

    const color = indexes.reduce((color: string, index: number) => `${color}${HEXACHARS[index]}`, '#');
    return color;
}

export default generateColor;