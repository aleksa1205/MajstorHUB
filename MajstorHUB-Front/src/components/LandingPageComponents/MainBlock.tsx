import { Link } from 'react-router-dom';
import classes from './MainBlock.module.css'

function MainBlock() {
    return (
        <div className={`container ${classes.divContainer}`}>
            <div>
                <div>
                    <h1>Otključajte svet građevinskih mogućnosti</h1>
                    <p>Pouzdajte se u našu platformu za brzo i efikasno rešavanje svih vaših građevinskih izazova.</p>
                    <Link to='register' className="mainButton">Pridružite Nam Se</Link>
                </div>
            </div>
            <img src="../../../pictures/3_construction_workers.png" alt="3_contruction_workers" />
        </div>
    );
}

export default MainBlock;