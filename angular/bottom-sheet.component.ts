import { CdkPortalOutletAttachedRef, Portal } from "@angular/cdk/portal";
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { SwipeAwaySheet } from "../sheet";
import { BottomSheetContext } from "./BottomSheetContext";

@Directive({
  selector: "[sheetFooter]",
})
export class SheetFooterDirective {}

@Directive({
  selector: "[sheetDismiss]",
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
        <ng-template
          [cdkPortalOutlet]="contentPortal"
          (attached)="attached($event)"
        ></ng-template>
      </div>
      <div class="sheet-footer" *ngIf="footer">
        <ng-container *ngTemplateOutlet="footer"></ng-container>
      </div>
    </div>
  `,
})
export class BottomSheetComponent<TProps> implements AfterViewInit {
  @ViewChild("sheet") sheet: ElementRef<HTMLElement>;

  @Input() title?: string;

  @ContentChild(SheetFooterDirective, { read: TemplateRef })
  footer: TemplateRef<any>;

  stops: number[];

  contentPortal: Portal<TProps>;

  private swipeAwaySheet: SwipeAwaySheet;

  constructor(private context: BottomSheetContext<TProps>) {}

  onClose: (value: any) => void;

  attached(ref: CdkPortalOutletAttachedRef) {
    if (this.context.props && ref instanceof ComponentRef) {
      Object.entries(this.context.props).forEach(([key, value]) => {
        ref.instance[key] = value;
      });
    }
  }

  ngAfterViewInit(): void {
    this.swipeAwaySheet = new SwipeAwaySheet(this.sheet.nativeElement, {
      stops: this.stops,
      onClose: (value) => this.onClose(value),
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
