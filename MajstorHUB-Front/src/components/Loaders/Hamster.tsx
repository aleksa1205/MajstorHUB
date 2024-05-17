import classes from './Hamster.module.css';

function Hamster() {
  return (
    <div
      aria-label="Orange and tan hamster running in a metal wheel"
      role="img"
      className={classes.wheelAndHamster}
    >
      <div className={classes.wheel}></div>
      <div className={classes.hamster}>
        <div className={classes.hamsterBody}>
          <div className={classes.hamsterHead}>
            <div className={classes.hamster__ear}></div>
            <div className={classes.hamster__eye}></div>
            <div className={classes.hamster__nose}></div>
          </div>
          <div className={`${classes.hamster__limb} ${classes.hamster__limb__fr}`}></div>
          <div className={`${classes.hamster__limb} ${classes.hamster__limb__fl}`}></div>
          <div className={`${classes.hamster__limb} ${classes.hamster__limb__br}`}></div>
          <div className={`${classes.hamster__limb} ${classes.hamster__limb__bl}`}></div>
          <div className={classes.hamster__tail}></div>
        </div>
      </div>
      <div className={classes.spoke}></div>
    </div>
  );
}

export default Hamster;
