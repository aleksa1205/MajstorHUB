import classes from './Error.module.css'
import image from '../../../pictures/forbidden.png';
import { Link } from 'react-router-dom';

export default function Forbidden() {
    return (
        <main className={classes.main}>
            <img src={image} alt="forbiden" />
            <h2>Će uđeš malo mac</h2>
            <p>Zabranjen vam je pristup ovoj stranici</p>
            <Link to='/' className='mainButtonSmall'>Nazad na početnu</Link>
        </main>
    )
}