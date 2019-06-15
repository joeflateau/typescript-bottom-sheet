import {
  touchGestureListener,
  GestureEvent,
  getEventY,
  getEventX
} from "./touch-gesture-listener";
import { itemAndParents, isDescendantOf } from "./dom";

export class SwipeAwaySheet {
  private backdropGestureListener: () => void;
  private touchStartListener: () => void;
  private translated = 0;

  constructor(
    private container: HTMLElement,
    private sheet: HTMLElement,
    private sheetContent: HTMLElement,
    private backdrop: HTMLElement,
    private stops?: number[]
  ) {
    this.backdropGestureListener = touchGestureListener(backdrop, ({ tap }) => {
      tap(() => {
        this.close();
      });
    });

    this.touchStartListener = touchGestureListener(
      sheet,
      ({ ev: startEv, move, end, cancel }) => {
        const startTouch = {
          time: Date.now(),
          y: getEventY(startEv),
          x: getEventX(startEv)
        };
        let lastTouch = { time: Date.now(), y: getEventY(startEv) };
        let secondLastTouch: { time: number; y: number } = null;
        let axis: "vertical" | "horizontal" = null;

        move((moveEv: GestureEvent) => {
          const thisTouch = {
            time: Date.now(),
            y: getEventY(moveEv),
            x: getEventX(moveEv)
          };

          const direction = thisTouch.y > startTouch.y ? "down" : "up";
          axis =
            axis ||
            Math.abs(thisTouch.y - startTouch.y) >
              Math.abs(thisTouch.x - startTouch.x)
              ? "vertical"
              : "horizontal";

          const shouldAllowScroll = Array.from(
            itemAndParents(startEv.target as HTMLElement)
          )
            .filter(el => el === sheet || isDescendantOf(el, sheet))
            .some(el => {
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

        end((endEv: TouchEvent | MouseEvent) => {
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
    const stops = [this.sheet.clientHeight, ...(this.stops || [])];

    const stopsByDistanceFromY = stops.sort(
      (a, b) => Math.abs(a - y) - Math.abs(b - y)
    );

    const direction = velocity === 0 ? "none" : velocity > 0 ? "down" : "up";

    const candidateStops = stopsByDistanceFromY.filter(stop =>
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
    this.sheetContent.scrollTo(0, 0);
    const stop = this.stops != null ? this.stops[0] : 0;
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

  close(time: number = 350) {
    time = Math.min(time, 350);
    this.sheet.style.transition = `${time *
      0.6}ms cubic-bezier(0.35, 0.15, 0.85, .6) all`;
    this.backdrop.style.transition = `${time *
      0.6}ms cubic-bezier(0.35, 0.15, 0.85, .6) opacity`;
    this.translateSheet(this.sheet.clientHeight);
    this.container.style.pointerEvents = "none";
  }

  destroy() {
    this.touchStartListener();
    this.backdropGestureListener();
  }
}
