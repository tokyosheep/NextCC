import Link from 'next/link';

const Failed = () =>{
    return(
        <div>
            <h1>you failed to login</h1>
            <Link href='./index'>
                <button>back to index</button>
            </Link>
        </div>
    )
}

export default Failed;