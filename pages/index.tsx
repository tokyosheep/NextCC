import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/app/hooks';
import { setLibraies } from '../redux/features/libraries/librarySlice';

import ElementList from '../components/elementList';

const fetcher = (url) => fetch(url).then((res) => res.json());

const elms = (data,func) => {
    if(data?.libraries){
        const librarieList = data.libraries.map(lib => {
            return (
              <li key={lib.id}>
                <button onClick={async () => {
                  const res = await fetch('../api/ccAccess/element', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: lib.id })
                  });
                  const elm = await res.json();
                  console.log(elm);
                  func({
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
    const libraries = useAppSelector(state => state.libraries);
    const dispatch = useAppDispatch();
    const librariesFromServer = data => dispatch(setLibraies(data));
    console.log(libraries);
    const [data, setData ] = useState();
    useEffect(()=>{
        (async()=>{
            const res = await fetcher('../api/ccAccess/index');
            console.log(res);
            setData(res);
        })();
    },[]);

    return(
        <div>
            {elms(data,librariesFromServer)}
            {<ElementList library={libraries.value} />}
        </div>
    )
}
export default Page;