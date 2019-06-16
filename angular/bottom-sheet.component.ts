import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  Directive,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Injectable,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Type
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
  @ViewChild("sheet") sheet: ElementRef<HTMLDivElement>;

  @Input() title: string;

  @ContentChild(SheetFooterDirective, { read: TemplateRef })
  footer: TemplateRef<any>;

  swipeAwaySheet: SwipeAwaySheet;

  ngAfterViewInit(): void {
    this.swipeAwaySheet = new SwipeAwaySheet(this.sheet.nativeElement, {
      stops: [270]
    });
    this.swipeAwaySheet.open();
  }

  open() {
    this.swipeAwaySheet.open();
  }

  close() {
    this.swipeAwaySheet.close();
  }
}

type BottomSheetContent<T> = TemplateRef<T> | Type<T>;

@Injectable()
export class BottomSheetProvider {
  rootVcRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}

  create<T>(templateRef: BottomSheetContent<T>) {
    if (this.rootVcRef == null) {
      throw new Error("rootVcRef is null, this should be set by app.component");
    }
    const factory = this.resolver.resolveComponentFactory(BottomSheetComponent);
    const instanceRef = this.rootVcRef.createComponent(
      factory,
      undefined,
      this.injector,
      this.resolveContent(templateRef)
    );
    const instance = instanceRef.instance;
    return instance;
  }

  private resolveContent<T>(content: BottomSheetContent<T>) {
    if (content instanceof TemplateRef) {
      return [content.createEmbeddedView(null).rootNodes];
    }
    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);
    return [[componentRef.location.nativeElement]];
  }
}
