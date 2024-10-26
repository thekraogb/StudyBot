import { useState } from "react";
import "./userdropdown.css";
import logout from "../../assets/log-out.png";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../app/slices/auth/authslice";

const UserDropdown = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    dispatch(logOut());
    window.location.reload();
  };

  return (
    <div className="dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="dropdown-menu">
        <div className="user-info">
          <strong>{name},</strong>
          <br />
          {email}
        </div>
        <hr className="separator" />
        <div className="logout">
          <button
            className="logout-button"
            onClick={(e) => handleLogoutClick(e)}
          >
            <img src={logout} alt="Logout" style={{ width: 23, height: 23 }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
