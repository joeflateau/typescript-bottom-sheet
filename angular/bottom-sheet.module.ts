import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  SheetFooterDirective,
  BottomSheetComponent,
  SheetDismissDirective
} from "./bottom-sheet.component";
import { BottomSheetProvider } from "./bottom-sheet.provider";

const declarations = [
  SheetFooterDirective,
  BottomSheetComponent,
  SheetDismissDirective
];
const providers = [BottomSheetProvider];

@NgModule({
  imports: [BrowserModule],
  declarations: [...declarations],
  providers: [...providers],
  entryComponents: [BottomSheetComponent],
  exports: [...declarations]
})
export class BottomSheetModule {}
