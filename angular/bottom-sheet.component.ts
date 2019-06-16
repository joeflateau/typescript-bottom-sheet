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
  @ViewChild("sheet") sheet: ElementRef<HTMLDivElement>;

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

  close(value: any) {
    this.swipeAwaySheet.close(undefined, value);
  }
}

type BottomSheetContent<T> = TemplateRef<T> | Type<T>;

@Injectable()
export class BottomSheetContext {
  public dismiss: (value: any) => void;
  constructor() {}
}

@Injectable()
export class BottomSheetProvider {
  rootVcRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}

  async show<T>(
    templateRef: BottomSheetContent<T>,
    options: { title: string; stops: number[] }
  ): Promise<any> {
    if (this.rootVcRef == null) {
      throw new Error("rootVcRef is null, this should be set by app.component");
    }
    const factory = this.resolver.resolveComponentFactory(BottomSheetComponent);
    const context = new BottomSheetContext();
    const instanceRef = this.rootVcRef.createComponent(
      factory,
      undefined,
      Injector.create({
        providers: [
          {
            provide: BottomSheetContext,
            useValue: context
          }
        ],
        parent: this.injector
      }),
      this.resolveContent(templateRef, context)
    );
    const instance = instanceRef.instance;
    instance.title = options.title;
    instance.stops = options.stops;
    context.dismiss = value => instance.close(value);
    return new Promise(resolve => {
      instance.onClose = resolve;
    });
  }

  private resolveContent<T>(
    content: BottomSheetContent<T>,
    context: BottomSheetContext
  ) {
    if (content instanceof TemplateRef) {
      return [
        content.createEmbeddedView({
          $implicit: context
        } as any).rootNodes
      ];
    }
    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);
    return [[componentRef.location.nativeElement]];
  }
}
