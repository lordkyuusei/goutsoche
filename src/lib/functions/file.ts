type LiteFile = {
    name: string,
    type: string,
    lastModified: number,
    content: string | null,
};

const convertArrayBufferToString = (reader: FileReader) => {
    const arrayBuffer = (reader.result) as ArrayBuffer;
    const byteArray = new Uint8Array(arrayBuffer);
    return btoa(String.fromCharCode(...byteArray));
}

export const saveFileAsJSON = (file: File): Promise<LiteFile> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
        const content = typeof reader.result === 'string' ? reader.result : `data:${file.type};base64,${convertArrayBufferToString(reader)}`;
        console.log(content)
        const fileJson = {
            name: file.name,
            type: file.type,
            lastModified: file.lastModified,
            content: content,
        };
        resolve(fileJson);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file); // or use readAsText, readAsArrayBuffer based on your needs
});

export const loadFileFromJSON = (json: LiteFile): File | null => {
    if (!json.content) return null;

    const encodedString = json.content.split(',')[1];
    const byteString = atob(encodedString); // decode base64
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], json.name, {
        type: json.type,
        lastModified: json.lastModified
    });
}