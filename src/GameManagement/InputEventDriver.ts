let currentKeys = {};
let currentMouseLocation = {x: 0, y: 0};

window.onkeydown = (e: KeyboardEvent) => {
    currentKeys[e.key.toLowerCase()] = true;
}

window.onkeyup = (e: KeyboardEvent) => {
    currentKeys[e.key.toLowerCase()] = false;
}

window.onmousemove = (e: MouseEvent) => {
    currentMouseLocation = {x: e.x, y: e.y};
}

export function isKeyDown(key: string) {
    return currentKeys[key.toLowerCase()] === true;
}

export function mouseLocation() {
    return currentMouseLocation;
}