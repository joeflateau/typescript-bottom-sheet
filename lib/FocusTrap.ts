export class FocusTrap {
  private static currentTrap: FocusTrap | null = null;

  private restoreFocusOutside: FocusTrap | HTMLElement | null = null;
  private mostRecentlyFocusedElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {}

  private static onTrappedFocusIn = (ev: FocusEvent) => {
    if (FocusTrap.currentTrap == null) {
      throw new Error(
        "this event handler should not be registered when there is no current trap"
      );
    }
    if (!FocusTrap.currentTrap.container.contains(ev.target as HTMLElement)) {
      FocusTrap.currentTrap.focusFirstFocusable();
    }
  };

  private focusFirstFocusable() {
    const focusable = (
      Array.from(
        this.container.querySelectorAll(
          'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[]
    ).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );
    focusable[0]?.focus();
  }

  activate() {
    const activeElement = document.activeElement as HTMLElement | null;
    if (FocusTrap.currentTrap == null) {
      document.addEventListener("focusin", FocusTrap.onTrappedFocusIn);
      this.restoreFocusOutside = activeElement;
    } else {
      FocusTrap.currentTrap.mostRecentlyFocusedElement = activeElement;
      this.restoreFocusOutside = FocusTrap.currentTrap;
    }
    FocusTrap.currentTrap = this;
    this.focusFirstFocusable();
  }

  deactivate() {
    if (this.restoreFocusOutside instanceof FocusTrap) {
      FocusTrap.currentTrap = this.restoreFocusOutside;
      this.restoreFocusOutside.mostRecentlyFocusedElement?.focus();
    } else {
      document.removeEventListener("focusin", FocusTrap.onTrappedFocusIn);
      FocusTrap.currentTrap = null;
      this.restoreFocusOutside?.focus();
    }
  }
}
