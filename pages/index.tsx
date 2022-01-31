import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../redux/app/hooks';
import { setLibrary, branchColorOrImg } from '../redux/features/libraries/librarySlice';
import { setLibraries } from '../redux/features/libraries/librariesSlice';

import ElementList from '../components/elementList';

const fetcher = (url) => fetch(url).then((res) => res.json());

/*
branching before login or after login
if user has't logined , it requires login first
in case user already logined , it shows user's libraries
*/

const elms = (data,func) => {
    if(data?.libraries){
        const librarieList = data.libraries.map(lib => {
            return (
              <li key={lib.id}>
                <button onClick={async () => {
                  const res = await fetch('../api/ccAccess/element-represent', {
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
                    elements: elm.element.elements.map(e => ({ 
                      name: e.name, id: 
                      e.id, 
                      rendition: e.thumbnail.rendition,
                      representations: e.representations.map(present=>{
                        console.log(present['color#data'] === undefined);
                        return branchColorOrImg(present['color#data'] !== undefined,present);
                      })
                    }))
                  });

                }}>get representations</button>
                <span>{lib.name}</span>
              </li>
            );
          });
          return (
            <>
              <button onClick={() => { location.href = 'https://localhost:3000/api/ccAccess/logout'; }}>logout</button>
              <button >getLibraries</button>
              <ul>
                {librarieList}
              </ul>
              <Link href='./upload' passHref>
                <a>
                  <button>uoload</button>
                </a>
              </Link>
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
    const library = useAppSelector(state => state.library);
    const dispatch = useAppDispatch();
    const librariesFromServer = data => dispatch(setLibrary(data));
    console.log(library);
    const [data, setData ] = useState();
    useEffect(()=>{
        (async()=>{
            const res = await fetcher('../api/ccAccess/index');
            console.log(res);
            setData(res);
            const array = res?.libraries !== undefined ?
            res?.libraries.map(r => {
              return{
                id:r.id,
                name:r.name
              }
              }) : [];
            dispatch(setLibraries(array));
        })();
    },[]);

    return(
        <div>
            {elms(data,librariesFromServer)}
            {<ElementList library={library.value} />}
        </div>
    )
}
export default Page;