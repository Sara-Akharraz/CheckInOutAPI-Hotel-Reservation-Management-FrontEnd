import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import '../styles/usersList.css'
import { faUser, faTrash, faPen , faBell, faUsers , faBed , faSignOut , faHouse, faSquareH, faList, faDoorOpen, faDoorClosed , faBellConcierge, faListNumeric } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditUser } from "./editUser"


export const UsersList = ({filters}) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 
              (error.response?.status === 403 
                ? 'You are not authorized to access this resource' 
                : 'Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]); 

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(`Le compte d'ID ${userId} a été supprimé avec succès!`, {
                          position: "bottom-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          theme: "light",
                          style: {
                            zIndex: 9999  
                          },
                      });
                      
      fetchUsers(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div className="loading-spinner">Loading users...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  const filteredUsers = users.filter(user => {
    const searchNom = String(filters.nom || '').toLowerCase();
    const searchPrenom = String(filters.prenom || '').toLowerCase();
    const searchCin = String(filters.cin || '');
    const searchRole = String(filters.role || '').toLowerCase();
    
    const userNom = String(user.nom || '').toLowerCase();
    const userPrenom = String(user.prenom || '').toLowerCase();
    const userCin = String(user.cin || '');
    const userRole = String(user.role || '').toLowerCase();

    const nomMatch = searchNom === '' || userNom.includes(searchNom);
    const prenomMatch = searchPrenom === '' || userPrenom.includes(searchPrenom);
    
    const cinMatch = searchCin === '' || userCin.includes(searchCin);
    const roleMatch = searchRole === '' || userRole === searchRole;

    return prenomMatch && nomMatch && cinMatch && roleMatch;
  });
  const getRoleClass = (role) => {
    switch(role) {
      case 'ADMIN': return 'role-badge role-admin';
      case 'CLIENT': return 'role-badge role-user';
      default: return 'role-badge role-other';
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleSaveSuccess = () => {
    setEditingUser(null);
    fetchUsers(); 
  };
  return (
    <div className="users-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CIN</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.cin}</td>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>
              <span className={getRoleClass(user.role)}>
  {user.role.toLowerCase()  
    .split(' ')             
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)  
    )
    .join(' ')}           
</span>
              </td>
              <td>
                <div className="action-buttons">
                <button 
                  className="edit-btn"
                  onClick={() => handleEditClick(user)}
                >
                    <FontAwesomeIcon 
  icon={faPen}
/>
                  </button>
                  <button 
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div className="modal-overlay">
          <EditUser
            user={editingUser}
            token={token}
            onSave={handleSaveSuccess}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}
    </div>
  );
};

export default UsersList;