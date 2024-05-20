import { EPSILON, MAX_ITERATIONS, MARKER_COLOR, MIN_Y, MAX_X, MAX_Y, TRACE_INTERVAL } from "../../definitions/constants.js";
import { Widget } from "../../definitions/interfaces.js";
import { ClientPoint, Point, PlotPoint } from "../../definitions/types.js";
import { mapCanvasToPlot, mapClientToCanvas, mapPlotToCanvas, strokeLine } from "../../actions/mapping/index.js";
import { renderAxis, renderDiagonal, renderGrid, renderMarker, renderPlot } from "../../actions/rendering/index.js";
import { lerp } from "../common.js";

export function binarySearchSqrt(x: number, trace?: (p: PlotPoint) => void)
{
    let y0 = 0;
    let y1 = Math.max(1.0, x);

    for (let i = 0; i < MAX_ITERATIONS && Math.abs(y1 - y0) > EPSILON; ++i) {
        if (trace) trace(<PlotPoint>[y0, y1]);
        const ym = (y1 - y0)/2 + y0;
        if (ym*ym > x) y1 = ym;
        else if (ym*ym < x) y0 = ym;
        else {
            y0 = ym;
            y1 = ym;
        }
    }
    if (trace) trace(<PlotPoint>[y0, y1]);
    return y0;
}

export default class BinarySearchWidget implements Widget {
    private elem: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private trace: Array<PlotPoint> = [];
    private traceTime: number = 0;
    private xArg: number;
    private paused: boolean = true;

    constructor(id: string, xArg: number) {
        const sqrt = binarySearchSqrt;
        this.xArg = xArg;;
        this.elem = <HTMLCanvasElement>document.getElementById(id);
        this.ctx = <CanvasRenderingContext2D>this.elem.getContext("2d");
        sqrt(this.xArg, (s) => this.trace.push(s));

        this.elem.addEventListener("click", (e) => {
            const p = mapCanvasToPlot(this.elem, mapClientToCanvas(this.elem, <ClientPoint>[e.clientX, e.clientY]));
            this.xArg = p[0];
            this.trace.length = 0;
            this.traceTime = 0;
            sqrt(this.xArg, (s) => this.trace.push(s));
        });
        this.elem.addEventListener("mouseenter", () => this.paused = false);
        this.elem.addEventListener("mouseleave", () => this.paused = true);
   }

    update(dt: number) {
        if (!this.paused) {
            this.traceTime = (this.traceTime + dt)%(this.trace.length*TRACE_INTERVAL);
        }
    }

    render() {
        const index = Math.floor(this.traceTime / TRACE_INTERVAL);
        const t = this.traceTime % TRACE_INTERVAL / TRACE_INTERVAL;

        const y0 = lerp(this.trace[index][0], this.trace[(index + 1)%this.trace.length][0], t*t);
        const y1 = lerp(this.trace[index][1], this.trace[(index + 1)%this.trace.length][1], t*t);

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        renderGrid(this.ctx);
        renderAxis(this.ctx);
        renderPlot(this.ctx);
        renderDiagonal(this.ctx);

        this.ctx.fillStyle = "#50FF5064";
        const [rx0, ry0] = mapPlotToCanvas(this.elem, <PlotPoint>[0, y1]);
        const [rx1, ry1] = mapPlotToCanvas(this.elem, <PlotPoint>[MAX_X, y0]);
        this.ctx.fillRect(rx0, ry0, rx1 - rx0, ry1 - ry0);

        const p = <PlotPoint>[this.xArg, 0];
        renderMarker(this.ctx, p);

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px monospace";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(this.xArg.toFixed(3), ...<Point>mapPlotToCanvas(this.elem, p));
        this.ctx.textBaseline = "top";
        this.ctx.fillText(y0.toFixed(3), ...<Point>mapPlotToCanvas(this.elem, <PlotPoint>[0, y0]));
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText(y1.toFixed(3), ...<Point>mapPlotToCanvas(this.elem, <PlotPoint>[0, y1]));

        this.ctx.strokeStyle = MARKER_COLOR;
        strokeLine(this.ctx, <PlotPoint>[this.xArg, MIN_Y], <PlotPoint>[this.xArg, MAX_Y]);
    }

    containsClientY(clientY: number): boolean {
        const rect = this.elem.getBoundingClientRect();
        return rect.y <= clientY && clientY < rect.y + rect.height;
    }
}
