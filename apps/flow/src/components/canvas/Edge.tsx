import { nodeMapper, useEdges, useNodes } from '_@primitives/useNodes';
import { convertSvgPos, useScale, useTranslate } from '_@primitives/useTransform';
import { For, onMount } from 'solid-js';

export default function EdgesCanvas() {
  const [, setNodes] = useNodes;
  const [translate] = useTranslate;
  const [scale] = useScale;
  const [edges] = useEdges;

  onMount(() => {
    setNodes((nodes) => [...nodes]);
  });

  return (
    <svg class="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <For each={Object.keys(edges())}>
        {(fromNodeId) => (
          <For each={edges()[fromNodeId]}>
            {(toNodeId) => {
              const fromNode = () => nodeMapper()[fromNodeId].element;
              const toNode = () => nodeMapper()[toNodeId].element;

              return (
                <path
                  d={`M${convertSvgPos(getElementPos(fromNode(), 'out'))} 
                  L${convertSvgPos(getElementPos(toNode(), 'in'))}`}
                  stroke="#a16207"
                  stroke-width="1"
                  fill="red"
                />
              );
            }}
          </For>
        )}
      </For>
      <circle cx={-10 * scale() + translate().x} cy={-10 * scale() + translate().y} r={10 * scale()} fill="red" />
    </svg>
  );
}

const getElementPos = (element: HTMLElement, type: 'in' | 'out') => {
  if (!element || !element?.style || !element?.style?.transform) return { x: 0, y: 0 };
  const { e: x, f: y } = new WebKitCSSMatrix(element.style.transform);
  return { x: type === 'out' ? x + element.offsetWidth : x, y: y + element.offsetHeight / 2 };
};
