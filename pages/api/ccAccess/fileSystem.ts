export const getBase64dataUrl = (response) => {
    const base64flag = `data:${response.headers["content-type"]};base64,`;
    //const base64flag = 'data:image/jpeg;base64,';
    const base64string = Buffer.from(response.data, "binary").toString("base64");
    return `${base64flag}${base64string}`;
};