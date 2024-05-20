import { MIN_X, MIN_Y, MAX_X, MAX_Y } from "../../definitions/constants";
import { CanvasPoint, ClientPoint, Point, PlotPoint } from "../../definitions/types";

// Canvas has two sizes:
// 1. *Canvas Size*. `[canvas.width, canvas.height]` which is set via the correspoding properties: `<canvas width='800' height='600'>`. This is the logical resolution of the canvas that is used by all of the drawing method of the canvas.
// 2. *Client Size*. The actual size of the DOM element. You can get this size by doing canvas.getBoundingClientRect().
//
// All of the mouse events are in Client coordinates. This function maps the Client coordinates to Canvas coordinates.
export function mapClientToCanvas(canvas: HTMLCanvasElement, p: ClientPoint): CanvasPoint {
    const [x0, y0] = p;
    const rect = canvas.getBoundingClientRect();
    const x = (x0 - rect.left) / (rect.right - rect.left) * canvas.width;
    const y = (y0 - rect.top) / (rect.bottom - rect.top) * canvas.height;
    return <CanvasPoint>[x, y];
}

export function mapCanvasToPlot(canvas: HTMLCanvasElement, p: CanvasPoint): PlotPoint {
    // x ∈ [0.0 .. ctx.canvas.width] => x ∈ [0.0 .. 1.0] => x ∈ [MIN_X .. MAX_X]
    const [x0, y0] = p;
    const x = x0 / canvas.width * (MAX_X - MIN_X) + MIN_X;
    const y = (y0 - canvas.height) * -1.0 / canvas.height * (MAX_Y - MIN_Y) + MIN_Y;
    return <PlotPoint>[x, y];
}

export function mapPlotToCanvas(canvas: HTMLCanvasElement, p: PlotPoint): CanvasPoint {
    // x ∈ [MIN_X .. MAX_X] => x ∈ [0.0 .. 1.0] => x ∈ [0.0 .. ctx.canvas.width]
    const [x0, y0] = p;
    const x = (x0 - MIN_X) / (MAX_X - MIN_X) * canvas.width;
    const y = canvas.height - (y0 - MIN_Y) / (MAX_Y - MIN_Y) * canvas.height;
    return <CanvasPoint>[x, y];
}

export function strokeLine(ctx: CanvasRenderingContext2D, p1: PlotPoint, p2: PlotPoint)
{
    ctx.beginPath();
    ctx.moveTo(...<Point>mapPlotToCanvas(ctx.canvas, p1));
    ctx.lineTo(...<Point>mapPlotToCanvas(ctx.canvas, p2));
    ctx.stroke();
}
