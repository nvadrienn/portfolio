import React, { useState, useEffect } from 'react';
import StartMenu from './StartMenu';
import { WindowData } from '../types';

interface TaskbarProps {
  windows: WindowData[];
  onAppClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, onAppClick }) => {
  const [showStart, setShowStart] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex h-12 items-center gap-1 border-t-2 border-white bg-[#c0c0c0] p-1 sm:gap-2">
      <button
        className={`win95-bevel flex h-full shrink-0 items-center gap-1 px-2 py-0.5 font-bold text-sm active:win95-bevel-inset ${showStart ? 'win95-bevel-inset' : ''}`}
        onClick={() => setShowStart(!showStart)}
      >
        <img src="/windowsstarticon.png" alt="Start" className="h-4 w-4 object-contain" draggable={false} />
        <span className="hidden sm:inline">Start</span>
      </button>

      {showStart && <StartMenu onClose={() => setShowStart(false)} />}

      <div className="mx-1 hidden h-full w-[1px] bg-gray-500 sm:block"></div>

      <div className="flex h-full flex-1 gap-1 overflow-x-auto overflow-y-hidden pr-1">
        {windows.filter((w) => w.isOpen).map((win) => (
          <button
            key={win.id}
            className={`win95-bevel flex h-full min-w-[84px] shrink-0 items-center gap-1 px-2 text-xs transition-none sm:min-w-[100px] sm:max-w-[150px] ${win.isMinimized ? 'opacity-70' : 'bg-[#dfdfdf] font-bold'}`}
            onClick={() => onAppClick(win.id)}
          >
            <span>{win.icon}</span>
            <span className="truncate">{win.title.split(' - ')[0]}</span>
          </button>
        ))}
      </div>

      <div className="win95-bevel-inset flex h-full shrink-0 items-center gap-1 bg-[#c0c0c0] px-2 text-xs sm:gap-2 sm:px-3">
        <span className="text-[10px] font-bold sm:text-xs">SND</span>
        <span className="font-bold">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Taskbar;
