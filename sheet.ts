import { el } from "./lib/dom";
import { listen } from "./lib/listen";
import {
  GestureEvent,
  getEventX,
  getEventY,
  touchGestureListener,
} from "./lib/touch-gesture-listener";

export class SwipeAwaySheet {
  private backdropGestureListener: () => void;
  private touchStartListener: () => void;
  private translated = 0;
  backdrop: HTMLElement;
  sheetContent: HTMLElement;
  container: HTMLElement;
  value: any;

  constructor(
    private sheet: HTMLElement,
    private options: {
      attachTo?: HTMLElement;
      stops: number[];
      onClose: (value: any) => void;
    }
  ) {
    const backdrop = (this.backdrop = el("div", {
      className: "sheet-backdrop",
    }));

    this.sheetContent = sheet.querySelector(".sheet-content");
    this.container = el("div", { className: "sheet-container" });
    this.container.appendChild(backdrop);
    this.sheet.parentElement.insertBefore(this.container, this.sheet);
    this.container.appendChild(sheet);
    this.container.style.pointerEvents = "none";
    this.container.style.display = "none";

    this.backdropGestureListener = touchGestureListener(
      backdrop,
      ({ ev, tap }) => {
        ev.preventDefault();
        tap(() => {
          this.close();
        });
      }
    );

    this.touchStartListener = touchGestureListener(
      sheet,
      ({ ev: startEv, move, end, cancel }) => {
        const startTouch = {
          time: Date.now(),
          y: getEventY(startEv),
          x: getEventX(startEv),
        };
        let lastTouch = { time: Date.now(), y: getEventY(startEv) };
        let secondLastTouch: { time: number; y: number } = null;
        let axis: "vertical" | "horizontal" = null;

        const startEvPath =
          (startEv as { path?: Node[] }).path || startEv.composedPath();

        const pathToSheet = startEvPath.slice(
          0,
          startEvPath.indexOf(sheet) + 1
        );

        let shouldAllowScroll: boolean | null = null;

        move((moveEv: GestureEvent) => {
          const thisTouch = {
            time: Date.now(),
            y: getEventY(moveEv),
            x: getEventX(moveEv),
          };

          const direction = thisTouch.y > startTouch.y ? "down" : "up";
          axis =
            axis ||
            Math.abs(thisTouch.y - startTouch.y) >
              Math.abs(thisTouch.x - startTouch.x)
              ? "vertical"
              : "horizontal";

          if (shouldAllowScroll == null) {
            shouldAllowScroll = Array.from(pathToSheet)
              .filter(
                (el): el is HTMLElement =>
                  el instanceof HTMLElement &&
                  (el === sheet || pathToSheet.includes(sheet))
              )
              .some((el) => {
                if (el === document.body || el === document.documentElement) {
                  return false;
                }

                const style = window.getComputedStyle(el);
                const overflowY = style.getPropertyValue("overflow-y");
                const isScrollable =
                  overflowY === "auto" || overflowY === "scroll";
                const canScroll = el.scrollHeight > el.offsetHeight;

                if (!canScroll || !isScrollable) {
                  return false;
                }

                const height = el.clientHeight;
                const isAtBottom = el.scrollHeight - el.scrollTop <= height;
                const isAtTop = el.scrollTop <= 0;

                if (direction === "up" && !isAtBottom) {
                  return true;
                }
                if (direction === "down" && !isAtTop) {
                  return true;
                }
                return false;
              });
          }

          if (
            (shouldAllowScroll && this.translated === 0) ||
            axis === "horizontal"
          ) {
            cancel();
            return;
          }

          moveEv.preventDefault();

          const translated = this.translated + thisTouch.y - lastTouch.y;

          sheet.style.transition = `none`;
          backdrop.style.transition = "none";
          this.translateSheet(translated);

          secondLastTouch = lastTouch;
          lastTouch = thisTouch;
        });

        end((endEv: GestureEvent) => {
          if (secondLastTouch == null) {
            return;
          }

          const thisTouch = { time: Date.now() };

          const velocity =
            (lastTouch.y - secondLastTouch.y) /
            (thisTouch.time - secondLastTouch.time);

          const selectedStop = this.selectAStop(
            this.sheet.clientHeight - this.translated,
            velocity
          );

          if (selectedStop != null) {
            this.transitionTo(selectedStop);
          } else {
            this.close();
          }
        });
      }
    );
  }

  private selectAStop(y: number, velocity: number): number | null {
    if (Math.abs(velocity) < 0.15) {
      velocity = 0;
    }
    const stops = [this.sheet.clientHeight, ...(this.options.stops || [])];

    const stopsByDistanceFromY = stops.sort(
      (a, b) => Math.abs(a - y) - Math.abs(b - y)
    );

    const direction = velocity === 0 ? "none" : velocity > 0 ? "down" : "up";

    const candidateStops = stopsByDistanceFromY.filter((stop) =>
      direction === "none" ? true : direction === "up" ? stop > y : stop < y
    );

    if (candidateStops.length === 0 && direction === "up") {
      return this.sheet.clientHeight;
    }

    return candidateStops[0];
  }

  private translateSheet(y: number) {
    if (y < 0) {
      // trying to drag higher than it can go, should resist
      this.sheet.style.transform = `translate(-50%,0px)`;
      this.sheet.style.paddingBottom = `${-y / 2}px`;
    } else {
      // this is fine
      this.sheet.style.transform = `translate(-50%,${y}px)`;
      this.sheet.style.paddingBottom = `0px`;
    }
    this.translated = y;
    this.backdrop.style.opacity = String(
      1 - this.translated / this.sheet.clientHeight
    );
  }

  open() {
    this.container.style.display = "";
    this.container.style.pointerEvents = "";
    this.sheetContent.scrollTo(0, 0);
    const stops = [
      Math.min(this.sheet.clientHeight, window.innerHeight),
      ...(this.options.stops || []),
    ];
    const stop = stops[0] || window.innerHeight;
    this.transitionTo(stop);
  }

  transitionTo(overhangHeight: number) {
    if (overhangHeight === 0) {
      return this.close();
    }
    const translateHeight = Math.max(
      0,
      this.sheet.clientHeight - overhangHeight
    );
    this.sheet.style.transition = `350ms cubic-bezier(0.29, 0.1, 0.44, 1) all`;
    this.backdrop.style.transition = `350ms cubic-bezier(0.175, 0.885, 0.32, .975) opacity`;
    this.translateSheet(translateHeight);
    this.container.style.pointerEvents = "auto";
  }

  setValue(value: any) {
    this.value = value;
  }

  close(time: number = 350, value?: any) {
    time = Math.min(time, 350);
    this.sheet.style.transition = `${
      time * 0.6
    }ms cubic-bezier(0.35, 0.15, 0.85, .6) all`;
    this.backdrop.style.transition = `${
      time * 0.6
    }ms cubic-bezier(0.35, 0.15, 0.85, .6) opacity`;
    this.translateSheet(this.sheet.clientHeight);
    this.container.style.pointerEvents = "none";

    listen(this.sheet, [transitionEndEvent], () => {
      this.options.onClose(value === undefined ? this.value : value);
      this.container.style.display = "none";
    });
  }

  destroy() {
    this.touchStartListener();
    this.backdropGestureListener();
  }
}

const transitionEndEvent: string = (() => {
  var transitions = {
      transition: "transitionend",
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "otransitionend",
    },
    elem = document.createElement("div");

  for (var t in transitions) {
    if (typeof elem.style[t] !== "undefined") {
      return transitions[t];
    }
  }
})();
