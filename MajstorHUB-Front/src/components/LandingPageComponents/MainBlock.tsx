import classes from './MainBlock.module.css'

function MainBlock() {
    return (
        <div className={`container ${classes.divContainer}`}>
            <div>
                <div>
                    <h1>Otključajte svet građevinskih mogućnosti</h1>
                    <h3>Pouzdajte se u našu platformu za brzo i efikasno rešavanje svih vaših građevinskih izazova.</h3>
                    <button className="mainButton">Pridružite Nam Se</button>
                </div>
            </div>
            <img src="../../../pictures/3_construction_workers.png" alt="3_contruction_workers" />
        </div>
    );
}

export default MainBlock;