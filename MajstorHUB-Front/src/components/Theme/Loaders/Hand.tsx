import classes from "./Hand.module.css";

function Hand() {
  return (
    <div className={classes.main}>
      <div className={classes.finger}></div>
      <div className={classes.finger}></div>
      <div className={classes.finger}></div>
      <div className={classes.finger}></div>
      <div className={classes.dunno}></div>
      <div className={classes.thumb}></div>
    </div>
  );
}

export default Hand;
