export function dispatchEvent(type, detail={}) {
  const event = new CustomEvent(type, { detail });
  window.dispatchEvent(event);
}

export function onEvent(type, callback) {
  window.addEventListener(type, callback);
}

export function offEvent(type, callback) {
  window.removeEventListener(type, callback);
}
