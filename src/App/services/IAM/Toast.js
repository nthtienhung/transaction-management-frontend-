import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Toast = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!visible) return null;

    const toastStyles = {
        success: { backgroundColor: "#28a745", color: "#fff" },
        error: { backgroundColor: "#dc3545", color: "#fff" },
        warning: { backgroundColor: "#ffc107", color: "#212529" },
        info: { backgroundColor: "#17a2b8", color: "#fff" },
    };

    const toastContainerStyles = {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "200px",
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
    };

    return (
        <div
            style={{
                ...toastContainerStyles,
                ...toastStyles[type],
            }}
        >
            <p>{message}</p>
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error", "warning", "info"]),
    onClose: PropTypes.func.isRequired,
};

export default Toast;
