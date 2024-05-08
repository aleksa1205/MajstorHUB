import { Link } from "react-router-dom";
import { isLoggedIn } from "../../lib/utils";
import useLogout from "../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";

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
      {isLoggedIn() && (
        <div className="sidebar-item">
          <Link to="/dashboard" onClick={hideSidebar} className="link">
            Dashboard
          </Link>
        </div>
      )}
      <div className="sidebar-item">
        <Link to="/register" onClick={hideSidebar} className="link">
          Pronađi Posao
        </Link>
      </div>

      <div className="sidebar-item">
        <Link to="/register" onClick={hideSidebar} className="link">
          Pronađi Izvodjače
        </Link>
      </div>

      <div className="sidebar-item">
        {!isLoggedIn() ? 
            <Link className="link" onClick={hideSidebar} to="/login">
                Uloguj se
            </Link> :
            <button className="link" onClick={() => {
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
