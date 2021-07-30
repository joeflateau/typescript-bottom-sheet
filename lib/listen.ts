export function listen<TEvent extends Event>(
  el: EventTarget,
  eventNames: string[],
  listener: (ev: TEvent) => any
): () => void {
  eventNames.forEach((eventName) => {
    el.addEventListener(
      eventName,
      listener as (ev: Event) => any,
      supportsPassive ? { passive: false } : false
    );
  });
  return () => {
    eventNames.forEach((eventName) => {
      el.removeEventListener(eventName, listener as (ev: Event) => any);
    });
  };
}

function getSupportsPassive() {
  let supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    });
    window.addEventListener("test", () => {}, opts);
  } catch (e) {}
  return supportsPassive;
}

let supportsPassive = getSupportsPassive();
