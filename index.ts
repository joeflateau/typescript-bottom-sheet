// Import stylesheets
import './style.scss';

import { SwipeAwaySheet, listen } from "./sheet";

const logWindow = document.querySelector(".output");
function log(message: string) {
  logWindow.innerHTML = message;
}


const _open = document.querySelector(".open") as HTMLElement;
const _sheet = document.querySelector(".sheet") as HTMLElement;
const _sheet_content = document.querySelector(".sheet-content") as HTMLElement;
const _backdrop = document.querySelector(".sheet-backdrop") as HTMLElement;
const _container = document.querySelector(".sheet-container") as HTMLElement;
const _cancel = document.querySelector(".sheet-cancel") as HTMLElement;

const gesture = new SwipeAwaySheet(_container, _sheet, _sheet_content,_backdrop, [270]);

gesture.open();

listen(_open, ["click"], () => {
  gesture.open();
})
listen(_cancel, ["click"], () => {
  gesture.close();
})
