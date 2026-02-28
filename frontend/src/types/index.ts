export type Point = [number, number, number?]; // [x, y, pressure?]

export interface Path {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface TextShape {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

export interface BasicShape {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type AnyShape = Path | StickyNote | TextShape | BasicShape;

export interface Cursor {
  x: number;
  y: number;
  name: string;
  color: string;
}

export interface PingEvent {
  id: string;
  x: number;
  y: number;
  timestamp: number;
  userId: string;
}
