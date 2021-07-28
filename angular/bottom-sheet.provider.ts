import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { BottomSheetComponent } from "./bottom-sheet.component";

export type BottomSheetContent<T> = TemplateRef<T> | Type<T>;

@Injectable()
export class BottomSheetContext<T> {
  public dismiss: (value?: any) => void;
  public setValue: (value?: any) => void;
  constructor(public props: Partial<T>) {}
}

@Injectable()
export class BottomSheetProvider {
  rootVcRef: ViewContainerRef;
  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}
  async show<T, TProps>(
    templateRef: BottomSheetContent<T>,
    {
      title,
      stops,
      vcRef = this.rootVcRef,
      props,
    }: {
      title: string;
      stops: number[];
      vcRef?: ViewContainerRef;
      props?: TProps;
    }
  ): Promise<any> {
    if (vcRef == null) {
      throw new Error(
        "rootVcRef is null, this should be set before calling show"
      );
    }
    const factory = this.resolver.resolveComponentFactory(BottomSheetComponent);
    const context = new BottomSheetContext(props);
    const instanceRef = vcRef.createComponent(
      factory,
      undefined,
      undefined,
      this.resolveContent(templateRef, context)
    );

    const instance = instanceRef.instance;
    instance.title = title;
    instance.stops = stops;

    context.dismiss = (value) => instance.close(value);
    context.setValue = (value) => instance.setValue(value);

    return new Promise((resolve) => {
      instance.onClose = (value) => {
        resolve(value);
        instanceRef.destroy();
      };
    });
  }

  private resolveContent<T>(
    content: BottomSheetContent<T>,
    context: BottomSheetContext<T>
  ) {
    if (content instanceof TemplateRef) {
      return [
        content.createEmbeddedView({
          $implicit: context,
        } as any).rootNodes,
      ];
    }

    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(
      Injector.create({
        providers: [{ provide: BottomSheetContext, useValue: context }],
        parent: this.injector,
      })
    );
    if (context.props) {
      (Object.keys(context.props) as (keyof T)[]).forEach((key) => {
        componentRef.instance[key] = context.props[key];
      });
    }
    return [[componentRef.location.nativeElement]];
  }
}
