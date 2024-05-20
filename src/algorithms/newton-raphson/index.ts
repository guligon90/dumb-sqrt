import { EPSILON, MAX_ITERATIONS, MARKER_COLOR, MIN_X, MIN_Y, MAX_X, MAX_Y, TRACE_INTERVAL } from "../../definitions/constants";
import { Widget } from "../../definitions/interfaces";
import { ClientPoint, Point, PlotPoint } from "../../definitions/types";
import { mapCanvasToPlot, mapClientToCanvas, mapPlotToCanvas, strokeLine } from "../../actions/mapping";
import { renderAxis, renderDiagonal, renderGrid, renderMarker, renderPlot } from "../../actions/rendering";
import { lerp } from "../common";

export function newtonMethodSqrt(a: number, trace?: (x: number) => void)
{
    let x = a;
    for (let i = 0; i < MAX_ITERATIONS && Math.abs(x*x - a) > EPSILON; ++i) {
        if (trace) trace(x);
        x = x - (x*x - a)/(2*x);
    }
    if (trace) trace(x);
    return x;
}

export default class NewtonMethodWidget implements Widget {
    private elem: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private trace: Array<number> = [];
    private traceTime: number = 0;
    private xArg: number;
    private paused: boolean = true;

    constructor(id: string, xArg: number) {
        this.elem = <HTMLCanvasElement>document.getElementById(id);
        this.ctx = <CanvasRenderingContext2D>this.elem.getContext("2d");
        this.xArg = xArg;
        newtonMethodSqrt(this.xArg, (s) => this.trace.push(s))
        this.elem.addEventListener("click", (e) => {
            const p = mapCanvasToPlot(this.elem, mapClientToCanvas(this.elem, <ClientPoint>[e.clientX, e.clientY]));
            this.xArg = p[0];
            this.trace.length = 0;
            this.traceTime = 0;
            newtonMethodSqrt(this.xArg, (s) => this.trace.push(s));
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

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        renderGrid(this.ctx);
        renderAxis(this.ctx);
        renderPlot(this.ctx);
        renderDiagonal(this.ctx);

        const p = <PlotPoint>[this.xArg, 0];
        renderMarker(this.ctx, p);

        let y = lerp(this.trace[index], this.trace[(index + 1)%this.trace.length], t*t);
        this.ctx.strokeStyle = MARKER_COLOR;
        this.ctx.lineWidth = 5;
        strokeLine(this.ctx, <PlotPoint>[MIN_X, y], <PlotPoint>[MAX_X, y]);
        this.ctx.lineWidth = 1;

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px monospace";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(this.xArg.toFixed(3), ...<Point>mapPlotToCanvas(this.elem, p));
        this.ctx.textBaseline = "top";
        this.ctx.fillText(y.toFixed(3), ...<Point>mapPlotToCanvas(this.elem, <PlotPoint>[0, y]));

        this.ctx.strokeStyle = MARKER_COLOR;
        strokeLine(this.ctx, <PlotPoint>[this.xArg, MIN_Y], <PlotPoint>[this.xArg, MAX_Y]);
    }

    containsClientY(clientY: number): boolean {
        const rect = this.elem.getBoundingClientRect();
        return rect.y <= clientY && clientY < rect.y + rect.height;
    }
}
