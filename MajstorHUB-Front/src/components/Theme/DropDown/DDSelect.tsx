import classes from './DDSelect.module.css'

type PropsValues = {
    children: React.ReactNode;
}

function DropDown({ children } : PropsValues) {
  return (
    <div className={classes.selectDropdown}>
        {children}
    </div>
  );
}

export default DropDown;
