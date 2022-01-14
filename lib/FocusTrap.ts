export class FocusTrap {
  private static currentTrap: FocusTrap | null = null;

  private restoreFocusTo: FocusTrap | HTMLElement | null = null;
  private mostRecentlyFocusedElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {}

  private static onTrappedFocusIn = (ev: FocusEvent) => {
    if (FocusTrap.currentTrap == null) {
      throw new Error(
        "this event handler should not be registered when there is no current trap"
      );
    }
    const targetEl = ev.target as HTMLElement;
    if (FocusTrap.currentTrap.container.contains(targetEl)) {
      FocusTrap.currentTrap.mostRecentlyFocusedElement = targetEl;
    } else {
      FocusTrap.currentTrap.focus();
    }
  };

  private focus() {
    if (this.mostRecentlyFocusedElement == null) {
      const focusableElements = (
        Array.from(
          this.container.querySelectorAll(
            'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
          )
        ) as HTMLElement[]
      ).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );

      this.mostRecentlyFocusedElement = focusableElements[0];
    }

    // force the browser to let us re-focus a previously focused element
    // necessary to focus ion-button
    if (!this.mostRecentlyFocusedElement.hasAttribute("tabindex")) {
      this.mostRecentlyFocusedElement.setAttribute("tabindex", "0");
    }

    this.mostRecentlyFocusedElement?.focus();
  }

  activate() {
    if (FocusTrap.currentTrap == null) {
      document.addEventListener("focusin", FocusTrap.onTrappedFocusIn);
      this.restoreFocusTo = document.activeElement as HTMLElement | null;
    } else {
      this.restoreFocusTo = FocusTrap.currentTrap;
    }
    FocusTrap.currentTrap = this;
    this.focus();
  }

  deactivate() {
    if (this.restoreFocusTo instanceof FocusTrap) {
      FocusTrap.currentTrap = this.restoreFocusTo;
      this.restoreFocusTo.focus();
    } else {
      document.removeEventListener("focusin", FocusTrap.onTrappedFocusIn);
      FocusTrap.currentTrap = null;
      this.restoreFocusTo?.focus();
    }
  }
}
