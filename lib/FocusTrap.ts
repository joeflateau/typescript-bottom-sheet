export class FocusTrap {
  private previouslyActiveElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {}

  private onFocusOut = () => {
    this.focusFirstFocusable();
  };

  private focusFirstFocusable() {
    (this.container.querySelector("[tabindex]") as HTMLElement | null)?.focus();
  }

  activate() {
    this.previouslyActiveElement = document.activeElement as HTMLElement | null;
    this.focusFirstFocusable();
    this.container.addEventListener("focusout", this.onFocusOut);
  }

  deactivate() {
    this.container.removeEventListener("focusout", this.onFocusOut);
    this.previouslyActiveElement?.focus();
  }
}
