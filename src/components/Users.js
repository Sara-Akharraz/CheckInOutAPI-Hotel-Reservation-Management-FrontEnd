import React,{ useState, useEffect } from "react";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { UsersList } from "./usersList";
import '../styles/content.css';
import '../styles/users.css'
import AdminBasePage from "./adminBasePage";
import { faUser, faBell, faPlus , faUsers , faBed , faSignOut , faHouse, faSquareH, faList, faDoorOpen, faDoorClosed , faBellConcierge, faListNumeric } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FilterSection } from "./filterSection";


const Users = () => {

    document.body.style = "background-color: #131313;";
    const { hasRole } = useAuth();

  const [filters, setFilters] = useState({
    nom: '',
    prenom: '',
    cin: '',
    role: ''
  });
 
    const navigate=useNavigate();
    
    if (!hasRole('admin')) {
        navigate("/unauthorized");
    }
  
    return (
        <>
        <AdminBasePage className="base"/>
        <div className="content">
          <div className="head">
        <h2>
        <FontAwesomeIcon icon={faUsers} style={{ fontSize: '24px', color: '#007bff' }} /> Liste des utilisateurs
        </h2>
        <div className="add-user" onClick={() => {navigate("/addUser")}}>
          <FontAwesomeIcon icon={faPlus}/>
        </div>
        </div>
        <FilterSection
            filters={filters} 
            setFilters={setFilters} 
        />
        
        <UsersList filters={filters} />
        </div>
        
        </>
    );
}
export default Users;
