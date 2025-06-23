import React from "react";

type CardProps = {
  bgColor?: string;
  textColor?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: string;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = ({
  bgColor = "bg-white",
  textColor = "text-gray-800",
  title,
  subtitle,
  icon,
  footer,
  onClick,
}) => {
  return (
    <div
      className={`${bgColor} ${textColor} h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-center p-6">
        {icon && <div className="mb-4">{icon}</div>}
        <div className="font-medium">{title}</div>
        {subtitle && <div className="text-sm">{subtitle}</div>}
        {footer && <div className="text-sm text-gray-600 mt-2">{footer}</div>}
      </div>
    </div>
  );
};

export default Card;
