import React from "react";
import "./Button.css";

const Button = ({ className, buttonText, onClick  }) => {
  return (
    <button className={className} onClick={onClick}>
      {buttonText}
    </button>
  );
};

export default Button;
