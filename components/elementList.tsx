import { LibraryProps, ElementProps } from '../redux/features/libraries/librarySlice';
import { FC, useState } from 'react';
import Image from 'next/image';

const writeFiles:(elm:ElementProps)=>Promise<void> = async elm =>{
    const res = await fetch('../api/ccAccess/get-libraries-file',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: elm.cloudPath})
    });
    const data = await res.json();
    console.log(data);
}

const displayThumbnail:(elm:ElementProps,func:(v:null|string)=>void)=>Promise<void> = async (elm,func) => {
    const r = await fetch('../api/ccAccess/cc-libraries-images',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: elm.rendition})
    });
    const buff = await r.json();
    console.log(buff);
    if(buff==null||buff==='null')return;
    //func(data);
}

const ElementCompo:FC<{elm:ElementProps}> = ({elm}) =>{
    const [thumbnail, setThumbnail] = useState<null|string>(null);
    return(
        <li>
            {elm.name}
            <button onClick={async () => await writeFiles(elm)} >download file</button>
            {/*<button onClick={async () => await displayThumbnail(elm, setThumbnail)}>display image</button>*/}
            {thumbnail !== null ? <Image alt='thumb' width={200} height={200} src={thumbnail} /> : ''}
        </li>
    )
}

const ElementList:FC<{library:LibraryProps}> = ({library}) =>{
    const elementList = library.elements.map((elm)=>{
        return (
            <ElementCompo key={elm.id} elm={elm}></ElementCompo>
        )
    })
    return(
        <div>
            <h2>{library.name}</h2>
            <ul>
                {elementList}
            </ul>
        </div>
    )
}

export default ElementList;