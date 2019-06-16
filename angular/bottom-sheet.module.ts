import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  BottomSheetComponent,
  SheetFooterDirective,
  BottomSheetProvider,
  SheetDismissDirective
} from "./bottom-sheet.component";

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
