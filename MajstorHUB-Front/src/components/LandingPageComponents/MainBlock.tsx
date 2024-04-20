import classes from './MainBlock.module.css'

function MainBlock() {
    return (
        <div className={classes.divContainer}>
            <div className={`mainContainer ${classes.flexContainer}`}>
                <div>
                    <h1>Otključajte svet građevinskih mogućnosti</h1>
                    <h3>Pouzdajte se u našu platformu za brzo i efikasno rešavanje svih vaših građevinskih izazova.</h3>
                    <button className="mainButton">Pridružite Nam Se</button>
                </div>
            </div>
        </div>
    );
}

export default MainBlock;