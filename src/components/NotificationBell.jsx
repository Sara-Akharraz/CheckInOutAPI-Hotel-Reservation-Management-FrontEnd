import React, { useState, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "../styles/NotificationBell.css";

const NotificationBell = () => {
  const { userId } = useParams();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notification/${userId}`);
      const data = await response.json();
      if (data.length > notifications.length) {
        setNewNotification(true);
      }
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const toggleDropdown = () => {
    setOpen(!open);
    if (newNotification) {
      setNewNotification(false);
    }
    if (!open && userId) {
      fetchNotifications();
    }
  };

  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifs = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  return (
    <div className="notification-container">
      <div className="button-group">
        <button
          className="icon-btn notification-btn"
          onClick={toggleDropdown}
          aria-label="Notifications"
        >
          <FaBell className="icon" />
          {newNotification && <span className="notification-badge" />}
        </button>
     
      </div>

      {open && (
        <div className="notification-card">
          <div className="card-header">
            <h3 className="header-title">Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <ul className="notification-list">
            {currentNotifs.length === 0 ? (
              <li className="list-item empty">
                No new notifications
              </li>
            ) : (
              currentNotifs.map((notif, index) => (
                <li key={index} className="list-item">
                  <p className="message">{notif.message}</p>
                  {notif.timestamp && (
                    <small className="timestamp">
                      {new Date(notif.timestamp).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  )}
                </li>
              ))
            )}
          </ul>

          {totalPages > 1 && (
            <div className="card-footer">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">
                {currentPage}/{totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;