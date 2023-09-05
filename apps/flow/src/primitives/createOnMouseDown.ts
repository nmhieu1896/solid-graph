import { createSignal } from 'solid-js';

const [isMouseDown, setIsMouseDown] = createSignal(false);

document.addEventListener('mousedown', () => {
  setIsMouseDown(true);
});
document.addEventListener('mouseup', () => {
  setIsMouseDown(false);
});

export { isMouseDown };
