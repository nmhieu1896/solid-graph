import { useEdges, useNodes, type NodeInfo } from '_@primitives/useNodes';
import { convertSvgPos, useScale, useTranslate } from '_@primitives/useTransform';
import { For, createEffect } from 'solid-js';
import Node from './Node';

export default function Canvas() {
  const [translate] = useTranslate;
  const [scale] = useScale;
  const [nodes, setNodes] = useNodes;
  const [edges, setEdges] = useEdges;

  createEffect(() => {
    console.log({ nodes: nodes() });
  });

  const setNode = (index: number) => (newNode: NodeInfo) => {
    const newNodes = [...nodes()];
    newNodes[index] = newNode;
    setNodes(newNodes);
  };

  return (
    <>
      <EdgesCanvas />

      <div
        class="w-full h-full border border-green-500"
        style={{
          transform: `translate(${translate().x}px, ${translate().y}px) scale(${scale()})`,
          'transform-origin': '0 0',
        }}
      >
        <For each={nodes()}>{(node, idx) => <Node node={node} setNode={setNode(idx())} />}</For>
      </div>
    </>
  );
}

function EdgesCanvas() {
  const [nodes] = useNodes;
  const [translate] = useTranslate;
  const [scale] = useScale;

  return (
    <svg class="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path
        // d={`M${convert({ x: -300, y: -300 })} L${convert({ x: 100, y: 100 })}`}
        d={`M${convertSvgPos(getPosFromElement(nodes()[0]?.element))} L${convertSvgPos(
          getPosFromElement(nodes()[1]?.element)
        )}`}
        stroke="blue"
        stroke-width="3"
        fill="red"
      />
      <circle cx={-10 * scale() + translate().x} cy={-10 * scale() + translate().y} r={10 * scale()} fill="red" />
    </svg>
  );
}

const getPosFromElement = (element: HTMLElement) => {
  if (!element || !element?.style || !element?.style?.transform) return { x: 0, y: 0 };
  const { e: x, f: y } = new WebKitCSSMatrix(element.style.transform);
  return { x, y };
};
