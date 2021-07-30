export function listen(
  el: EventTarget,
  eventNames: string[],
  listener: (ev: Event) => any
): () => void {
  eventNames.forEach((eventName) => {
    el.addEventListener(
      eventName,
      listener,
      supportsPassive ? { passive: false } : false
    );
  });
  return () => {
    eventNames.forEach((eventName) => {
      el.removeEventListener(eventName, listener);
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
