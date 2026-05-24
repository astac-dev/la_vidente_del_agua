import React from 'react';

const MenuButton = ({ onClick, children }) => {
  return (
    <button className="menu-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default MenuButton;