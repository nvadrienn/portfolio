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
    <div className="fixed bottom-0 left-0 right-0 h-9 bg-[#c0c0c0] border-t-2 border-white flex items-center p-1 gap-2 z-[9999]">
      {/* Start Button */}
      <button
        className={`win95-bevel flex items-center gap-1 px-2 py-0.5 font-bold text-sm h-full active:win95-bevel-inset ${showStart ? 'win95-bevel-inset' : ''}`}
        onClick={() => setShowStart(!showStart)}
      >
        <img src="/windowsstarticon.png" alt="Start" className="w-4 h-4 object-contain" draggable={false} />
        <span>Start</span>
      </button>

      {showStart && <StartMenu onClose={() => setShowStart(false)} />}

      <div className="w-[1px] h-full bg-gray-500 mx-1"></div>

      {/* Program Tabs */}
      <div className="flex-1 flex gap-1 h-full overflow-hidden">
        {windows.filter((w) => w.isOpen).map((win) => (
          <button
            key={win.id}
            className={`win95-bevel flex items-center gap-1 px-2 h-full text-xs min-w-[100px] max-w-[150px] truncate transition-none ${win.isMinimized ? 'opacity-70' : 'bg-[#dfdfdf] font-bold'}`}
            onClick={() => onAppClick(win.id)}
          >
            <span>{win.icon}</span>
            <span className="truncate">{win.title.split(' - ')[0]}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="win95-bevel-inset flex items-center gap-2 px-3 h-full bg-[#c0c0c0] text-xs">
        <span className="text-lg">🔊</span>
        <span className="font-bold">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Taskbar;
