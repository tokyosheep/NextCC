import { useMemo } from 'react';
import Link from 'next/link';
import { useAppDispatch} from '../redux/app/hooks';
import { setLibrary } from '../redux/features/libraries/librarySlice';
import { setLibraries } from '../redux/features/libraries/librariesSlice';

/*
after logout account. you'll access here.
*/

const Logout = () =>{
    const dispatch = useAppDispatch();
    useMemo(() => {
        dispatch(setLibraries([]));
        dispatch(setLibrary({
            id: '',
            name: '',
            elements: []
        }));
    },[]);
    return(
        <div>
            <h1>logout</h1>
            <Link href='/' passHref >
                <a>
                    <button>index</button>
                </a>
            </Link>
        </div>
    )
}

export default Logout;