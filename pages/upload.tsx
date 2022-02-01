import { useState, useRef } from 'react';
import { useAppSelector } from '../redux/app/hooks';

/*
upload your image on CC server.
*/

const UploadCompo = () =>{
    const libraries = useAppSelector(state => state.libraries.value);
    console.log(libraries);
    const [selectedId, setSelectedId ] = useState<string>("");
    /*
        you have to use useRef keeping file data instead of useState(because of security reason)
    */
    const imgRef = useRef(null);
    const options = libraries.map((lib,i) => {
        return(
            <option key={lib.id} value={i} >{lib.name}</option>
        )
    });
    const selectOption = e => {
        console.log(e.target);
        const o = {...libraries[e.target.value]};
        setSelectedId(o.id);
    }
    console.log(selectedId);
    const handleValue = value => {
        const n = libraries.findIndex(f => f.id===value);
        return n === undefined ? 0 : n ; 
    }
    return (
        <form action='../api/ccAccess/upload' method='POST' encType='multipart/form-data'
            onSubmit={async (e)=>{
                /*
                    actually it pretends to submt
                    and then fetch to server side
                */
                e.preventDefault();
                const formdata = new FormData();
                formdata.append('file', imgRef.current.files[0]);
                formdata.append('id', selectedId);
                console.log(selectedId);
                console.log(imgRef.current.files[0]);
                if(imgRef.current.files[0]===undefined){
                    alert('select image file on input form');
                    return false;
                }
                /*
                    on browser side , it shows file pas as fakepath because of
                    security reason you can't see exact place of directory
                */
                const res = await fetch('../api/ccAccess/upload',{
                    method:'POST',
                    body: formdata
                })
                console.log(await res.text());
            }}  
        >
            <div>
                <h2>upload asset</h2>
                <select 
                    value={handleValue(selectedId)}
                    onChange={selectOption}
                >
                    {options}
                </select>
                <input 
                    id='file' 
                    name='asset' 
                    type='file' 
                    accept='image/jpeg, image:png'
                    ref={imgRef}
                />
                <button type='submit'>submit</button>
            </div>
        </form>
    )
}

export default UploadCompo;