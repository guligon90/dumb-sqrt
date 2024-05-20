import { AXIS_COLOR, GRID_COLOR, GRID_STEP, MARKER_COLOR, MARKER_SIZE, MIN_X, MIN_Y, MAX_X, MAX_Y, STEP_Y } from "../../definitions/constants";
import { PlotPoint } from "../../definitions/types";
import { mapPlotToCanvas, strokeLine } from "../mapping";


export function renderGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = GRID_COLOR;

    for (let x = MIN_X; x <= MAX_X; x += GRID_STEP) {
        strokeLine(ctx, <PlotPoint>[x, MIN_Y], <PlotPoint>[x, MAX_Y]);
    }

    for (let y = MIN_Y; y <= MAX_Y; y += GRID_STEP) {
        strokeLine(ctx, <PlotPoint>[MIN_X, y], <PlotPoint>[MAX_X, y]);
    }
}

export function renderAxis(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = AXIS_COLOR;

    strokeLine(ctx, <PlotPoint>[MIN_X, 0.0], <PlotPoint>[MAX_X, 0.0]);
    strokeLine(ctx, <PlotPoint>[0.0, MIN_Y], <PlotPoint>[0.0, MAX_Y]);
}

export function renderMarker(ctx: CanvasRenderingContext2D, p: PlotPoint) {
    const [x, y] = mapPlotToCanvas(ctx.canvas, p);
    ctx.fillStyle = MARKER_COLOR;
    ctx.fillRect(x - MARKER_SIZE, y - MARKER_SIZE, 2*MARKER_SIZE, 2*MARKER_SIZE);
}

export function renderPlot(ctx: CanvasRenderingContext2D) {
    for (let y = 0.0; y <= MAX_Y; y += STEP_Y) {
        const x = y*y;
        renderMarker(ctx, <PlotPoint>[x, y]);
    }
}

export function renderDiagonal(ctx: CanvasRenderingContext2D)
{
    ctx.strokeStyle = MARKER_COLOR;
    const a = Math.min(MAX_X, MAX_Y);
    strokeLine(ctx, <PlotPoint>[0, 0], <PlotPoint>[a, a]);
}
