import { LibraryProps, ElementProps, Representation, RepresetationColor } from '../redux/features/libraries/librarySlice';
import { FC } from 'react';
import { getFormat } from '../fileSystem/getFormar';

import { ColorBox } from './parts/colorBox';

/*
accessing and exporting representations 
each element has representations as a array Object because,
some element like XD component has three types of representations (.png .svg .agc)
*/
const writeFiles:(elm:ElementProps)=>Promise<void> = async elm =>{
    const r = await Promise.allSettled(elm.representations.map(async (representation) => {
        const res = await fetch('../api/ccAccess/get-libraries-file',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: representation.storage_href, name:elm.name + getFormat(representation.representName)})
        });
        const data = await res.json();
        console.log(data);
        return data;
    }));
    console.log(r);
}

/*
// this doesn't work I just followed sample code but it didn't
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
*/

/*
    branching to color data or image data
    color data displays color
    images can be download to local
*/

const ElementCompo:FC<{elm}> = ({elm}) =>{
    const imgTypes = elm.representations.map((r,i:number) => {
        if(r.isColor){
            return (<li key={i}>
                        <ul>
                            {Object.entries(r.data.value).map(([key,value])=> <li key={key}>{key} :{value}</li>)}
                            {r.data.mode === 'RGB' ? <li><ColorBox width={50} height={50} color={r.data.value}></ColorBox></li> : ''}
                        </ul>
                    </li>)
        }else{
            return <li key={i}>{r.type}</li>
        }
    })
    return(
        <ul style={{marginBottom:'10px'}}>
            <li>
                {elm.name}
            </li>
            <li>
                <span>image types</span>
                <ul>
                    {imgTypes}
                </ul>
            </li>
            <li>
                {
                    elm.representations[0].data === undefined 
                    ?
                        <button onClick={async () => await writeFiles(elm)} >download file</button>
                    :
                        ''
                }
            </li>
        </ul>
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