import { listen } from "./listen";

export type GestureEvent = MouseEvent | TouchEvent;

export function touchGestureListener(
  el: EventTarget,
  start: (start: {
    ev: GestureEvent;
    move: (listener: (ev: GestureEvent) => void) => void;
    end: (listener: (ev: GestureEvent) => void) => void;
    tap: (listener: (ev: GestureEvent) => void) => void;
    cancel: () => void;
  }) => void
) {
  let isDown = false;
  let isCanceled = false;
  let hasMoved = false;
  let moveListener: (ev: GestureEvent) => void;
  let endListener: (ev: GestureEvent) => void;
  let tapListener: (ev: GestureEvent) => void;
  let startTime = 0;
  const _startListener = listen(
    el,
    ["mousedown", "touchstart"],
    (startEv: GestureEvent) => {
      isDown = true;
      hasMoved = false;
      isCanceled = false;
      startTime = Date.now();
      start({
        ev: startEv,
        move: (listener) => (moveListener = listener),
        end: (listener) => (endListener = listener),
        tap: (listener) => (tapListener = listener),
        cancel: () => (isCanceled = true),
      });
    }
  );
  const _moveListener = listen(
    window,
    ["mousemove", "touchmove"],
    (moveEv: GestureEvent) => {
      if (isDown) {
        hasMoved = true;
      }
      if (!isCanceled && isDown && moveListener) {
        moveListener(moveEv);
      }
    }
  );
  const _endListener = listen(
    window,
    ["mouseup", "touchend"],
    (endEv: GestureEvent) => {
      const endTime = Date.now();
      if (!isCanceled && isDown && endListener) {
        endListener(endEv);
      }
      if (!hasMoved && endTime - startTime < 350 && tapListener) {
        tapListener(endEv);
      }
      isDown = false;
    }
  );
  return () => {
    _startListener();
    _moveListener();
    _endListener();
  };
}

export function getEventY(ev: GestureEvent) {
  return "touches" in ev ? ev.touches[0].clientY : ev.clientY;
}
export function getEventX(ev: GestureEvent) {
  return "touches" in ev ? ev.touches[0].clientX : ev.clientX;
}
