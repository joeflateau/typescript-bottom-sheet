import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  BottomSheetComponent,
  SheetFooterDirective
} from "./bottom-sheet.component";

const declarations = [SheetFooterDirective, BottomSheetComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...declarations],
  exports: [...declarations]
})
export class BottomSheetModule {}
