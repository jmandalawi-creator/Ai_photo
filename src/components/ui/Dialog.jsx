// src/components/ui/Dialog.jsx
import React from "react";

export function Dialog({ children, ...props }) {
  return <div className="dialog">{children}</div>;
}

export function DialogContent({ children, ...props }) {
  return <div className="dialog-content">{children}</div>;
}

export function DialogHeader({ children, ...props }) {
  return <div className="dialog-header">{children}</div>;
}

export function DialogTitle({ children, ...props }) {
  return <h2 className="dialog-title">{children}</h2>;
}
