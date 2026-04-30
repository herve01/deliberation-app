import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 secondes

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.toast, ...styles[type] }}>
        {message}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
  },
  toast: {
    padding: "12px 20px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  success: {
    backgroundColor: "#28a745",
  },
  error: {
    backgroundColor: "#dc3545",
  },
  info: {
    backgroundColor: "#007bff",
  },
};