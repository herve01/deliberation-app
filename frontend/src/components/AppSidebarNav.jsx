import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const AppSidebarNav = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <NavItem key={item.name || index} item={item} />
      ))}
    </>
  );
};

const NavItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  // Gestion divider
  if (item.divider) {
    return <hr className="sidebar-divider my-1" />;
  }

  // Cas avec sous-menu
  if (item.children && item.children.length > 0) {
    return (
      <div className="nav-group">
        <button
          type="button"
          className="nav-item d-flex align-items-center justify-content-between w-100 border-0 bg-transparent"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="d-flex align-items-center">
            {item.icon && <i className={item.icon}></i>}
            <span className="ms-2">{item.name}</span>
          </div>
          <i
            className={`bi ${
              open ? "bi-chevron-down" : "bi-chevron-right"
            }`}
          ></i>
        </button>

        {open && (
          <div className="nav-group-items ms-3">
            {item.children.map((child, idx) => (
              <NavLink
                key={child.name || idx}
                to={child.to || "#"}
                className={({ isActive }) =>
                  `nav-item d-flex align-items-center ${
                    isActive ? "active fw-bold" : ""
                  }`
                }
              >
                {child.icon && <i className={child.icon}></i>}
                <span className="ms-2">{child.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Cas simple
  return (
    <NavLink
      to={item.to || "#"}
      end
      className={({ isActive }) =>
        `nav-item d-flex align-items-center ${
          isActive ? "active fw-bold" : ""
        }`
      }
    >
      {item.icon && <i className={item.icon}></i>}
      <span className="ms-2">{item.name}</span>
    </NavLink>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

NavItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    to: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.array,
    divider: PropTypes.bool,
  }).isRequired,
};

export default AppSidebarNav;