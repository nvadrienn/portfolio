
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
      className="fixed bottom-12 left-1 right-1 z-[10000] flex max-w-[18rem] bg-[#c0c0c0] win95-bevel sm:left-0 sm:right-auto sm:w-56"
      onMouseLeave={onClose}
    >
      {/* Left Sidebar Branding */}
      <div className="flex w-8 flex-col justify-end bg-gray-600 p-1">
        <div className="mb-2 ml-1 origin-bottom-left rotate-[-90deg] whitespace-nowrap text-xl font-bold text-white opacity-50">
          Windows<span className="font-black">95</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-1">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`group flex cursor-default items-center justify-between px-3 py-2 text-xs transition-none hover:bg-blue-800 hover:text-white ${i === items.length - 1 ? 'mt-1 border-t border-gray-400' : ''}`}
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
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
