import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ExampleComponent } from "./example-sheet-component";

import { BottomSheetModule } from "../../../angular";

@NgModule({
  declarations: [AppComponent, ExampleComponent],
  imports: [BrowserModule, BottomSheetModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ExampleComponent]
})
export class AppModule {}
