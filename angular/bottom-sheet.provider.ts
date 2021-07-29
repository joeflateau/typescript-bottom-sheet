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
      title,
      stops,
      vcRef = this.rootVcRef,
      props,
    }: {
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
    const factory = this.resolver.resolveComponentFactory(BottomSheetComponent);
    const instanceRef = vcRef.createComponent(factory, undefined, injector);

    const instance = instanceRef.instance;
    instance.title = title;
    instance.stops = stops;
    instance.contentPortal = this.resolveContent(
      templateRef,
      context,
      vcRef,
      injector
    );

    context.dismiss = (value) => instance.close(value);
    context.setValue = (value) => instance.setValue(value);

    return new Promise((resolve) => {
      instance.onClose = (value) => {
        resolve(value);
        instanceRef.destroy();
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
