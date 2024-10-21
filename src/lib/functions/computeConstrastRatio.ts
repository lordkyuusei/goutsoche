/**
 * from the source: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 * quote:
 *  the relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white
    Note 1: For the sRGB colorspace, the relative luminance of a color is defined as :
        L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:
            if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
            if GsRGB <= 0.03928 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
            if BsRGB <= 0.03928 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4
        
        and RsRGB, GsRGB, and BsRGB are defined as:
            RsRGB = R8bit/255
            GsRGB = G8bit/255
            BsRGB = B8bit/255
 */

const RELATIVE_LUMINANCE_THRESHOLD_CONST = 0.03928;
const computeColorIfBelowOrEqual = (xsRGB: number) => xsRGB / 12.92
const computeColorIfAbove = (xsRGB: number) => Math.pow(((xsRGB + 0.055) / 1.055), 2.4);

const convertHexaToDec = (hex: string) => {
    const conversionTable: { [x: string]: number } = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"
    ].reduce((acc, letter, index) => ({ ...acc, [letter]: index }), {})

    const hexValue = hex.toLocaleLowerCase();
    return hexValue.split('').reduce((acc: number, char: string, index: number) => {
        const exp = hexValue.length - index - 1;
        const matchingNumber = conversionTable[char];
        const value = acc + (matchingNumber * Math.pow(16, exp));
        return value
    }, 0);
}

const computeRelativeLuminance = (red: string, green: string, blue: string) => {
    const RsRGB = convertHexaToDec(red) / 255;
    const GsRGB = convertHexaToDec(green) / 255;
    const BsRGB = convertHexaToDec(blue) / 255;

    const R = RsRGB <= RELATIVE_LUMINANCE_THRESHOLD_CONST ? computeColorIfBelowOrEqual(RsRGB) : computeColorIfAbove(RsRGB);
    const G = GsRGB <= RELATIVE_LUMINANCE_THRESHOLD_CONST ? computeColorIfBelowOrEqual(GsRGB) : computeColorIfAbove(GsRGB);
    const B = BsRGB <= RELATIVE_LUMINANCE_THRESHOLD_CONST ? computeColorIfBelowOrEqual(BsRGB) : computeColorIfAbove(BsRGB);

    const relativeLuminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return relativeLuminance;
}

const computeContrastRatio = (lightColor: string, darkColor: string) => {
    const [lRed, lGreen, lBlue] = [
        `${lightColor[1]}${lightColor[2]}`,
        `${lightColor[3]}${lightColor[4]}`,
        `${lightColor[5]}${lightColor[6]}`,
    ];

    const [dRed, dGreen, dBlue] = [
        `${darkColor[1]}${darkColor[2]}`,
        `${darkColor[3]}${darkColor[4]}`,
        `${darkColor[5]}${darkColor[6]}`,
    ];

    const L1 = computeRelativeLuminance(lRed, lGreen, lBlue);
    const L2 = computeRelativeLuminance(dRed, dGreen, dBlue);

    return ((L1 + 0.05) / (L2 + 0.05));
}

export default computeContrastRatio;
