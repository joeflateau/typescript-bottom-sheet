import { EventEmitter, Injectable } from "@angular/core";

export type SheetState = "open" | "closed";

/** @dynamic */

@Injectable()
export class BottomSheetContext<TProps> {
  locked = false;
  stateChanged = new EventEmitter<SheetState>();
  state: SheetState = "closed";

  constructor(
    public readonly dismiss: (value?: any) => void,
    public readonly setValue: (value?: any) => void,
    public readonly props: TProps | undefined
  ) {}
}
