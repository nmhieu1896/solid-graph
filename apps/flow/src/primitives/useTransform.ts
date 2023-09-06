import { createSignal } from 'solid-js';

export type Translate = {
  x: number;
  y: number;
};

export const useTranslate = createSignal<Translate>({ x: 0, y: 0 });
export const useScale = createSignal(1, {
  equals: (_, scale) => scale > 3 || scale < 0.15,
});

export const convertSvgPos = (svgPos: { x: number; y: number }) => {
  const [translate] = useTranslate;
  const [scale] = useScale;
  return `${svgPos.x * scale() + translate().x} ${svgPos.y * scale() + translate().y}`;
};
