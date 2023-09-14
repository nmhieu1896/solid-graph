import Canvas from '_@components/canvas/index';
import { useScale, useTranslate, type Translate } from '_@primitives/useTransform';
import { graph } from '_@primitives/useGraph';

import { Accessor, createEffect, type Component } from 'solid-js';
import axios from 'axios';

const App: Component = () => {
  const [translate, setTranslate] = useTranslate;
  const [scale, setScale] = useScale;

  setTimeout(() => {
    // axios.get('https://platform-api.sens-vn.com/graph/projects');
    axios.get('https://platform-api.sens-vn.com/graph/1');
    // axios.post('https://platform-api.sens-vn.com/graph', {
    //   projectId: '1',
    //   projectName: 'Test',
    //   nodes: nodes().map((node) => node.get()),
    //   edges: edge.edges,
    // });
    // axios.patch('https://platform-api.sens-vn.com/graph/1', {
    //   projectId: '1',
    //   projectName: 'Test3',
    //   // projectName: null,
    //   nodes: nodes().map((node) => node.get()),
    //   edges: edge.edges,
    // });
  }, 1000);

  createEffect(() => {
    window.addEventListener('wheel', (e) => {
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
        <button onClick={() => graph.nodes.addNode('bash')}>Add BASH Node</button>
        <button onClick={() => graph.nodes.addNode('api')}>Add API Node</button>
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
