import Link from 'next/link';

const Success = () =>{
    return(
        <div>
            <h1>success!</h1>
            <Link href='/' passHref>
                <a>
                    <span>go index</span>
                </a>
            </Link>
        </div>
    )
}

export default Success;