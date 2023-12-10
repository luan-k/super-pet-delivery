"use client";
import React, { FC, useEffect, useState } from "react";

interface ActionAlertProps {
  alertText: string;
}

const ActionAlert: FC<ActionAlertProps> = ({ alertText }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={`wkode-action-alert ${isVisible ? "wk-visible" : "wk-hidden"}`}
      style={{ opacity: isVisible ? 1 : 0 }}>
      {alertText}
    </div>
  );
};

export default ActionAlert;
