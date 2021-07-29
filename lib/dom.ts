export function* itemAndParents(el: HTMLElement) {
  do {
    yield el;
    el = el.parentElement;
  } while (el.parentElement);
}

export function isDescendantOf(el: Element, parentCandidate: Element) {
  do {
    el = el.parentElement || (el as any).host; // shadow dom support by crawling up to shadow parent
    if (el === parentCandidate) {
      return true;
    }
  } while (el.parentElement || (el as any).host);
  return false;
}

export function el(name: string, props: Record<string, string>) {
  const el = document.createElement(name);
  for (let prop of Object.keys(props)) {
    el[prop] = props[prop];
  }
  return el;
}
