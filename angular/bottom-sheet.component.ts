import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  Directive,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { SwipeAwaySheet } from "../sheet";

@Directive({
  selector: "[sheetFooter]"
})
export class SheetFooterDirective {}

@Component({
  selector: "bottom-sheet",
  template: `
    <div class="sheet" #sheet>
      <div class="sheet-title" *ngIf="title">{{ title }}</div>
      <div class="sheet-content">
        <ng-content></ng-content>
      </div>
      <div class="sheet-footer" *ngIf="footer">
        <ng-container *ngTemplateOutlet="footer"></ng-container>
      </div>
    </div>
  `
})
export class BottomSheetComponent implements AfterViewInit {
  @ViewChild("sheet", { static: true }) sheet: ElementRef<HTMLDivElement>;

  @Input() title: string;

  @ContentChild(SheetFooterDirective, { read: TemplateRef, static: true })
  footer: TemplateRef<any>;

  swipeAwaySheet: SwipeAwaySheet;

  ngAfterViewInit(): void {
    this.swipeAwaySheet = new SwipeAwaySheet(this.sheet.nativeElement, {
      stops: [270]
    });
  }
}
