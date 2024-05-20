import BinarySearchWidget from "./algorithms/binary-search";
import NewtonMethodWidget from "./algorithms/newton-raphson";
import { Widget } from "./definitions/interfaces";

let widgets: Widget[] = [
    new BinarySearchWidget("app-binary-search", 9),
    new NewtonMethodWidget("app-newton-method", 9)
];

let prevTime: DOMHighResTimeStamp | null = null;

function loop(time: DOMHighResTimeStamp) {
    if (prevTime !== null) {
        const deltaTime = (time - prevTime)*0.001;
        for (let widget of widgets) {
            widget.update(deltaTime);
            widget.render();
        }
    }
    prevTime = time;
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
