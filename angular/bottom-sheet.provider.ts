import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { BottomSheetComponent } from "./bottom-sheet.component";
import { BottomSheetContext } from "./BottomSheetContext";

export type BottomSheetContent<TProps> =
  | TemplateRef<{ $implicit: BottomSheetContext<Partial<TProps>> }>
  | Type<TProps>;

@Injectable()
export class BottomSheetProvider {
  rootVcRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}

  async show<TProps>(
    templateRef: BottomSheetContent<TProps>,
    {
      height,
      maxHeight = `calc(100vh - env(safe-area-inset-top))`,
      title,
      stops,
      vcRef = this.rootVcRef,
      props,
    }: {
      height?: string | number;
      maxHeight?: string | number;
      title?: string;
      stops: number[];
      vcRef?: ViewContainerRef;
      props?: Partial<TProps>;
    }
  ): Promise<any> {
    if (vcRef == null) {
      throw new Error(
        "vcRef is null, either set the rootVcRef or pass one with the show method"
      );
    }

    const context = new BottomSheetContext(props);
    const injector = Injector.create({
      providers: [{ provide: BottomSheetContext, useValue: context }],
      parent: this.injector,
    });
    const sheetWrapperFactory =
      this.resolver.resolveComponentFactory(BottomSheetComponent);
    const sheetWrapperInstanceRef = vcRef.createComponent(
      sheetWrapperFactory,
      undefined,
      injector
    );
    const sheetContent = this.resolveContent(
      templateRef,
      context,
      vcRef,
      injector
    );

    const sheetWrapperInstance = sheetWrapperInstanceRef.instance;
    sheetWrapperInstance.title = title;
    sheetWrapperInstance.height =
      typeof height === "number" ? `${height}px` : height;
    sheetWrapperInstance.maxHeight =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    sheetWrapperInstance.stops = stops;
    sheetWrapperInstance.contentPortal = sheetContent;

    context.dismiss = (value) => sheetWrapperInstance.close(value);
    context.setValue = (value) => sheetWrapperInstance.setValue(value);

    return new Promise((resolve) => {
      sheetWrapperInstance.onClose = (value) => {
        resolve(value);
        sheetWrapperInstanceRef.destroy();
      };
    });
  }

  private resolveContent<TProps>(
    content: BottomSheetContent<TProps>,
    context: BottomSheetContext<TProps>,
    viewContainerRef: ViewContainerRef,
    injector: Injector
  ) {
    if (content instanceof TemplateRef) {
      return new TemplatePortal(content, viewContainerRef, {
        $implicit: context,
      });
    }

    return new ComponentPortal(content, undefined, injector, this.resolver);
  }
}
