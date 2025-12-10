import React, { useState, useRef, useEffect } from "react";

export function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={ref}>
      <div onClick={() => setOpen(!open)} className="dropdown-trigger">
        {trigger}
      </div>

      {open && <div className="dropdown-menu">{children}</div>}
    </div>
  );
}

export function DropdownItem({ onClick, children }) {
  return (
    <div onClick={onClick} className="dropdown-item">
      {children}
    </div>
  );
}
