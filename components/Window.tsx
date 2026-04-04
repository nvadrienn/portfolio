import React, { useState, useEffect, useRef } from 'react';
import { WindowData } from '../types';

interface WindowProps {
  data: WindowData;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 220;
const DEFAULT_WIDTH = 520;
const DEFAULT_HEIGHT = 420;

const Window: React.FC<WindowProps> = ({ data, onClose, onMinimize, onMaximize, onFocus, onMove, onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const showChrome = data.showChrome !== false;
  const showMenuBar = data.showMenuBar !== false;
  const isMaximized = showChrome && data.isMaximized === true;
  const width = data.size?.width ?? DEFAULT_WIDTH;
  const height = data.size?.height ?? DEFAULT_HEIGHT;
  const minWidth = data.minSize?.width ?? MIN_WIDTH;
  const minHeight = data.minSize?.height ?? MIN_HEIGHT;

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (e.button !== 0) return;
    if (isMaximized) return;
    setIsDragging(true);
    setOffset({
      x: e.clientX - data.position.x,
      y: e.clientY - data.position.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width,
      height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!showChrome) return;
      if (isResizing) {
        const nextWidth = Math.max(minWidth, resizeStart.width + (e.clientX - resizeStart.x));
        const nextHeight = Math.max(minHeight, resizeStart.height + (e.clientY - resizeStart.y));
        onResize(nextWidth, nextHeight);
        return;
      }
      if (isDragging) {
        onMove(e.clientX - offset.x, e.clientY - offset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, showChrome, resizeStart, offset, minWidth, minHeight, onMove, onResize]);

  return (
    <div
      ref={windowRef}
      className={showChrome ? 'absolute win95-bevel bg-[#c0c0c0] flex flex-col shadow-lg' : 'absolute'}
      style={{
        left: isMaximized ? 0 : data.position.x,
        top: isMaximized ? 0 : data.position.y,
        zIndex: data.zIndex,
        minWidth: showChrome && !isMaximized ? minWidth : undefined,
        minHeight: showChrome && !isMaximized ? minHeight : undefined,
        ...(showChrome
          ? (isMaximized
              ? { width: '100vw', maxWidth: '100vw', height: 'calc(100dvh - 3rem)', maxHeight: 'calc(100dvh - 3rem)' }
              : { width, height })
          : {})
      }}
      onClick={showChrome ? onFocus : undefined}
    >
      {showChrome && (
        <>
          <div
            className="win95-title-bar flex items-center justify-between gap-1 p-1 cursor-default select-none touch-none"
            onMouseDown={handleMouseDown}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden pr-1">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                {data.icon}
              </span>
              <span className="truncate px-0.5 text-[10px] font-bold text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] sm:px-1 sm:text-sm">
                {data.title}
              </span>
            </div>

            <div className="flex shrink-0 gap-[2px]">
              <button
                className="flex h-6 w-6 items-center justify-center border border-black bg-[#c0c0c0] p-0 text-[12px] font-bold leading-none text-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff] sm:h-4 sm:w-4 sm:text-[11px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                aria-label="Minimize"
              >
                <span className="relative top-[-2px]">_</span>
              </button>
              <button
                className="flex h-6 w-6 items-center justify-center border border-black bg-[#c0c0c0] p-0 text-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff] sm:h-4 sm:w-4"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize();
                }}
                aria-label={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? (
                  <span className="relative block h-[11px] w-[11px] sm:h-[9px] sm:w-[9px]">
                    <span className="absolute left-0 top-[3px] h-[7px] w-[7px] border border-black bg-[#c0c0c0] sm:top-[2px] sm:h-[6px] sm:w-[6px]" />
                    <span className="absolute right-0 top-0 h-[7px] w-[7px] border border-black bg-[#c0c0c0] sm:h-[6px] sm:w-[6px]" />
                  </span>
                ) : (
                  <span className="block h-[10px] w-[10px] border border-black bg-[#c0c0c0] sm:h-[8px] sm:w-[8px]" />
                )}
              </button>
              <button
                className="flex h-6 w-6 items-center justify-center border border-black bg-[#c0c0c0] p-0 text-[11px] font-bold leading-none text-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff] sm:h-4 sm:w-4 sm:text-[10px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close"
              >
                X
              </button>
            </div>
          </div>

          {showMenuBar && (
            <div className="hidden gap-4 border-b border-gray-400 px-2 py-1 text-[11px] sm:flex">
              <span className="cursor-pointer hover:bg-blue-800 hover:text-white px-1">
                <u>F</u>ile
              </span>
              <span className="cursor-pointer hover:bg-blue-800 hover:text-white px-1">
                <u>E</u>dit
              </span>
              <span className="cursor-pointer hover:bg-blue-800 hover:text-white px-1">
                <u>V</u>iew
              </span>
              <span className="cursor-pointer hover:bg-blue-800 hover:text-white px-1">
                <u>H</u>elp
              </span>
            </div>
          )}
        </>
      )}

      <div className={showChrome ? 'relative flex-1 min-h-0 p-1 overflow-hidden' : 'relative overflow-visible'}>
        <div className={showChrome ? 'h-full overflow-auto' : ''}>
          {data.content}
        </div>
      </div>

      {showChrome && !isMaximized && (
        <button
          type="button"
          aria-label={`Resize ${data.title}`}
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize bg-transparent"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export default Window;
