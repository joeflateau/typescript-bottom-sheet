// Import stylesheets
import "./style.scss";

import { SwipeAwaySheet } from "./sheet";
import { listen } from "./listen";

const logWindow = document.querySelector(".output");

function log(message: string) {
  logWindow.innerHTML = message;
}

const _open = document.querySelector(".open") as HTMLElement;
const _sheet = document.querySelector(".sheet") as HTMLElement;
const _cancel = document.querySelector(".sheet-cancel") as HTMLElement;
const viewport = document.getElementById("viewport");

const gesture = new SwipeAwaySheet(_sheet, {
  attachTo: viewport,
  stops: [270]
});

gesture.open();

listen(_open, ["click"], () => {
  gesture.open();
});
listen(_cancel, ["click"], () => {
  gesture.close();
});
