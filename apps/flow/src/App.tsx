import { createSignal, type Component, Accessor, createEffect } from 'solid-js';
import Canvas from '_@components/Canvas';

type Translate = {
  x: number;
  y: number;
};

const App: Component = () => {
  const [translate, setTranslate] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1, {
    equals: (_, scale) => scale > 3 || scale < 0.15,
  });

  createEffect(() => {
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        setScale((scale) => scale - e.deltaY / 500);
      } else {
        setTranslate((translate) => ({
          x: translate.x - e.deltaX / 2,
          y: translate.y - e.deltaY / 2,
        }));
      }
    });
  });

  window.translate = translate;
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
      {/* <div
        class="w-4 h-4 bg-red-500 rounded-full bg-red absolute top-0 left-0"
        style={{
          transform: `translate(${translate().x}px, ${
            translate().y
          }px) scale(${scale()})`,
          'transform-origin': '0 0 ',
        }}
      ></div> */}

      <Canvas scale={scale} translate={translate} />

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
