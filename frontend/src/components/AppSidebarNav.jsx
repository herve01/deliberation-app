import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const AppSidebarNav = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          end
          className={({ isActive }) =>
            `nav-item d-flex align-items-center ${isActive ? "active" : ""}`}>
           <i className={item.icon}></i>
           <span>{item.name}</span>
        </NavLink>
      ))}
    </>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.array.isRequired,
};

export default AppSidebarNav;