import classes from './Tooltip.module.css'
import React, { useState } from "react";

type PropsValues = {
    infoText : string;
    children : React.ReactNode;
    width: string;
}

const Tooltip = ({ infoText, children, width } : PropsValues) => {
  // State to manage tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={classes.tooltipContainer}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}

      {/* Tooltip content */}
      <div style={{width: width}} className={`${classes.tooltip} ${showTooltip ? classes.open : ""}`}>
        {infoText}
        {/* Arrow indicator */}
        <div className={classes.arrow} />
      </div>
    </div>
  );
};

export default Tooltip;