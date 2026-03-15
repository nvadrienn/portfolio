import React, { useEffect, useRef } from 'react';

interface PlaylistItem {
  url: string;
  artist?: string;
  title?: string;
  duration?: number;
}

interface WebampTrack {
  url: string;
  duration?: number;
  metaData: {
    artist: string;
    title: string;
  };
}

interface WebampInstance {
  renderWhenReady: (container: HTMLElement) => Promise<void>;
  dispose: () => void;
  onClose?: (cb: () => void) => () => void;
  onMinimize?: (cb: () => void) => () => void;
}

interface WebampConstructor {
  new (options: {
    initialSkin?: { url: string };
    initialTracks?: WebampTrack[];
    windowLayout?: {
      main?: { position: { left: number; top: number } };
      equalizer?: { position: { left: number; top: number } };
      playlist?: { position: { left: number; top: number } };
    };
  }): WebampInstance;
  browserIsSupported?: () => boolean;
}

declare global {
  interface Window {
    Webamp?: WebampConstructor;
  }
}

const WEBAMP_SCRIPT_ID = 'webamp-script';
const WEBAMP_SCRIPT_URL = 'https://unpkg.com/webamp/built/webamp.bundle.min.js';
const SKIN_URL = '/base-2.91.wsz';

const loadPlaylist = async (): Promise<PlaylistItem[]> => {
  try {
    const response = await fetch('/music/playlist.json', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = (await response.json()) as PlaylistItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const ensureWebampScript = async (): Promise<void> => {
  if (window.Webamp) return;

  const existing = document.getElementById(WEBAMP_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    await new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Webamp runtime.')), { once: true });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = WEBAMP_SCRIPT_ID;
    script.src = WEBAMP_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Webamp runtime.'));
    document.body.appendChild(script);
  });
};

interface WebampPlayerProps {
  isMinimized: boolean;
  x: number;
  y: number;
  zIndex: number;
  onPlayerClose: () => void;
  onPlayerMinimize: () => void;
}

const WebampPlayerImpl: React.FC<WebampPlayerProps> = ({ isMinimized, x, y, zIndex, onPlayerClose, onPlayerMinimize }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webampRef = useRef<WebampInstance | null>(null);
  const applyWebampRootState = () => {
    const webampRoot = document.getElementById('webamp');
    if (!webampRoot) return;
    const mainWindow = document.querySelector('#webamp #main-window') as HTMLElement | null;
    const equalizerWindow = document.querySelector('#webamp #equalizer-window') as HTMLElement | null;
    const playlistWindow = document.querySelector('#webamp #playlist-window') as HTMLElement | null;

    webampRoot.style.display = 'block';
    webampRoot.style.position = 'absolute';
    webampRoot.style.left = `${x}px`;
    webampRoot.style.top = `${y}px`;
    webampRoot.style.zIndex = String(isMinimized ? 1 : zIndex);
    webampRoot.style.visibility = isMinimized ? 'hidden' : 'visible';
    webampRoot.style.pointerEvents = isMinimized ? 'none' : 'auto';

    // Some Webamp panes can remain visible after minimize; force all panes hidden/shown together.
    const paneDisplay = isMinimized ? 'none' : '';
    if (mainWindow) mainWindow.style.display = paneDisplay;
    if (equalizerWindow) equalizerWindow.style.display = paneDisplay;
    if (playlistWindow) playlistWindow.style.display = paneDisplay;
  };

  useEffect(() => {
    let mounted = true;
    let unsubscribeClose: (() => void) | undefined;
    let unsubscribeMinimize: (() => void) | undefined;

    const init = async () => {
      await ensureWebampScript();
      if (!mounted || !containerRef.current || !window.Webamp) return;
      if (window.Webamp.browserIsSupported && !window.Webamp.browserIsSupported()) return;

      const playlist = await loadPlaylist();
      const tracks: WebampTrack[] = playlist.map((track) => ({
        metaData: {
          artist: track.artist ?? 'Unknown Artist',
          title: track.title ?? track.url.split('/').pop() ?? 'Unknown Track',
        },
        url: track.url,
        duration: track.duration,
      }));

      const webamp = new window.Webamp({
        initialSkin: { url: SKIN_URL },
        initialTracks: tracks,
        windowLayout: {
          main: { position: { left: 0, top: 0 } },
          equalizer: { position: { left: 0, top: 116 } },
          playlist: { position: { left: 0, top: 232 } },
        },
      });

      webampRef.current = webamp;
      if (webamp.onClose) {
        unsubscribeClose = webamp.onClose(() => {
          onPlayerClose();
        });
      }
      if (webamp.onMinimize) {
        unsubscribeMinimize = webamp.onMinimize(() => {
          onPlayerMinimize();
        });
      }

      await webamp.renderWhenReady(containerRef.current);
      applyWebampRootState();
    };

    init().catch((err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to start Webamp.';
      console.error(message);
    });

    return () => {
      mounted = false;
      if (unsubscribeClose) unsubscribeClose();
      if (unsubscribeMinimize) unsubscribeMinimize();
      if (webampRef.current) {
        webampRef.current.dispose();
        webampRef.current = null;
      }
    };
  }, [onPlayerClose, onPlayerMinimize]);

  useEffect(() => {
    applyWebampRootState();
  }, [isMinimized, x, y, zIndex]);

  return <div ref={containerRef} className="absolute inset-0 bg-transparent overflow-visible pointer-events-none" />;
};

export default WebampPlayerImpl;
