# swipe-bottom-sheet

[Demo](https://joeflateau.github.io/typescript-bottom-sheet/)

## Usage in Angular

### TLDR:

- Inject the module into app module
- Import the scss
- Set the root view container ref to the app component's view container
- Open sheets

### Import the `BottomSheetModule` into your app module

```typescript
import { BottomSheetModule } from "swipe-bottom-sheet";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BottomSheetModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {}
```

### Import the module's scss

```scss
@import "~swipe-bottom-sheet/styles.scss";
```

### Inject the `BrowserSheetProvider` into your app component and set the bottomSheet's `rootVcRef` property

```typescript
import { BottomSheetProvider } from "swipe-bottom-sheet";

@Component({
  selector: "app-root",
  templateUrl: "app.html"
})
export class AppComponent {
  constructor(
    private bottomSheet: BottomSheetProvider,
    vcRef: ViewContainerRef
  ) {
    // only set this once and do so in the app component's constructor
    bottomSheet.rootVcRef = vcRef;
  }
}
```

### Open a bottom sheet using a TemplateRef

```typescript
import { BottomSheetProvider } from "swipe-bottom-sheet";

@Component({
  selector: "app-component",
  templateUrl: "component.html"
})
export class MyComponent {
  constructor(private bottomSheet: BottomSheetProvider) {}

  async openSheet<T>(content: TemplateRef<T>) {
    const value = await this.bottomSheet.show(content, {
      title: "Sheet Title",
      stops: [270]
    });
    console.log({ value });
  }
}
```

```html
<button type="button" (click)="openSheet(sheetTemplate)">
  Open Template
</button>

<ng-template #sheetTemplate let-context>
  <ul class="sheet-list">
    <li class="sheet-list-item" (click)="context.dismiss('value')">
      Dismiss with value
    </li>
  </ul>
</ng-template>
```

### Open a bottom sheet using a Component

#### Write the Component

Have `BottomSheetContext` injected and use that to control the sheet

```typescript
import { BottomSheetContext } from "swipe-bottom-sheet";

@Component({
  selector: "app-example-component",
  template: `
    <ul class="sheet-list">
      <li
        class="sheet-list-item"
        (click)="context.dismiss('dismissed with value from component')"
      >
        Dismiss with value
      </li>
    </ul>
  `
})
export class ExampleComponent {
  constructor(public context: BottomSheetContext) {}
}
```

#### Open the sheet with a reference to your component

```html
<button type="button" (click)="openSheet()">
  Open Component
</button>
```

```typescript
import { BottomSheetProvider } from "swipe-bottom-sheet";
import { ExampleComponent } from "./example-sheet-component";

@Component({
  selector: "app-component",
  templateUrl: "component.html",
  styles: []
})
export class MyComponent {
  constructor(private bottomSheet: BottomSheetProvider) {}

  async openSheet<T>() {
    const value = await this.bottomSheet.show(ExampleComponent, {
      title: "Sheet Title",
      stops: [270]
    });
    console.log({ value });
  }
}
```
