import { A } from '@solidjs/router';
import Canvas from '_@components/canvas/index';
import { useGraph } from '_@primitives/useGraph';
import { useScale, useTranslate, type Translate } from '_@primitives/useTransform';

import { Accessor, onCleanup } from 'solid-js';

export default function Board() {
  const graph = useGraph();

  const [translate, setTranslate] = useTranslate;
  const [scale, setScale] = useScale;

  const wheelCallback = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const currentTranslateX = translate().x;
      const currentTranslateY = translate().y;

      const currentScale = scale();

      const newScale = currentScale - e.deltaY / 150;

      //newScale outside the threshold will give high errors
      if (newScale > 0.2 && newScale < 3) {
        const newTranslateX = mouseX - (mouseX - currentTranslateX) * (newScale / currentScale);
        const newTranslateY = mouseY - (mouseY - currentTranslateY) * (newScale / currentScale);
        setTranslate({ x: newTranslateX, y: newTranslateY });
        setScale(newScale);
      }
    } else {
      setTranslate((translate) => ({
        x: translate.x - e.deltaX / 1.2,
        y: translate.y - e.deltaY / 1.2,
      }));
    }
  };

  window.addEventListener('wheel', wheelCallback);
  onCleanup(() => {
    window.removeEventListener('wheel', wheelCallback);
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

      <Canvas graph={graph} />

      <div class="fixed bottom-2 left-2 border-2 border-green-500 grid gap-4">
        <button onClick={() => graph.nodes.addNode('AAA')}>Add Type AAA Node</button>
        <button onClick={() => graph.nodes.addNode('BBB')}>Add Type BBB Node</button>
        <button onClick={() => graph.undo()}>UNDO</button>
        <button onClick={() => graph.redo()}>REDO</button>
      </div>

      <A class="absolute bg-green-500" href="/">
        HOME
      </A>
    </div>
  );
}

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
