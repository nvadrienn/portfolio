
import React from 'react';

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const items = [
    { icon: '📁', label: 'Programs', sub: true },
    { icon: '📂', label: 'Documents', sub: true },
    { icon: '⚙️', label: 'Settings', sub: true },
    { icon: '🔍', label: 'Find', sub: true },
    { icon: '❓', label: 'Help' },
    { icon: '🏃', label: 'Run...' },
    { icon: '🚪', label: 'Shut Down...' },
  ];

  return (
    <div 
      className="fixed bottom-9 left-0 w-56 bg-[#c0c0c0] win95-bevel z-[10000] flex"
      onMouseLeave={onClose}
    >
      {/* Left Sidebar Branding */}
      <div className="w-8 bg-gray-600 flex flex-col justify-end p-1">
        <div className="rotate-[-90deg] origin-bottom-left text-white font-bold text-xl whitespace-nowrap mb-2 ml-1 opacity-50">
          Windows<span className="font-black">95</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-1">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-blue-800 hover:text-white cursor-default group transition-none ${i === items.length - 1 ? 'border-t border-gray-400 mt-1' : ''}`}
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium underline decoration-1 underline-offset-2">
                {item.label[0]}
              </span>
              <span>{item.label.slice(1)}</span>
            </div>
            {item.sub && <span className="text-[10px]">▶</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartMenu;
