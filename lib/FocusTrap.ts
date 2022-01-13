export class FocusTrap {
  private restoreFocusToElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {}

  private onTrappedFocusIn = (ev: FocusEvent) => {
    if (!this.container.contains(ev.target as HTMLElement)) {
      this.focusFirstFocusable();
    }
  };

  private focusFirstFocusable() {
    (this.container.querySelector("[tabindex]") as HTMLElement | null)?.focus();
  }

  activate() {
    this.restoreFocusToElement = document.activeElement as HTMLElement | null;
    this.focusFirstFocusable();
    document.addEventListener("focusin", this.onTrappedFocusIn);
  }

  deactivate() {
    document.removeEventListener("focusin", this.onTrappedFocusIn);
    this.restoreFocusToElement?.focus();
  }
}
