import { Injectable } from "@angular/core";

/** @dynamic */

@Injectable()
export class BottomSheetContext<TProps> {
  public dismiss?: (value?: any) => void;
  public setValue?: (value?: any) => void;
  constructor(public props: TProps | undefined) {}
}
