import Canvas from '_@components/canvas/index';
import { useScale, useTranslate, type Translate } from '_@primitives/useTransform';
import { Accessor, createEffect, type Component } from 'solid-js';

const App: Component = () => {
  const [translate, setTranslate] = useTranslate;
  const [scale, setScale] = useScale;

  createEffect(() => {
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        setScale((scale) => scale - e.deltaY / 150);
      } else {
        setTranslate((translate) => ({
          x: translate.x - e.deltaX / 1.2,
          y: translate.y - e.deltaY / 1.2,
        }));
      }
    });
  });

  // @ts-ignore
  window.translate = translate;
  // @ts-ignore
  window.scale = scale;

  return (
    <div
      onscroll={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      class="h-[100vh] w-[100vw] absolute overflow-hidden"
    >
      <Background scale={scale} translate={translate} />

      <Canvas />

      <div class="fixed bottom-2 left-2 border-2 border-green-500 grid gap-4">
        <button
          onclick={() => {
            setScale((scale) => scale + 0.1);
          }}
        >
          zoom in
        </button>
        <button
          onclick={() => {
            setScale((scale) => scale - 0.1);
          }}
        >
          zoom out
        </button>
        <button
          onclick={() => {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;

// background
type BgProps = {
  scale: Accessor<number>;
  translate: Accessor<Translate>;
};
function Background({ scale, translate }: BgProps) {
  return (
    <svg class="absolute w-full h-full top-0 left-0 pointer-events-none">
      <defs>
        <pattern
          id="pattern"
          x={translate().x % (40 * scale())}
          y={translate().y % (40 * scale())}
          width={scale() * 40}
          height={scale() * 40}
          patternUnits="userSpaceOnUse"
          patternTransform="translate(-1,-1)"
        >
          <circle cx={scale()} cy={scale()} r={scale()} fill="#91919a"></circle>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)"></rect>
    </svg>
  );
}
