import { Injectable } from "@angular/core";

/** @dynamic */

@Injectable()
export class BottomSheetContext<T> {
  public dismiss: (value?: any) => void;
  public setValue: (value?: any) => void;
  constructor(public props: Partial<T> | undefined) {}
}
