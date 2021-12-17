let currentKeys = {};
let currentMouseLocation = { x: 0, y: 0 };
let mouseListeners: MouseMoveEventListener[] = [];
let keyPressListeners: KeyPressListener[] = [];

export interface KeyPressEvent {
  type: "on" | "off";
  key: string;
}

export interface MouseMoveEvent {
  x: number;
  y: number;
}

export interface KeyPressListener {
  (keyPressEvent: KeyPressEvent): void;
}

export interface MouseMoveEventListener {
  (mouseMoveEvent: MouseMoveEvent, previousMouseMoveEvent?: MouseMoveEvent): void;
}

window.onkeydown = (e: KeyboardEvent) => {
  let key = e.key.toLowerCase();
  // remember: if a key is held, onkeydown will send multiple key presses.
  // this behavior changes it so our interface only sends one input per key down.
  if (!currentKeys[key]) {
    currentKeys[key] = true;
    for(let listener of keyPressListeners) {
        listener({
            type: "on",
            key: key
        })
    }
  }
};
// inverse of window.onkeydown right before.
window.onkeyup = (e: KeyboardEvent) => {
    let key = e.key.toLowerCase();
    if(currentKeys[key]) {
        currentKeys[key] = false;
        for(let listener of keyPressListeners) {
            listener({
                type: "off",
                key: key
            })
        }
    }
};

let previousLoc = undefined;
window.onmousemove = (e: MouseEvent) => {
  let loc = { x: e.x, y: e.y };
  if (currentMouseLocation != loc) {
    currentMouseLocation = loc;
    for (let listener of mouseListeners) {
      listener(loc, previousLoc);
    }
  }
  previousLoc = loc;
};

export function isKeyDown(key: string) {
  return currentKeys[key.toLowerCase()] === true;
}

export function mouseLocation() {
  return currentMouseLocation;
}

export function registerKeyPressEventListener(func: KeyPressListener) {
  keyPressListeners.push(func);
}

export function registerMouseMoveEventListener(func: MouseMoveEventListener) {
  mouseListeners.push(func);
}

export function clearListeners() {
  keyPressListeners = [];
  mouseListeners = [];
}