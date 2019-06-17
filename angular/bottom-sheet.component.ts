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

@Directive({
  selector: "[sheetDismiss]"
})
export class SheetDismissDirective {
  @Input() sheetDismiss: any;
}

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
  @ViewChild("sheet") sheet: ElementRef<HTMLElement>;

  @Input() title: string;

  @ContentChild(SheetFooterDirective, { read: TemplateRef })
  footer: TemplateRef<any>;

  stops: number[];

  private swipeAwaySheet: SwipeAwaySheet;

  onClose: (value: any) => void;

  ngAfterViewInit(): void {
    this.swipeAwaySheet = new SwipeAwaySheet(this.sheet.nativeElement, {
      stops: this.stops,
      onClose: value => this.onClose(value)
    });
    this.swipeAwaySheet.open();
  }

  setValue(value: any) {
    this.swipeAwaySheet.setValue(value);
  }

  close(value: any) {
    this.swipeAwaySheet.close(undefined, value);
  }
}
