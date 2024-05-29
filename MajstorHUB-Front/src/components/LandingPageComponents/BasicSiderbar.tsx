import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import classes from './BasicSidebar.module.css';
import { SpringValue, animated } from "@react-spring/web";
import { useEffect, useState } from "react";

type PropsValue = {
  hideSidebar: () => void;
  style: any;
}

function BasicSidebar({ hideSidebar, style } : PropsValue) {
    const LogoutUser = useLogout();
    const { auth } = useAuth();
    const isLoggedIn = auth.userId !== '';

    useEffect(() => {
      const handleResize = () => {
        if(window.innerWidth >= 900)
          hideSidebar();
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      document.body.style.overflow = "hidden";
  
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

  return (
    <animated.nav style={style} className={`sidebar ${classes.nav}`}>
      <div>
        {isLoggedIn && (
            <Link to="/dashboard" onClick={hideSidebar} className="link sidebar-item">
              Dashboard
            </Link>
        )}
          <Link to="/register" onClick={hideSidebar} className="link sidebar-item">
            Pronađi Posao
          </Link>

          <Link to="/register" onClick={hideSidebar} className="link sidebar-item">
            Pronađi Izvodjače
          </Link>

          {!isLoggedIn ? 
              <Link className="link sidebar-item" onClick={hideSidebar} to="/login">
                  Uloguj se
              </Link> :
              <button className="link sidebar-item" onClick={() => {
                  hideSidebar();
                  LogoutUser();
              }}>
                  Izloguj se
              </button>
          }
      </div>
        
      <Link to="/register" onClick={hideSidebar} className="mainButton">
        Registruj se
      </Link>
    </animated.nav>
  );
}

export default BasicSidebar;
