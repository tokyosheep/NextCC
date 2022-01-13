import { LibraryProps } from '../redux/features/libraries/librarySlice';
import { FC } from 'react';

const ElementList:FC<{library:LibraryProps}> = ({library}) =>{
    const elementList = library.elements.map((elm)=>{
        return (
            <li key={elm.id}>
                {elm.name}
            </li>
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