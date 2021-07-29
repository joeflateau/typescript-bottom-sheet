import { Injectable } from "@angular/core";

@Injectable()
export class BottomSheetContext<TProps> {
  public dismiss: (value?: any) => void;
  public setValue: (value?: any) => void;
  constructor(public props: TProps | undefined) {}
}
