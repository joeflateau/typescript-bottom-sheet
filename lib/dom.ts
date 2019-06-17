export function* itemAndParents(el: HTMLElement) {
  do {
    yield el;
    el = el.parentElement;
  } while (el.parentElement);
}

export function isDescendantOf(el: HTMLElement, parentCandidate: HTMLElement) {
  do {
    el = el.parentElement;
    if (el === parentCandidate) {
      return true;
    }
  } while (el.parentElement);
  return false;
}

export function el(name: string, props: Record<string, string>) {
  const el = document.createElement(name);
  for (let prop of Object.keys(props)) {
    el[prop] = props[prop];
  }
  return el;
}
