import { Component, TemplateRef, ViewContainerRef } from "@angular/core";
import { BottomSheetProvider } from "../../../angular";

@Component({
  selector: "app-root",
  template: `
    <button type="button" (click)="openSheet(sheetTemplate)">Open</button>
    <ng-template #sheetTemplate>
      <div>foo</div>
      <div>foo</div>
      <div>foo</div>
      <div>foo</div>
      <div>foo</div>
      <div>foo</div>
    </ng-template>
  `,
  styles: []
})
export class AppComponent {
  constructor(
    private bottomSheet: BottomSheetProvider,
    vcRef: ViewContainerRef
  ) {
    bottomSheet.rootVcRef = vcRef;
  }

  openSheet<T>(template: TemplateRef<T>) {
    this.bottomSheet.create(template);
  }
}
