
let currentKeys = {};

window.onkeydown = (e: KeyboardEvent) => {
    currentKeys[e.key.toLowerCase()] = true;
}

window.onkeyup = (e: KeyboardEvent) => {
    currentKeys[e.key.toLowerCase()] = false;
}

export default function isKeyDown(key: string) {
    return currentKeys[key.toLowerCase()] === true;
}