
import React from "react";

interface AdminTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "amber" | "green";
  onClick: () => void;
}

export const AdminTile = ({ title, description, icon, color, onClick }: AdminTileProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          border: "border-blue-200",
          iconBg: "bg-blue-100"
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          border: "border-purple-200",
          iconBg: "bg-purple-100"
        };
      case "amber":
        return {
          bg: "bg-amber-50 hover:bg-amber-100",
          border: "border-amber-200",
          iconBg: "bg-amber-100"
        };
      case "green":
        return {
          bg: "bg-green-50 hover:bg-green-100",
          border: "border-green-200",
          iconBg: "bg-green-100"
        };
      default:
        return {
          bg: "bg-gray-50 hover:bg-gray-100",
          border: "border-gray-200",
          iconBg: "bg-gray-100"
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div 
      className={`${colorClasses.bg} border ${colorClasses.border} rounded-lg p-6 cursor-pointer transition-all hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${colorClasses.iconBg}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};
