import { Component, TemplateRef, ViewContainerRef } from "@angular/core";
import { BottomSheetProvider } from "../../../angular";

@Component({
  selector: "app-root",
  templateUrl: "app.html",
  styles: []
})
export class AppComponent {
  constructor(
    private bottomSheet: BottomSheetProvider,
    vcRef: ViewContainerRef
  ) {
    bottomSheet.rootVcRef = vcRef;
  }

  async openSheet<T>(template: TemplateRef<T>) {
    const value = await this.bottomSheet.show(template, {
      title: "Sheet Title",
      stops: [270]
    });
    console.log({ value });
  }
}
