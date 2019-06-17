import {
  TemplateRef,
  Injectable,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Type
} from "@angular/core";

import { BottomSheetComponent } from "./bottom-sheet.component";

export type BottomSheetContent<T> = TemplateRef<T> | Type<T>;

@Injectable()
export class BottomSheetContext {
  public dismiss: (value: any) => void;
  public setValue: (value: any) => void;
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
    options: {
      title: string;
      stops: number[];
    }
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
    context.setValue = value => instance.setValue(value);

    return new Promise(resolve => {
      instance.onClose = value => {
        resolve(value);
        instanceRef.destroy();
      };
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
