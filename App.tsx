import React, { useState, useCallback, useEffect } from 'react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import DesktopIcon from './components/DesktopIcon';
import WebampPlayer from './components/WebampPlayer';
import MinesweeperContent from './components/MinesweeperContent';
import { WindowData, DesktopAppId } from './types';
import { Diskcopy1, Drvspace4, CdMusic, Controls3000, Brush, Freecell1, Shell3232, Shell3233, Winmine1, Mapi32IconAttach } from '@react95/icons';

const SolitaireIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <Freecell1 variant="32x32_4" className={className} />
);

const RECYCLE_BIN_STORAGE_KEY = 'retroDesktop.recycleBinState';
const TASKBAR_HEIGHT = 48;
const MOBILE_BREAKPOINT = 768;

const RecycleBinIcon: React.FC<{ isEmpty: boolean; className?: string; variant?: '32x32_4' | '16x16_4' }> = ({
  isEmpty,
  className = 'w-4 h-4',
  variant = '32x32_4'
}) => (isEmpty
  ? <Shell3232 variant={variant} className={className} />
  : <Shell3233 variant={variant} className={className} />
);

const App: React.FC = () => {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === 'undefined' ? 1440 : window.innerWidth,
    height: typeof window === 'undefined' ? 900 : window.innerHeight
  }));
  const [isRecycleBinEmpty, setIsRecycleBinEmpty] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(RECYCLE_BIN_STORAGE_KEY) === 'empty';
  });

  const [windows, setWindows] = useState<Record<DesktopAppId, WindowData>>({
    'my-computer': {
      id: 'my-computer',
      title: 'My Computer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 50, y: 50 },
      size: { width: 600, height: 420 },
      icon: <img src="/mycomputericon.png" alt="My Computer" className="w-4 h-4 object-contain" draggable={false} />,
      content: <MyComputerContent onOpenPaint={() => {}} onOpenSolitaire={() => {}} onOpenMinesweeper={() => {}} />
    },
    'about': {
      id: 'about',
      title: 'About Me.txt - Notepad',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 100, y: 100 },
      size: { width: 520, height: 420 },
      icon: <img src="/notepadicon.png" alt="About Me" className="w-4 h-4 object-contain" draggable={false} />,
      content: <AboutContent />
    },
    'projects': {
      id: 'projects',
      title: 'My Projects',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 150, y: 80 },
      size: { width: 560, height: 420 },
      icon: <img src="/foldericon.png" alt="Projects" className="w-4 h-4 object-contain" draggable={false} />,
      content: <ProjectsContent />
    },
    'certificates': {
      id: 'certificates',
      title: 'Certificates',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 180, y: 100 },
      size: { width: 600, height: 420 },
      icon: <img src="/foldericon.png" alt="Certificates" className="w-4 h-4 object-contain" draggable={false} />,
      content: <CertificatesContent />
    },
    'contact': {
      id: 'contact',
      title: 'Contact Me',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 200, y: 120 },
      size: { width: 520, height: 420 },
      icon: <img src="/inboxicon.png" alt="Contact" className="w-4 h-4 object-contain" draggable={false} />,
      content: <ContactContent />
    },
    'internet-explorer': {
      id: 'internet-explorer',
      title: 'Internet Explorer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 220, y: 70 },
      size: { width: 860, height: 560 },
      icon: <img src="/internetexplorericon.png" alt="Internet Explorer" className="w-4 h-4 object-contain" draggable={false} />,
      content: <InternetExplorerContent />
    },
    'trash': {
      id: 'trash',
      title: 'Recycle Bin',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 300, y: 200 },
      size: { width: 420, height: 320 },
      icon: <RecycleBinIcon isEmpty={false} className="w-4 h-4" variant="16x16_4" />,
      content: <RecycleBinContent isEmpty={false} onEmptyBin={() => {}} />
    },
    'paint': {
      id: 'paint',
      title: 'untitled - Paint',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 260, y: 90 },
      size: { width: 760, height: 520 },
      icon: <Brush variant="32x32_4" className="w-4 h-4" />,
      content: <PaintContent />
    },
    'solitaire': {
      id: 'solitaire',
      title: 'Solitaire',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 90, y: 60 },
      size: { width: 920, height: 640 },
      icon: <SolitaireIcon className="w-4 h-4" />,
      showMenuBar: false,
      content: <SolitaireContent />
    },
    'minesweeper': {
      id: 'minesweeper',
      title: 'Minesweeper',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 140, y: 40 },
      size: { width: 650, height: 640 },
      minSize: { width: 650, height: 640 },
      icon: <Winmine1 variant="16x16_4" className="w-4 h-4" />,
      showMenuBar: false,
      content: <MinesweeperContent />
    },
    'winamp': {
      id: 'winamp',
      title: 'Winamp',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 100, y: 100 },
      icon: <img src="/winamplogo.png" alt="Winamp" className="w-4 h-4 object-contain" draggable={false} />,
      content: <div />,
      showChrome: false
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewport.width < MOBILE_BREAKPOINT;
  const desktopHeight = Math.max(320, viewport.height - TASKBAR_HEIGHT);

  const clampWindowFrame = useCallback((windowState: WindowData, nextPosition = windowState.position, nextSize = windowState.size) => {
    const minWidth = windowState.minSize?.width ?? 300;
    const minHeight = windowState.minSize?.height ?? 220;
    const desiredWidth = nextSize?.width ?? 520;
    const desiredHeight = nextSize?.height ?? 420;

    const maxWidth = Math.max(Math.min(viewport.width - 16, desiredWidth), Math.min(minWidth, viewport.width - 16));
    const maxHeight = Math.max(Math.min(desktopHeight - 16, desiredHeight), Math.min(minHeight, desktopHeight - 16));
    const safeWidth = Math.max(260, maxWidth);
    const safeHeight = Math.max(180, maxHeight);
    const maxX = Math.max(0, viewport.width - safeWidth);
    const maxY = Math.max(0, desktopHeight - safeHeight);

    return {
      position: {
        x: Math.min(Math.max(0, nextPosition.x), maxX),
        y: Math.min(Math.max(0, nextPosition.y), maxY)
      },
      size: {
        width: safeWidth,
        height: safeHeight
      }
    };
  }, [desktopHeight, viewport.height, viewport.width]);

  const bringToFront = useCallback((id: DesktopAppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      const nextZ = Math.max(...Object.values(prev).map((win) => win.zIndex), 1) + 1;
      return {
        ...prev,
        [id]: { ...target, zIndex: nextZ, isMinimized: false, isOpen: true }
      };
    });
  }, []);

  const toggleMinimize = useCallback((id: DesktopAppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      if (target.isMinimized) {
        const nextZ = Math.max(...Object.values(prev).map((win) => win.zIndex), 1) + 1;
        return {
          ...prev,
          [id]: { ...target, isMinimized: false, isOpen: true, zIndex: nextZ }
        };
      }
      return {
        ...prev,
        [id]: { ...target, isMinimized: true }
      };
    });
  }, []);

  const closeWindow = useCallback((id: DesktopAppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  }, []);

  const openWindow = useCallback((id: DesktopAppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      const nextZ = Math.max(...Object.values(prev).map((win) => win.zIndex), 1) + 1;
      return {
        ...prev,
        [id]: {
          ...target,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
          ...(id === 'winamp' ? { position: { x: 100, y: 100 } } : {})
        }
      };
    });
  }, []);

  const updatePosition = useCallback((id: DesktopAppId, x: number, y: number) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      const clamped = clampWindowFrame(target, { x, y }, target.size);
      return {
        ...prev,
        [id]: { ...target, position: clamped.position }
      };
    });
  }, [clampWindowFrame]);

  const updateSize = useCallback((id: DesktopAppId, width: number, height: number) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      const clamped = clampWindowFrame(target, target.position, { width, height });
      return {
        ...prev,
        [id]: { ...target, position: clamped.position, size: clamped.size }
      };
    });
  }, [clampWindowFrame]);

  const toggleMaximize = useCallback((id: DesktopAppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      const nextZ = Math.max(...Object.values(prev).map((win) => win.zIndex), 1) + 1;
      return {
        ...prev,
        [id]: {
          ...target,
          isMaximized: !target.isMaximized,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ
        }
      };
    });
  }, []);

  const handleWinampClose = useCallback(() => {
    closeWindow('winamp');
  }, [closeWindow]);

  const handleWinampMinimize = useCallback(() => {
    setWindows(prev => ({
      ...prev,
      winamp: { ...prev.winamp, isMinimized: true }
    }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(RECYCLE_BIN_STORAGE_KEY, isRecycleBinEmpty ? 'empty' : 'full');
    setWindows((prev) => ({
      ...prev,
      trash: {
        ...prev.trash,
        icon: <RecycleBinIcon isEmpty={isRecycleBinEmpty} className="w-4 h-4" variant="16x16_4" />
      }
    }));
  }, [isRecycleBinEmpty]);

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden select-none bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/2/21/Bliss_%28Windows_XP_wallpaper%29.jpg")',
        backgroundColor: '#008080'
      }}
    >
      <div className="absolute inset-x-0 top-0 bottom-12 overflow-y-auto px-3 py-4 sm:bottom-12 sm:px-4">
        <div className="grid grid-cols-2 gap-4 sm:flex sm:w-max sm:flex-col sm:gap-6">
        <DesktopIcon
          icon={<img src="/mycomputericon.png" alt="My Computer" className="w-12 h-12 object-contain" draggable={false} />}
          label="My Computer"
          onDoubleClick={() => openWindow('my-computer')}
        />
        <DesktopIcon
          icon={<img src="/internetexplorericon.png" alt="Internet Explorer" className="w-12 h-12 object-contain" draggable={false} />}
          label="Internet Explorer"
          onDoubleClick={() => openWindow('internet-explorer')}
        />
        <DesktopIcon
          icon={<img src="/notepadicon.png" alt="About Me" className="w-12 h-12 object-contain" draggable={false} />}
          label="About Me"
          onDoubleClick={() => openWindow('about')}
        />
        <DesktopIcon
          icon={<img src="/foldericon.png" alt="Projects" className="w-12 h-12 object-contain" draggable={false} />}
          label="My Projects"
          onDoubleClick={() => openWindow('projects')}
        />
        <DesktopIcon
          icon={<img src="/foldericon.png" alt="Certificates" className="w-12 h-12 object-contain" draggable={false} />}
          label="Certificates"
          onDoubleClick={() => openWindow('certificates')}
        />
        <DesktopIcon
          icon={<img src="/inboxicon.png" alt="Contact" className="w-12 h-12 object-contain" draggable={false} />}
          label="Contact"
          onDoubleClick={() => openWindow('contact')}
        />
        <DesktopIcon
          icon={<img src="/winamplogo.png" alt="Winamp" className="w-12 h-12 object-contain" draggable={false} />}
          label="Winamp"
          onDoubleClick={() => openWindow('winamp')}
        />
        <DesktopIcon
          icon={<RecycleBinIcon isEmpty={isRecycleBinEmpty} className="w-12 h-12" />}
          label="Recycle Bin"
          onDoubleClick={() => openWindow('trash')}
        />
        </div>
      </div>

      {(Object.values(windows) as WindowData[]).map((win) => {
        if (!win.isOpen) return null;

        if (win.id === 'winamp') {
          return (
            <div key={win.id}>
              <WebampPlayer
                isMinimized={win.isMinimized}
                x={win.position.x}
                y={win.position.y}
                zIndex={win.zIndex}
                onPlayerClose={handleWinampClose}
                onPlayerMinimize={handleWinampMinimize}
              />
            </div>
          );
        }

        if (win.isMinimized) return null;

        const clamped = clampWindowFrame(win);
        const mobileWindow = isMobile && win.showChrome !== false;
        const renderedWindow: WindowData = {
          ...win,
          position: mobileWindow ? { x: 0, y: 0 } : clamped.position,
          size: mobileWindow
            ? { width: viewport.width, height: desktopHeight }
            : clamped.size,
          isMaximized: mobileWindow ? true : win.isMaximized
        };

        return (
          <Window
            key={win.id}
            data={{
              ...renderedWindow,
              content:
                win.id === 'my-computer'
                  ? <MyComputerContent onOpenPaint={() => { openWindow('paint'); closeWindow('my-computer'); }} onOpenSolitaire={() => { openWindow('solitaire'); closeWindow('my-computer'); }} onOpenMinesweeper={() => { openWindow('minesweeper'); closeWindow('my-computer'); }} />
                  : win.id === 'trash'
                    ? <RecycleBinContent isEmpty={isRecycleBinEmpty} onEmptyBin={() => setIsRecycleBinEmpty(true)} />
                  : win.content
            }}
            onClose={() => closeWindow(win.id as DesktopAppId)}
            onMinimize={() => toggleMinimize(win.id as DesktopAppId)}
            onMaximize={() => toggleMaximize(win.id as DesktopAppId)}
            onFocus={() => bringToFront(win.id as DesktopAppId)}
            onMove={(x, y) => updatePosition(win.id as DesktopAppId, x, y)}
            onResize={(width, height) => updateSize(win.id as DesktopAppId, width, height)}
          />
        );
      })}

      <Taskbar
        windows={Object.values(windows) as WindowData[]}
        onAppClick={(id) => {
          const appId = id as DesktopAppId;
          const target = windows[appId];

          if (appId === 'winamp') {
            if (!target.isOpen) {
              openWindow('winamp');
            } else {
              toggleMinimize('winamp');
            }
            return;
          }

          if (target.isMinimized || !target.isOpen) {
            openWindow(appId);
          } else {
            toggleMinimize(appId);
          }
        }}
      />
    </div>
  );
};

