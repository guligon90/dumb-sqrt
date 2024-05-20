import { Color } from "./types.js";

export const EPSILON: number = 1e-6;
export const MAX_ITERATIONS: number = 15;
export const MARKER_COLOR: Color = "#FF4040";
export const AXIS_COLOR: Color = MARKER_COLOR;
export const GRID_COLOR: Color = "#4040FF90"
export const GRID_STEP: number = 1;
export const MARKER_SIZE: number = 5
export const MIN_X: number = -1.0;
export const MAX_X: number =  20.0;
export const MIN_Y: number = -1.0;
export const MAX_Y: number =  10.0;
export const STEP_Y_COUNT: number = 200
export const STEP_Y: number = (MAX_Y - MIN_Y)/STEP_Y_COUNT;
export const TRACE_INTERVAL: number = 0.5;
