import { Injectable } from "@angular/core";

/** @dynamic */

@Injectable()
export class BottomSheetContext<TProps> {
  locked = false;
  constructor(
    public readonly dismiss: (value?: any) => void,
    public readonly setValue: (value?: any) => void,
    public readonly props: TProps | undefined
  ) {}
}
