import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { BottomSheetModule } from "../../../angular";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BottomSheetModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
