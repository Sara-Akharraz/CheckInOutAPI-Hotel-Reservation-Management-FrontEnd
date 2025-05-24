import React, { useState, useEffect } from 'react';
import '../styles/SideBar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import { RiCoinsFill, RiDoorOpenFill } from "react-icons/ri";
import { TfiKey } from "react-icons/tfi";
import { VscOutput } from "react-icons/vsc";
import { Link, useLocation ,useNavigate} from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SidebarNav = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(''); 
    const {user:authUser,logout}=useAuth();
    const navigate=useNavigate();
  useEffect(() => {
   
    if (!activeButton) {
      if (location.pathname.startsWith('/dashboard-recep')) setActiveButton('dashboard');
      else if (location.pathname.startsWith('/reservations')) setActiveButton('reservations');
      else if (location.pathname.startsWith('/reservationDetail')) setActiveButton('reservationDetail');
      else if (location.pathname.startsWith('/checkin')) setActiveButton('checkin');
      else if (location.pathname.startsWith('/checkOut')) setActiveButton('checkOut');
      else if (location.pathname.startsWith('/suivi-facture-recep')) setActiveButton('suiviFacture');
        else if (location.pathname.startsWith('../UserProfile')) setActiveButton('profile');
      // else if (location.pathname.startsWith('/logout')) setActiveButton('logout');
      else setActiveButton('');
    }
  }, [location.pathname, activeButton]);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <div className="sidebar">
      <nav className="menu">
        <Link to="/dashboard-recep">
          <button
            className={activeButton === 'dashboard' ? 'active' : ''}
            onClick={() => handleButtonClick('dashboard')}
          >
            <RxDashboard />
          </button>
        </Link>

        <Link to="/reservations">
          <button
            className={activeButton === 'reservations' ? 'active' : ''}
            onClick={() => handleButtonClick('reservations')}
          >
            <TfiKey />
          </button>
        </Link>

        <Link to="/reservationDetail/1">
          <button
            className={activeButton === 'reservationDetail' ? 'active' : ''}
            onClick={() => handleButtonClick('reservationDetail')}
          >
            <VscOutput />
          </button>
        </Link>

        <Link to="/checkin">
          <button
            className={activeButton === 'checkin' ? 'active' : ''}
            onClick={() => handleButtonClick('checkin')}
          >
            <RiDoorOpenFill />
          </button>
        </Link>
        <Link to="/checkOut">
          <button
            className={activeButton === 'checkOut' ? 'active' : ''}
            onClick={() => handleButtonClick('checkOut')}
          >
            <RiDoorOpenFill />
          </button>
        </Link>

        <Link to="/suivi-facture-recep">
          <button
            className={activeButton === 'suiviFacture' ? 'active' : ''}
            onClick={() => handleButtonClick('suiviFacture')}
          >
            <RiCoinsFill />
          </button>
        </Link>
      </nav>

      <div className="bottom-icons">
        <Link to="../UserProfile">
          <button
            className={activeButton === 'profile' ? 'active' : ''}
            onClick={() => handleButtonClick('profile')}
          >
            <FaUser />
          </button>
        </Link>
        <Link to="/login">
          <button
            className={`logout ${activeButton === 'logout' ? 'active' : ''}`}
             onClick={async () => {
                            try {
                              await logout(); 
                              navigate('../login');
                            } catch (error) {
                              console.error('Logout failed:', error);
                              toast.error("Déconnexion échoue, essayer une autre fois", {
                                              position: "top-center",
                                              autoClose: 5000,
                                              hideProgressBar: false,
                                              closeOnClick: true,
                                              pauseOnHover: true,
                                              draggable: true,
                                              theme: "light"
                                          });
                            }
                          }}
          >
            <FaSignOutAlt />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SidebarNav;
