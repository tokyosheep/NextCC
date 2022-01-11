import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

const elms = data => {
    if(data?.libraries){
        const librarieList = data.libraries.map(lib => {
            return (
              <li key={lib.id}>
                <button onClick={async () => {
                  const res = await fetch('https://localhost:3000/element', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: lib.id })
                  });
                  const elm = await res.json();
                  console.log(elm);
                  console.log(elm.element.elements);
                  setLibrary({
                    name: lib.name,
                    id: lib.id,
                    elements: elm.element.elements.map(e => ({ name: e.name, id: e.id, rendition: e.thumbnail.rendition }))
                  });
                }}>{lib.name}</button>
              </li>
            );
          });
          return (
            <>
              <button >getLibraries</button>
              <ul>
                {librarieList}
              </ul>
            </>
          );
    }else{
        return (
            <button onClick={() => { location.href = 'https://localhost:3000/api/ccAccess/login'; }}>
            login
            </button>
        );
    }
}

const Page = () =>{
    const router = useRouter();
    const [data, setData ] = useState();
    console.log(router.query.id);
    useEffect(()=>{
        (async()=>{
            const res = await fetcher('../api/ccAccess/index');
            console.log(res);
            setData(res);
        })();
    },[]);

    return(
        <div>
            {elms(data)}
        </div>
    )
}
export default Page;