import { Component } from "@angular/core";
import { BottomSheetContext } from "../../../angular/bottom-sheet.provider";
@Component({
  selector: "app-example-component",
  template: `
    <ul class="sheet-list">
      <li
        class="sheet-list-item"
        (click)="context.dismiss('dismissed with value from component')"
      >
        Dismiss with value
      </li>
      <li class="sheet-list-item" (click)="context.dismiss()">
        Dismiss without value
      </li>
      <li
        class="sheet-list-item"
        (click)="
          context.setValue('setValue then dismiss from component');
          context.dismiss()
        "
      >
        setValue then dismiss
      </li>
      <li
        class="sheet-list-item"
        (click)="context.setValue('setValue wait for dismiss from component')"
      >
        setValue, don't dismiss (click backdrop to dismiss)
      </li>
    </ul>
  `
})
export class ExampleComponent {
  constructor(public context: BottomSheetContext) {}
}