interface MyComputerContentProps {
  onOpenPaint: () => void;
  onOpenSolitaire: () => void;
  onOpenMinesweeper: () => void;
}

const MyComputerContent: React.FC<MyComputerContentProps> = ({ onOpenPaint, onOpenSolitaire, onOpenMinesweeper }) => (
  <div className="grid h-full grid-cols-2 content-start gap-4 overflow-auto bg-white p-2 win95-bevel-inset sm:grid-cols-4">
    {[
      { icon: <Diskcopy1 variant="32x32_4" className="w-10 h-10" />, label: '3� Floppy (A:)' },
      { icon: <Drvspace4 variant="32x32_4" className="w-10 h-10" />, label: 'Hard Drive (C:)' },
      { icon: <CdMusic variant="32x32_4" className="w-10 h-10" />, label: 'Audio CD (D:)' },
      { icon: <Controls3000 variant="32x32_4" className="w-10 h-10" />, label: 'Control Panel' }
    ].map((item, i) => (
      <div key={i} className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2">
        <span className="w-10 h-10 flex items-center justify-center">{item.icon}</span>
        <span className="text-[11px] text-center">{item.label}</span>
      </div>
    ))}
    <button
      type="button"
      onDoubleClick={onOpenPaint}
      onClick={(e) => {
        e.stopPropagation();
        onOpenPaint();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2 text-left"
    >
      <Brush variant="32x32_4" className="w-12 h-12" />
      <span className="text-[11px] text-center">Paint</span>
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenSolitaire();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2 text-left"
    >
      <SolitaireIcon className="w-12 h-12" />
      <span className="text-[11px] text-center">Solitaire</span>
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenMinesweeper();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 p-2 text-left"
    >
      <Winmine1 variant="32x32_4" className="w-12 h-12" />
      <span className="text-[11px] text-center">Minesweeper</span>
    </button>
  </div>
);

type PaintToolId = 'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse' | 'fill' | 'picker' | 'clear';

interface PaintTool {
  id: PaintToolId;
  label: string;
}

const paintTools: PaintTool[] = [
  { id: 'pencil', label: '\u270F\uFE0F' },
  { id: 'brush', label: '\uD83D\uDD8C\uFE0F' },
  { id: 'eraser', label: '\uD83E\uDDFD' },
  { id: 'line', label: '\uD83D\uDCCF' },
  { id: 'rect', label: '\u25AD' },
  { id: 'ellipse', label: '\u2B55' },
  { id: 'fill', label: '\uD83E\uDEA3' },
  { id: 'picker', label: '\uD83D\uDC89' },
  { id: 'clear', label: '\uD83D\uDDD1\uFE0F' }
];

const PaintContent: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<PaintToolId>('pencil');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [status, setStatus] = useState('Pencil ready');

  const isDrawingRef = React.useRef(false);
  const startPointRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = React.useRef<ImageData | null>(null);
  const strokeColorRef = React.useRef(primaryColor);

  const paletteRows = [
    ['#000000', '#7f7f7f', '#7f0000', '#7f7f00', '#007f00', '#007f7f', '#00007f', '#7f007f', '#7f3f00', '#3f3f3f', '#003f7f', '#003f3f', '#7f0000', '#ff7f3f'],
    ['#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff7f', '#7fff7f', '#7fffff', '#7f7fff', '#ff007f', '#ff9f5f']
  ] as const;

  const toolLabel: Record<PaintToolId, string> = {
    pencil: 'Pencil',
    brush: 'Brush',
    eraser: 'Eraser',
    line: 'Line',
    rect: 'Rectangle',
    ellipse: 'Ellipse',
    fill: 'Fill',
    picker: 'Color Picker',
    clear: 'Clear'
  };

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return { canvas, ctx };
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string,
    width: number
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const drawShapePreview = (
    ctx: CanvasRenderingContext2D,
    tool: PaintToolId,
    start: { x: number; y: number },
    end: { x: number; y: number },
    color: string
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (tool === 'line') {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    } else if (tool === 'rect') {
      const w = end.x - start.x;
      const h = end.y - start.y;
      ctx.rect(start.x, start.y, w, h);
    } else if (tool === 'ellipse') {
      const centerX = (start.x + end.x) / 2;
      const centerY = (start.y + end.y) / 2;
      const radiusX = Math.abs(end.x - start.x) / 2;
      const radiusY = Math.abs(end.y - start.y) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    }
    ctx.stroke();
  };

  React.useEffect(() => {
    const init = getContext();
    if (!init) return;
    const { canvas, ctx } = init;
    if (canvas.dataset.ready === '1') return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.dataset.ready = '1';
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const init = getContext();
    if (!init) return;
    const { canvas, ctx } = init;
    const point = getPoint(e);
    const buttonColor = e.button === 2 ? secondaryColor : primaryColor;
    strokeColorRef.current = buttonColor;

    if (activeTool === 'fill') {
      ctx.fillStyle = buttonColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setStatus(`Canvas filled with ${buttonColor}`);
      return;
    }

    if (activeTool === 'clear') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setStatus('Canvas cleared');
      return;
    }

    if (activeTool === 'picker') {
      const px = Math.max(0, Math.min(canvas.width - 1, Math.floor(point.x)));
      const py = Math.max(0, Math.min(canvas.height - 1, Math.floor(point.y)));
      const data = ctx.getImageData(px, py, 1, 1).data;
      const hex = `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`;
      if (e.button === 2) {
        setSecondaryColor(hex);
      } else {
        setPrimaryColor(hex);
      }
      setStatus(`Picked ${hex}`);
      return;
    }

    isDrawingRef.current = true;
    startPointRef.current = point;
    lastPointRef.current = point;
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      const width = activeTool === 'pencil' ? 1 : activeTool === 'brush' ? 4 : 12;
      const color = activeTool === 'eraser' ? '#ffffff' : buttonColor;
      drawStroke(ctx, point, point, color, width);
    }

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore unsupported capture environments.
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const init = getContext();
    if (!init) return;
    const { canvas, ctx } = init;
    const point = getPoint(e);
    const lastPoint = lastPointRef.current ?? point;
    const startPoint = startPointRef.current ?? point;

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      const width = activeTool === 'pencil' ? 1 : activeTool === 'brush' ? 4 : 12;
      const color = activeTool === 'eraser' ? '#ffffff' : strokeColorRef.current;
      drawStroke(ctx, lastPoint, point, color, width);
    } else if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'ellipse') {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      drawShapePreview(ctx, activeTool, startPoint, point, strokeColorRef.current);
    }

    lastPointRef.current = point;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    startPointRef.current = null;
    lastPointRef.current = null;
    snapshotRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore unsupported capture environments.
    }
  };

  return (
    <div className="bg-[#c0c0c0] h-full flex flex-col p-1 gap-1 min-h-0">
      <div className="flex gap-1 flex-1 min-h-0">
        <div className="w-14 bg-[#c0c0c0] win95-bevel-inset p-1 grid grid-cols-2 gap-1 content-start">
          {paintTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={`h-6 text-sm leading-none ${activeTool === tool.id ? 'win95-bevel-inset bg-[#b8b8b8]' : 'bg-[#c0c0c0] win95-bevel win95-button'}`}
              onClick={() => {
                setActiveTool(tool.id);
                setStatus(`${toolLabel[tool.id]} selected`);
              }}
              aria-label={toolLabel[tool.id]}
              title={toolLabel[tool.id]}
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div className="flex-1 win95-bevel-inset bg-white relative overflow-auto min-h-0 p-1">
          <canvas
            ref={canvasRef}
            width={1000}
            height={640}
            className="bg-white border border-[#7f7f7f] w-full h-full touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>

      <div className="win95-bevel-inset bg-[#c0c0c0] p-1 flex items-center gap-2">
        <div className="relative w-11 h-9 win95-bevel-inset bg-[#c0c0c0] shrink-0">
          <button
            type="button"
            className="absolute left-1 top-1 w-5 h-5 border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]"
            style={{ backgroundColor: primaryColor }}
            title={`Primary color ${primaryColor}`}
            onClick={() => {
              setPrimaryColor(secondaryColor);
              setSecondaryColor(primaryColor);
            }}
            aria-label="Primary color square"
          />
          <button
            type="button"
            className="absolute right-1 bottom-1 w-5 h-5 border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]"
            style={{ backgroundColor: secondaryColor }}
            title={`Secondary color ${secondaryColor}`}
            onClick={() => {
              setPrimaryColor(secondaryColor);
              setSecondaryColor(primaryColor);
            }}
            aria-label="Secondary color square"
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          {paletteRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-[2px]">
              {row.map((color, colorIndex) => (
                <button
                  key={`${rowIndex}-${colorIndex}-${color}`}
                  type="button"
                  className={`w-4 h-4 border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] ${primaryColor === color ? 'outline outline-1 outline-blue-900' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                  title={`${color} (left click primary, right click secondary)`}
                  onClick={() => setPrimaryColor(color)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSecondaryColor(color);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="win95-bevel bg-[#dfdfdf] px-2 py-0.5 text-[11px]">
        Tool: {toolLabel[activeTool]} | Left: {primaryColor} | Right: {secondaryColor} | {status}
      </div>
    </div>
  );
};

type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

interface SolitaireCard {
  id: string;
  suit: CardSuit;
  rank: number;
  faceUp: boolean;
}

interface SolitaireState {
  stock: SolitaireCard[];
  waste: SolitaireCard[];
  foundations: Record<CardSuit, SolitaireCard[]>;
  tableau: SolitaireCard[][];
  won: boolean;
}

type DragCardSource =
  | { source: 'waste' }
  | { source: 'foundation'; suit: CardSuit }
  | { source: 'tableau'; pile: number; index: number };

const cardSuits: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

const suitSymbol: Record<CardSuit, string> = {
  hearts: '\u2665',
  diamonds: '\u2666',
  clubs: '\u2663',
  spades: '\u2660'
};

const isCardRed = (suit: CardSuit): boolean => suit === 'hearts' || suit === 'diamonds';

const rankLabel = (rank: number): string => {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
};

const pipLayouts: Record<number, Array<{ x: string; y: string }>> = {
  1: [{ x: '50%', y: '50%' }],
  2: [{ x: '50%', y: '24%' }, { x: '50%', y: '76%' }],
  3: [{ x: '50%', y: '20%' }, { x: '50%', y: '50%' }, { x: '50%', y: '80%' }],
  4: [{ x: '30%', y: '24%' }, { x: '70%', y: '24%' }, { x: '30%', y: '76%' }, { x: '70%', y: '76%' }],
  5: [{ x: '30%', y: '24%' }, { x: '70%', y: '24%' }, { x: '50%', y: '50%' }, { x: '30%', y: '76%' }, { x: '70%', y: '76%' }],
  6: [{ x: '30%', y: '22%' }, { x: '70%', y: '22%' }, { x: '30%', y: '50%' }, { x: '70%', y: '50%' }, { x: '30%', y: '78%' }, { x: '70%', y: '78%' }],
  7: [{ x: '30%', y: '20%' }, { x: '70%', y: '20%' }, { x: '50%', y: '34%' }, { x: '30%', y: '50%' }, { x: '70%', y: '50%' }, { x: '30%', y: '78%' }, { x: '70%', y: '78%' }],
  8: [{ x: '30%', y: '18%' }, { x: '70%', y: '18%' }, { x: '30%', y: '38%' }, { x: '70%', y: '38%' }, { x: '30%', y: '60%' }, { x: '70%', y: '60%' }, { x: '30%', y: '82%' }, { x: '70%', y: '82%' }],
  9: [{ x: '30%', y: '16%' }, { x: '70%', y: '16%' }, { x: '30%', y: '34%' }, { x: '70%', y: '34%' }, { x: '50%', y: '50%' }, { x: '30%', y: '66%' }, { x: '70%', y: '66%' }, { x: '30%', y: '84%' }, { x: '70%', y: '84%' }],
  10: [{ x: '30%', y: '14%' }, { x: '70%', y: '14%' }, { x: '30%', y: '30%' }, { x: '70%', y: '30%' }, { x: '30%', y: '48%' }, { x: '70%', y: '48%' }, { x: '30%', y: '66%' }, { x: '70%', y: '66%' }, { x: '30%', y: '84%' }, { x: '70%', y: '84%' }]
};

const faceRoyalSymbol: Record<number, string> = {
  11: '\u2694',
  12: '\u2655',
  13: '\u2654'
};

const SolitaireCardFace: React.FC<{ card: SolitaireCard }> = ({ card }) => {
  const colorClass = isCardRed(card.suit) ? 'text-red-600' : 'text-black';
  const isFaceCard = card.rank >= 11;
  const pips = pipLayouts[card.rank] ?? [];
  return (
    <span className={`relative w-full h-full block ${colorClass} font-['Times_New_Roman',serif]`}>
      <span className="absolute top-1 left-1 z-20 text-[15px] leading-none font-bold">
        {rankLabel(card.rank)}
      </span>
      <span className="absolute top-1 right-1 z-20 text-[15px] leading-none">
        {suitSymbol[card.suit]}
      </span>
      <span className="absolute bottom-1 right-1 z-20 text-[14px] leading-none -rotate-180">
        {rankLabel(card.rank)}{suitSymbol[card.suit]}
      </span>
      {isFaceCard ? (
        <span className="absolute z-10 left-2 right-2 top-6 bottom-6 border border-black/50 bg-[repeating-linear-gradient(0deg,#f3ecd3_0px,#f3ecd3_5px,#efe5c3_5px,#efe5c3_10px)] flex flex-col items-center justify-center">
          <span className="text-[13px] leading-none font-bold">{rankLabel(card.rank)}</span>
          <span className="text-[26px] leading-none">{faceRoyalSymbol[card.rank]}</span>
          <span className="text-[20px] leading-none">{suitSymbol[card.suit]}</span>
        </span>
      ) : (
        <>
          {pips.map((pip, index) => (
            <span
              key={`${card.id}-pip-${index}`}
              className="absolute text-[18px] leading-none"
              style={{ left: pip.x, top: pip.y, transform: 'translate(-50%, -50%)' }}
            >
              {suitSymbol[card.suit]}
            </span>
          ))}
        </>
      )}
    </span>
  );
};

const shuffleCards = (cards: SolitaireCard[]): SolitaireCard[] => {
  const next = [...cards];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const createInitialSolitaireState = (): SolitaireState => {
  const freshDeck = shuffleCards(
    cardSuits.flatMap((suit) =>
      Array.from({ length: 13 }, (_, index) => ({
        id: `${suit}-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
        suit,
        rank: index + 1,
        faceUp: false
      }))
    )
  );

  const tableau: SolitaireCard[][] = Array.from({ length: 7 }, () => []);

  for (let pile = 0; pile < 7; pile += 1) {
    for (let depth = 0; depth <= pile; depth += 1) {
      const drawn = freshDeck.pop();
      if (!drawn) continue;
      tableau[pile].push({ ...drawn, faceUp: depth === pile });
    }
  }

  const stock = freshDeck.map((card) => ({ ...card, faceUp: false }));

  return {
    stock,
    waste: [],
    foundations: {
      hearts: [],
      diamonds: [],
      clubs: [],
      spades: []
    },
    tableau,
    won: false
  };
};

const canMoveToFoundation = (card: SolitaireCard, foundation: SolitaireCard[]): boolean => {
  const top = foundation[foundation.length - 1];
  if (!top) return card.rank === 1;
  return card.suit === top.suit && card.rank === top.rank + 1;
};

const canMoveToTableau = (card: SolitaireCard, pile: SolitaireCard[]): boolean => {
  const top = pile[pile.length - 1];
  if (!top) return card.rank === 13;
  return isCardRed(card.suit) !== isCardRed(top.suit) && card.rank === top.rank - 1;
};

const SolitaireContent: React.FC = () => {
  const [game, setGame] = useState<SolitaireState>(() => createInitialSolitaireState());
  const [dragSource, setDragSource] = useState<DragCardSource | null>(null);
  const [status, setStatus] = useState('Click deck to draw. Drag cards to tableau/foundation.');

  const drawFromStock = () => {
    setGame((prev) => {
      if (prev.stock.length > 0) {
        const stock = [...prev.stock];
        const drawn = stock.pop();
        if (!drawn) return prev;
        return {
          ...prev,
          stock,
          waste: [...prev.waste, { ...drawn, faceUp: true }]
        };
      }

      if (prev.waste.length === 0) return prev;

      const recycled = [...prev.waste]
        .reverse()
        .map((card) => ({ ...card, faceUp: false }));

      return {
        ...prev,
        stock: recycled,
        waste: []
      };
    });
    setDragSource(null);
    setStatus('Deck updated.');
  };

  const moveToFoundation = (source: DragCardSource, targetSuit: CardSuit) => {
    let moved = false;

    setGame((prev) => {
      const next: SolitaireState = {
        ...prev,
        stock: [...prev.stock],
        waste: [...prev.waste],
        foundations: {
          hearts: [...prev.foundations.hearts],
          diamonds: [...prev.foundations.diamonds],
          clubs: [...prev.foundations.clubs],
          spades: [...prev.foundations.spades]
        },
        tableau: prev.tableau.map((pile) => [...pile])
      };

      let movingCard: SolitaireCard | null = null;

      if (source.source === 'waste') {
        movingCard = next.waste[next.waste.length - 1] ?? null;
      } else if (source.source === 'foundation') {
        movingCard = next.foundations[source.suit][next.foundations[source.suit].length - 1] ?? null;
      } else {
        const pile = next.tableau[source.pile];
        if (source.index !== pile.length - 1) return prev;
        movingCard = pile[source.index] ?? null;
      }

      if (!movingCard || movingCard.suit !== targetSuit) return prev;
      if (!canMoveToFoundation(movingCard, next.foundations[targetSuit])) return prev;

      if (source.source === 'waste') {
        next.waste.pop();
      } else if (source.source === 'foundation') {
        next.foundations[source.suit].pop();
      } else {
        next.tableau[source.pile] = next.tableau[source.pile].slice(0, source.index);
        const newTop = next.tableau[source.pile][next.tableau[source.pile].length - 1];
        if (newTop && !newTop.faceUp) newTop.faceUp = true;
      }

      next.foundations[targetSuit].push({ ...movingCard, faceUp: true });
      moved = true;
      return next;
    });

    if (moved) {
      setDragSource(null);
      setStatus(`Moved to ${targetSuit} foundation.`);
      return true;
    }
    return false;
  };

  const moveToTableau = (source: DragCardSource, targetPile: number) => {
    let moved = false;

    setGame((prev) => {
      const next: SolitaireState = {
        ...prev,
        stock: [...prev.stock],
        waste: [...prev.waste],
        foundations: {
          hearts: [...prev.foundations.hearts],
          diamonds: [...prev.foundations.diamonds],
          clubs: [...prev.foundations.clubs],
          spades: [...prev.foundations.spades]
        },
        tableau: prev.tableau.map((pile) => [...pile])
      };

      let movingCards: SolitaireCard[] = [];

      if (source.source === 'waste') {
        const top = next.waste[next.waste.length - 1];
        if (!top) return prev;
        movingCards = [{ ...top, faceUp: true }];
      } else if (source.source === 'foundation') {
        const pile = next.foundations[source.suit];
        const top = pile[pile.length - 1];
        if (!top) return prev;
        movingCards = [{ ...top, faceUp: true }];
      } else {
        if (source.pile === targetPile) return prev;
        const pile = next.tableau[source.pile];
        movingCards = pile.slice(source.index).map((card) => ({ ...card, faceUp: true }));
        if (movingCards.length === 0) return prev;
      }

      if (!canMoveToTableau(movingCards[0], next.tableau[targetPile])) return prev;

      if (source.source === 'waste') {
        next.waste.pop();
      } else if (source.source === 'foundation') {
        next.foundations[source.suit].pop();
      } else {
        next.tableau[source.pile] = next.tableau[source.pile].slice(0, source.index);
        const newTop = next.tableau[source.pile][next.tableau[source.pile].length - 1];
        if (newTop && !newTop.faceUp) newTop.faceUp = true;
      }

      next.tableau[targetPile].push(...movingCards);
      moved = true;
      return next;
    });

    if (moved) {
      setDragSource(null);
      setStatus(`Moved to tableau ${targetPile + 1}.`);
      return true;
    }
    return false;
  };

  const handleTableauCardClick = (pileIndex: number, cardIndex: number) => {
    const pile = game.tableau[pileIndex];
    const card = pile[cardIndex];
    if (!card) return;

    if (!card.faceUp) {
      if (cardIndex === pile.length - 1 && !selection) {
        setGame((prev) => {
          const next = { ...prev, tableau: prev.tableau.map((col) => [...col]) };
          const top = next.tableau[pileIndex][next.tableau[pileIndex].length - 1];
          if (top) top.faceUp = true;
          return next;
        });
        setStatus('Card flipped.');
      }
    }
  };

  const onCardDragStart = (e: React.DragEvent, source: DragCardSource, label: string) => {
    setDragSource(source);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', label);
    setStatus(`Dragging ${label}...`);
  };

  const handleFoundationDrop = (targetSuit: CardSuit) => {
    if (!dragSource) return;
    const moved = moveToFoundation(dragSource, targetSuit);
    if (!moved) setStatus('Invalid move.');
  };

  const handleTableauDrop = (targetPile: number) => {
    if (!dragSource) return;
    const moved = moveToTableau(dragSource, targetPile);
    if (!moved) setStatus('Invalid move.');
  };

  React.useEffect(() => {
    const won = cardSuits.every((suit) => game.foundations[suit].length === 13);
    if (won && !game.won) {
      setGame((prev) => ({ ...prev, won: true }));
      setStatus('You won!');
      setDragSource(null);
    }
  }, [game]);

  return (
    <div className="h-full min-h-0 bg-[#008000] p-2 flex flex-col gap-2">
      <div className="win95-bevel bg-[#c0c0c0] px-2 py-1 flex items-center gap-2 text-[11px]">
        <button
          type="button"
          className="win95-bevel win95-button px-2 py-0.5"
          onClick={() => {
            setGame(createInitialSolitaireState());
            setDragSource(null);
            setStatus('New game started.');
          }}
        >
          New Game
        </button>
        <span>{dragSource ? 'Dragging card...' : 'Ready'}</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={drawFromStock}
            className="w-[78px] h-[108px] win95-bevel-inset flex items-center justify-center text-white bg-[#003bb3] border border-black"
          >
            {game.stock.length > 0 ? `${game.stock.length}` : '?'}
          </button>
          <button
            type="button"
            draggable={game.waste.length > 0}
            onDragStart={(e) => onCardDragStart(e, { source: 'waste' }, 'waste card')}
            onDragEnd={() => setDragSource(null)}
            className={`w-[78px] h-[108px] win95-bevel-inset border border-black flex items-center justify-center text-2xl ${game.waste.length === 0 ? 'bg-[#0f8a0f]' : 'bg-white'}`}
          >
            {game.waste.length > 0 ? (
              <SolitaireCardFace card={game.waste[game.waste.length - 1]} />
            ) : (
              <span className="text-[#0a500a]">.</span>
            )}
          </button>
        </div>

        <div className="flex items-start gap-3">
          {cardSuits.map((suit) => {
            const pile = game.foundations[suit];
            const top = pile[pile.length - 1];
            const selectedFoundation = dragSource?.source === 'foundation' && dragSource.suit === suit;
            return (
              <button
                key={suit}
                type="button"
                draggable={pile.length > 0}
                onDragStart={(e) => onCardDragStart(e, { source: 'foundation', suit }, `${suit} foundation card`)}
                onDragEnd={() => setDragSource(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleFoundationDrop(suit)}
                className={`w-[78px] h-[108px] win95-bevel-inset border border-black flex items-center justify-center text-2xl ${top ? 'bg-white' : 'bg-[#0f8a0f]'} ${selectedFoundation ? 'outline outline-2 outline-yellow-300' : ''}`}
              >
                {top ? (
                  <SolitaireCardFace card={top} />
                ) : (
                  <span className={isCardRed(suit) ? 'text-red-700/40' : 'text-black/40'}>{suitSymbol[suit]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-3 items-start">
        {game.tableau.map((pile, pileIndex) => (
          <button
            key={pileIndex}
            type="button"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleTableauDrop(pileIndex)}
            className="relative flex-1 min-w-[100px] h-full win95-bevel-inset border border-black bg-[#0f8a0f] text-left"
          >
            {pile.length === 0 && (
              <div className="absolute left-3 top-3 w-[78px] h-[108px] border border-dashed border-black/30" />
            )}
            {pile.map((card, cardIndex) => {
              return (
                <span
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  draggable={card.faceUp}
                  onDragStart={(e) => onCardDragStart(e, { source: 'tableau', pile: pileIndex, index: cardIndex }, 'tableau card')}
                  onDragEnd={() => setDragSource(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTableauCardClick(pileIndex, cardIndex);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTableauCardClick(pileIndex, cardIndex);
                    }
                  }}
                  className={`absolute left-3 w-[78px] h-[108px] border border-black flex items-center justify-center text-2xl ${card.faceUp ? 'bg-white' : 'bg-[#003bb3] text-transparent'}`}
                  style={{ top: `${12 + cardIndex * 24}px` }}
                >
                  {card.faceUp ? (
                    <SolitaireCardFace card={card} />
                  ) : (
                    '#'
                  )}
                </span>
              );
            })}
          </button>
        ))}
      </div>

      <div className="win95-bevel bg-[#dfdfdf] px-2 py-0.5 text-[11px]">
        {status} {game.won ? 'All foundations completed.' : ''}
      </div>
    </div>
  );
};

interface RecycleBinContentProps {
  isEmpty: boolean;
  onEmptyBin: () => void;
}

const recycleBinItems = [
  { name: 'homework_final_FINAL_v12.doc', type: 'Document', date: '04/01/1998' },
  { name: 'definitely_not_virus.exe', type: 'Application', date: '05/22/1999' },
  { name: 'mp3_that_skips_at_best_part.mp3', type: 'Audio File', date: '08/13/2000' },
  { name: 'Untitled.bmp', type: 'Bitmap Image', date: '11/03/1997' },
  { name: 'taxes_maybe.txt', type: 'Text Document', date: '01/29/2001' },
  { name: 'keyboard_crumbs_inventory.xls', type: 'Worksheet', date: '09/09/1999' },
  { name: 'do_not_open.bat', type: 'MS-DOS Batch', date: '07/07/1998' },
  { name: 'MyCoolWebsiteUnderConstruction.htm', type: 'HTML Document', date: '03/15/2000' },
  { name: 'README_pls_ignore.me', type: 'File', date: '12/31/1999' }
];

const RecycleBinContent: React.FC<RecycleBinContentProps> = ({ isEmpty, onEmptyBin }) => (
  <div className="bg-white win95-bevel-inset h-full p-2 flex flex-col text-[11px]">
    <div className="win95-bevel bg-[#dfdfdf] px-2 py-1 mb-2 flex items-center justify-between gap-2">
      <span>{isEmpty ? '0 object(s) | 0 bytes' : `${recycleBinItems.length} object(s) | 1.44 MB`}</span>
      <button
        type="button"
        className="win95-bevel win95-button px-2 py-0.5 disabled:opacity-60"
        onClick={onEmptyBin}
        disabled={isEmpty}
      >
        Empty Recycle Bin
      </button>
    </div>
    <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-x-2 border-b border-[#7f7f7f] px-1 py-1 font-bold sm:grid-cols-[1.6fr_1fr_1fr]">
      <span>Name</span>
      <span>Type</span>
      <span className="hidden sm:block">Date Deleted</span>
    </div>
    <div className="overflow-auto flex-1">
      {isEmpty ? (
        <div className="h-full flex items-center justify-center text-[#5f5f5f]">
          The Recycle Bin is empty.
        </div>
      ) : (
        recycleBinItems.map((file) => (
          <div key={file.name} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-x-2 px-1 py-1 hover:bg-blue-100 sm:grid-cols-[1.6fr_1fr_1fr]">
            <span className="truncate">{file.name}</span>
            <span>{file.type}</span>
            <span className="hidden sm:block">{file.date}</span>
          </div>
        ))
      )}
    </div>
    <div className="win95-bevel bg-[#dfdfdf] px-2 py-1 mt-2">
      {isEmpty ? 'Bin status saved. This icon will stay empty after refresh.' : 'Tip: Emptying this bin may delete your last 3 good ideas.'}
    </div>
  </div>
);

const AboutContent: React.FC = () => (
  <div className="bg-white win95-bevel-inset p-4 h-full overflow-y-auto text-black font-mono leading-tight">
    <p className="mb-4">HELLO WORLD!</p>
    <p className="mb-2">I love making beats in FL Studio and getting lost in sound design.</p>
    <p className="mb-2">When I am not producing, I am usually playing video games.</p>
    <p className="mb-2">I have always been interested in becoming one of these:</p>
    <ul className="list-disc ml-6 mb-4">
      <li>Composer</li>
      <li>Producer</li>
      <li>Game Developer</li>
    </ul>
    <p>
      Music, games, and creative tech are what keep me inspired. This desktop is a small piece of who I am.
    </p>
  </div>
);

type ClassicFolderItem = {
  name: string;
  kind: 'folder' | 'file';
  url?: string;
};

const FileIconSmall: React.FC = () => (
  <Mapi32IconAttach variant="32x32_4" className="w-8 h-8" />
);

const FolderIconSmall: React.FC = () => (
  <img src="/foldericon.png" alt="" className="w-9 h-8 object-contain" draggable={false} />
);

interface ClassicFolderViewProps {
  items: ClassicFolderItem[];
}

const ClassicFolderView: React.FC<ClassicFolderViewProps> = ({ items }) => (
  <div className="bg-[#c0c0c0] h-full p-1 flex flex-col text-[11px]">
    <div className="win95-bevel-inset bg-[#d9d9d9] flex-1 overflow-auto p-3">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(82px,1fr))] gap-y-4 gap-x-2 content-start">
        {items.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => {
              if (item.url) {
                window.open(item.url, '_blank', 'noopener,noreferrer');
              }
            }}
            className="flex flex-col items-center gap-1 px-1 py-1 text-center hover:bg-blue-700 hover:text-white"
          >
            {item.kind === 'folder' ? <FolderIconSmall /> : <FileIconSmall />}
            <span className="leading-tight break-all [text-shadow:none]">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
    <div className="mt-1 grid grid-cols-[1.5fr_1fr_1fr] gap-1">
      <div className="win95-bevel-inset px-2 py-0.5">{items.length} Objects in Folder.</div>
      <div className="win95-bevel-inset px-2 py-0.5">&nbsp;</div>
      <div className="win95-bevel-inset px-2 py-0.5">&nbsp;</div>
    </div>
  </div>
);

const projectFolderItems: ClassicFolderItem[] = [
  { name: 'beats', kind: 'folder' },
  { name: 'games', kind: 'folder' },
  { name: 'websites', kind: 'folder' },
  { name: 'Space_Invaders_95.pdf', kind: 'file' },
  { name: 'VHS_Filter_Tool.pdf', kind: 'file' },
  { name: 'BeeperJS.pdf', kind: 'file' },
  { name: 'Portfolio_Redesign.pdf', kind: 'file' },
  { name: 'Music_Visualizer.pdf', kind: 'file' },
  { name: 'Pixel_Platformer.pdf', kind: 'file' },
  { name: 'Synth_UI_Concept.pdf', kind: 'file' }
];

const certificateFolderItems: ClassicFolderItem[] = [
  {
    name: 'CS50_Certificate.pdf',
    kind: 'file',
    url: 'https://certificates.cs50.io/d3f0827e-d0aa-40e1-ab3a-2fdb685ab596.pdf?size=letter'
  },
  {
    name: 'BWSIX_Certificate.pdf',
    kind: 'file',
    url: 'https://courses.bwsix.edly.io/certificates/9a40e5891ee14b88828405f15e9d1749'
  },
  {
    name: 'Certificate Of Participation.pdf',
    kind: 'file',
    url: '/certificates/Certificate%20Of%20Participation.pdf'
  },
  {
    name: 'Certificate Of Appreciation.pdf',
    kind: 'file',
    url: '/certificates/Certificate%20Of%20Appreciation.pdf'
  },
  {
    name: 'Certificate Of Game Development.pdf',
    kind: 'file',
    url: '/certificates/Certificate%20Of%20Game%20Development.pdf'
  }
];

const ProjectsContent: React.FC = () => (
  <ClassicFolderView items={projectFolderItems} />
);

const CertificatesContent: React.FC = () => (
  <ClassicFolderView items={certificateFolderItems} />
);

const ContactContent: React.FC = () => (
  <div className="p-6 bg-[#c0c0c0] h-full overflow-y-auto flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <label className="text-sm">To:</label>
      <div className="bg-white p-1 win95-bevel-inset text-sm">webmaster@retro.com</div>
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-sm">Message:</label>
      <textarea className="bg-white p-2 win95-bevel-inset h-32 text-sm resize-none focus:outline-none" defaultValue="Enter your message here..."></textarea>
    </div>
    <button className="win95-bevel win95-button bg-[#c0c0c0] px-4 py-1 self-end active:bg-[#d0d0d0]">
      Send Mail
    </button>
  </div>
);

interface DuckIcon {
  URL?: string;
}

interface DuckTopic {
  FirstURL?: string;
  Text?: string;
  Icon?: DuckIcon;
  Topics?: DuckTopic[];
}

interface DuckResponse {
  AbstractText?: string;
  AbstractURL?: string;
  Heading?: string;
  RelatedTopics?: DuckTopic[];
  Results?: DuckTopic[];
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  icon?: string;
}

const luckyQueries = [
  'breathing exercises',
  'elon musk',
  'flappy bird',
  'pizza',
  'northern lights',
  'apples',
  'squidward',
  'star wars',
  'air jordans',
  'pokemon'
];

const flattenTopics = (topics: DuckTopic[] = []): DuckTopic[] => {
  const flat: DuckTopic[] = [];
  topics.forEach((topic) => {
    if (Array.isArray(topic.Topics) && topic.Topics.length > 0) {
      flat.push(...flattenTopics(topic.Topics));
      return;
    }
    flat.push(topic);
  });
  return flat;
};

const toSearchResult = (item: DuckTopic): SearchResult | null => {
  if (!item.FirstURL || !item.Text) return null;
  const splitIndex = item.Text.indexOf(' - ');
  const title = splitIndex >= 0 ? item.Text.slice(0, splitIndex).trim() : item.Text;
  const snippet = splitIndex >= 0 ? item.Text.slice(splitIndex + 3).trim() : item.Text;
  return {
    title,
    snippet,
    url: item.FirstURL,
    icon: item.Icon?.URL ? `https://duckduckgo.com${item.Icon.URL}` : undefined
  };
};

const InternetExplorerContent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');

  const openInNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const runSearch = useCallback(async (rawQuery: string): Promise<SearchResult[]> => {
    const normalized = rawQuery.trim();
    if (!normalized) return [];
    setIsLoading(true);
    setErrorText('');
    setStatusText(`Searching DuckDuckGo for "${normalized}"...`);
    try {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(normalized)}&format=json&no_redirect=1&no_html=1`
      );
      if (!response.ok) {
        throw new Error(`DuckDuckGo returned ${response.status}`);
      }
      const payload = (await response.json()) as DuckResponse;
      const primary = (payload.Results ?? [])
        .map(toSearchResult)
        .filter((item): item is SearchResult => item !== null);
      const related = flattenTopics(payload.RelatedTopics ?? [])
        .map(toSearchResult)
        .filter((item): item is SearchResult => item !== null);
      const abstractResult =
        payload.AbstractURL && payload.AbstractText
          ? [{
              title: payload.Heading?.trim() || normalized,
              snippet: payload.AbstractText,
              url: payload.AbstractURL
            }]
          : [];
      const all = [...abstractResult, ...primary, ...related];
      const deduped = all.filter(
        (item, index, arr) => arr.findIndex((candidate) => candidate.url === item.url) === index
      );
      setResults(deduped);
      setSearched(true);
      setStatusText(`${deduped.length} result${deduped.length === 1 ? '' : 's'} found.`);
      return deduped;
    } catch {
      setResults([]);
      setSearched(true);
      setErrorText('Search failed. Try again in a moment.');
      setStatusText('DuckDuckGo request failed.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFeelingLucky = useCallback(async () => {
    if (isLoading) return;
    const randomQuery = luckyQueries[Math.floor(Math.random() * luckyQueries.length)];
    setQuery(randomQuery);
    const searchResults = await runSearch(randomQuery);
    if (searchResults.length === 0) {
      setStatusText(`No lucky results for "${randomQuery}". Try again.`);
      return;
    }
    const randomResult = searchResults[Math.floor(Math.random() * searchResults.length)];
    setStatusText(`Lucky query "${randomQuery}" loaded. Top pick: ${randomResult.title}`);
  }, [isLoading, runSearch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="bg-[#c0c0c0] win95-bevel-inset p-1 flex flex-col gap-1 w-full h-full min-h-0">
      <div className="win95-bevel bg-[#dfdfdf] p-1 flex items-center gap-1 text-[11px]">
        <button className="win95-bevel win95-button px-2 py-0.5" disabled>Back</button>
        <button className="win95-bevel win95-button px-2 py-0.5" disabled>Forward</button>
        <button className="win95-bevel win95-button px-2 py-0.5" disabled={!isLoading}>Stop</button>
        <button className="win95-bevel win95-button px-2 py-0.5" onClick={() => runSearch(query)} disabled={isLoading}>Refresh</button>
        <button
          className="win95-bevel win95-button px-2 py-0.5"
          onClick={() => {
            setQuery('');
            setResults([]);
            setSearched(false);
            setStatusText('Ready');
            setErrorText('');
          }}
        >
          Home
        </button>
      </div>

      <form className="win95-bevel bg-[#dfdfdf] p-1 flex items-center gap-2 text-[11px]" onSubmit={handleSubmit}>
        <span className="whitespace-nowrap">Address</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web"
          className="flex-1 bg-white px-2 py-1 win95-bevel-inset focus:outline-none text-[12px]"
        />
        <button type="submit" className="win95-bevel win95-button px-3 py-1" disabled={isLoading}>Go</button>
        <button
          type="button"
          onClick={() => {
            const first = results[0];
            if (first) openInNewTab(first.url);
          }}
          className="win95-bevel win95-button px-3 py-1"
          disabled={results.length === 0}
        >
          Open
        </button>
      </form>

      <div className="flex-1 bg-white win95-bevel-inset overflow-auto p-3 text-black">
        {!searched && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap gap-2 self-start text-[16px] underline sm:text-[18px]">
              <span className="cursor-pointer">Search</span>
              <span className="cursor-pointer">Images</span>
              <span className="cursor-pointer">News</span>
              <span className="cursor-pointer">Maps</span>
              <span className="cursor-pointer">More</span>
            </div>
            <h1 className="select-none text-5xl leading-none font-serif sm:text-7xl">
              <span className="text-[#1a4dcc]">G</span>
              <span className="text-[#d63a2f]">o</span>
              <span className="text-[#e2b32f]">o</span>
              <span className="text-[#1a4dcc]">g</span>
              <span className="text-[#219653]">l</span>
              <span className="text-[#d63a2f]">e</span>
            </h1>
            <form
              className="w-full max-w-[560px] flex flex-col items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(query);
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-black px-3 py-2 text-[16px] focus:outline-none"
                placeholder="Search Google"
              />
              <div className="flex flex-wrap justify-center gap-2">
                <button type="submit" className="win95-bevel win95-button px-4 py-1 text-sm" disabled={isLoading}>
                  Google Search
                </button>
                <button
                  type="button"
                  className="win95-bevel win95-button px-4 py-1 text-sm"
                  disabled={isLoading}
                  onClick={handleFeelingLucky}
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </form>
          </div>
        )}

        {searched && (
          <div className="flex flex-col gap-4">
            <div className="text-sm flex items-center gap-2">
              <span className="font-bold">Results for:</span>
              <span className="italic">{query || 'query'}</span>
              <button
                type="button"
                className="ml-auto win95-bevel win95-button px-2 py-0.5"
                onClick={() => {
                  setSearched(false);
                  setErrorText('');
                }}
              >
                Back to Search
              </button>
            </div>

            {errorText && <div className="text-red-700 text-sm">{errorText}</div>}

            {!errorText && results.length === 0 && (
              <div className="text-sm">No results found. Try another query.</div>
            )}

            {!errorText && results.length > 0 && (
              <div className="flex flex-col gap-3">
                {results.map((result) => (
                  <button
                    key={result.url}
                    type="button"
                    className="text-left p-2 hover:bg-blue-100 border border-transparent hover:border-blue-300"
                    onClick={() => openInNewTab(result.url)}
                  >
                    <div className="flex items-center gap-2">
                      {result.icon ? (
                        <img src={result.icon} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <span className="w-4 h-4 inline-block" />
                      )}
                      <span className="text-blue-800 underline">{result.title}</span>
                    </div>
                    <div className="text-[12px] text-green-700">{result.url}</div>
                    <p className="text-[12px] mt-1">{result.snippet}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="win95-bevel bg-[#dfdfdf] px-2 py-0.5 text-[11px]">
        {statusText}
      </div>
    </div>
  );
};

export default App;
