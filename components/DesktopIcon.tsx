
import React from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => {
  return (
    <div 
      className="group flex w-full max-w-[6rem] flex-col items-center gap-1 justify-self-center rounded px-2 py-1 text-center cursor-default sm:w-20"
      onDoubleClick={onDoubleClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        onDoubleClick();
      }}
    >
      <div className="flex items-center justify-center rounded p-1 text-4xl group-hover:bg-blue-900 group-hover:bg-opacity-40">
        {icon}
      </div>
      <span className="px-1 text-[11px] leading-tight text-white">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;
