
import React from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => {
  return (
    <div 
      className="flex flex-col items-center gap-1 w-20 group cursor-default"
      onDoubleClick={onDoubleClick}
      onTouchEnd={(e) => {
        onDoubleClick();
      }}
    >
      <div className="text-4xl p-1 group-hover:bg-blue-900 group-hover:bg-opacity-40 rounded flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[11px] text-white text-center leading-tight px-1">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;
