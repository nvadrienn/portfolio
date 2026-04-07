import React from 'react';
import { Shell3220, Shell3221, Shell3222, Shell3223, Shell3224, Shell3225, Shell3228 } from '@react95/icons';

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const items = [
    { icon: Shell3220, label: 'Programs', sub: true },
    { icon: Shell3221, label: 'Documents', sub: true },
    { icon: Shell3222, label: 'Settings', sub: true },
    { icon: Shell3223, label: 'Find', sub: true },
    { icon: Shell3224, label: 'Help' },
    { icon: Shell3225, label: 'Run...' },
    { icon: Shell3228, label: 'Shut Down...', underlineIndex: 2 },
  ];

  return (
    <div
      className="fixed bottom-12 left-1 right-1 z-[10000] flex max-w-[22rem] bg-[#c0c0c0] win95-bevel sm:left-0 sm:right-auto sm:w-72"
      onMouseLeave={onClose}
    >
      {/* Left Sidebar Branding */}
      <div className="relative flex w-12 shrink-0 items-end justify-center bg-[#7f7f7f] py-2">
        <div className="absolute inset-y-0 right-0 w-[3px] bg-[#bdbdbd]" />
        <div
          className="select-none text-[1.7rem] font-bold leading-none tracking-tight text-[#e4e4e4]"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Windows<span className="font-normal">95</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-1">
        {items.map((item, i) => (
          <div
            key={i}
            className={`group flex cursor-default items-center justify-between px-4 py-1.5 text-[15px] transition-none hover:bg-blue-800 hover:text-white ${i === items.length - 1 ? 'mt-1 border-t border-gray-400' : ''}`}
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <item.icon variant="32x32_4" className="h-14 w-14 shrink-0" />
              <span className="font-medium">
                {item.label.slice(0, item.underlineIndex ?? 0)}
                <span className="underline decoration-1 underline-offset-2">{item.label[item.underlineIndex ?? 0]}</span>
                {item.label.slice((item.underlineIndex ?? 0) + 1)}
              </span>
            </div>
            {item.sub && <span className="text-sm">▶</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartMenu;
