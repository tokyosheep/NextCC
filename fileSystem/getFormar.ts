export const getFormat:(str:string)=>string = str =>{
    const n = str.lastIndexOf('.');
    const format = str.substr(n,str.length-1)
    console.log(format);
    return format;
}