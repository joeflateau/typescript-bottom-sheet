import { Component, ViewContainerRef } from "@angular/core";
import { BottomSheetContent, BottomSheetProvider } from "../../../angular";
import { ExampleComponent } from "./example-sheet-component";

@Component({
  selector: "app-root",
  templateUrl: "app.html",
  styles: [],
})
export class AppComponent {
  lastValue: any;
  lastMessage: string;

  component = ExampleComponent;

  constructor(
    private bottomSheet: BottomSheetProvider,
    vcRef: ViewContainerRef
  ) {
    bottomSheet.rootVcRef = vcRef;
  }

  async openSheet<TContext, TProps>(
    content: BottomSheetContent<TContext, TProps>
  ) {
    this.lastMessage = "";
    this.lastValue = "";
    const value = await this.bottomSheet.show(content, {
      title: "Sheet Title",
      stops: [270],
    });
    this.lastValue = value;
  }

  print(message: string) {
    this.lastMessage = message;
  }
}
