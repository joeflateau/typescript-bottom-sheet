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

/**
 * Given an object of type T, return all the keys
 * of that object. Equivalent to Object.keys but with
 * stronger typing.
 *
 * @param o Object of type T
 */
export function keys<T>(o: T): StringKeys<T>[] {
  return Object.keys(o) as StringKeys<T>[];
}

type StringKeys<T> = Extract<keyof T, string>;

export function el<
  T extends keyof HTMLElementTagNameMap,
  S extends keyof HTMLElementTagNameMap[T]
>(name: T, props: Pick<HTMLElementTagNameMap[T], S>) {
  const el = document.createElement(name);
  for (const prop of keys(props)) {
    el[prop] = props[prop];
  }
  return el;
}
