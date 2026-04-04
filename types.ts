import React from 'react';

export interface WindowData {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  minSize?: { width: number; height: number };
  icon: React.ReactNode;
  content: React.ReactNode;
  showChrome?: boolean;
  showMenuBar?: boolean;
}

export type DesktopAppId =
  | 'my-computer'
  | 'about'
  | 'projects'
  | 'image-viewer'
  | 'certificates'
  | 'contact'
  | 'internet-explorer'
  | 'trash'
  | 'winamp'
  | 'paint'
  | 'solitaire'
  | 'minesweeper'
  | 'tetris';
