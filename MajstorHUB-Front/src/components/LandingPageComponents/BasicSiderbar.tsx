import { Link } from "react-router-dom";
import { isLoggedIn } from "../../lib/utils";
import useLogout from "../../hooks/useLogout";

type PropsValue = {
    setShowSidebar : React.Dispatch<React.SetStateAction<boolean>>;
}

function BasicSidebar({ setShowSidebar } : PropsValue) {
    const LogoutUser = useLogout();

    function hideSidebar() {
        setShowSidebar(false);
    }

  return (
    <nav className="sidebar">
      <div>
        {isLoggedIn() && (
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

          {!isLoggedIn() ? 
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
    </nav>
  );
}

export default BasicSidebar;
