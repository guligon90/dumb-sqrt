export type Color = string;
export type PlotPoint   = [number, number] & {'plot coordinate system': {}};
export type CanvasPoint = [number, number] & {'canvas coordinate system determined by canvas.width and canvas.height': {}};
export type ClientPoint = [number, number] & {'client coordinate system determined by the actual size of the element': {}};
export type Point       = [number, number];
