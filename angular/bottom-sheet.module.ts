import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  BottomSheetComponent,
  SheetDismissDirective,
  SheetFooterDirective,
} from "./bottom-sheet.component";
import { BottomSheetProvider } from "./bottom-sheet.provider";

const declarations = [
  SheetFooterDirective,
  BottomSheetComponent,
  SheetDismissDirective,
];
const providers = [BottomSheetProvider];

@NgModule({
  imports: [CommonModule, PortalModule],
  declarations: [...declarations],
  providers: [...providers],
  entryComponents: [BottomSheetComponent],
  exports: [...declarations],
})
export class BottomSheetModule {}
