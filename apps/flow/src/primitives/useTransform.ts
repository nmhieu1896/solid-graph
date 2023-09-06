import { createSignal } from 'solid-js';

export type Translate = {
  x: number;
  y: number;
};

export const useTranslate = createSignal<Translate>({ x: 0, y: 0 });
export const useScale = createSignal(1, {
  equals: (_, scale) => scale > 3 || scale < 0.15,
});
const [translate] = useTranslate;
const [scale] = useScale;

//Update Node/edges position after translating and Scaling
export const calibPosition = (svgPos: { x: number; y: number }) => {
  return { x: svgPos.x * scale() + translate().x, y: svgPos.y * scale() + translate().y };
};
