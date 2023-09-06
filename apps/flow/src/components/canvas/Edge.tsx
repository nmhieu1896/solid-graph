import { nodeMapper, useEdges, useNodes, type Point } from '_@primitives/useNodes';
import { useScale, useTranslate, convertSvgPos } from '_@primitives/useTransform';
import { For, Show, createEffect, createSignal, onMount } from 'solid-js';

const [translate] = useTranslate;
const [scale] = useScale;
const [, setNodes] = useNodes;
const [edges, setEdges] = useEdges;

const [fromId, setFromId] = createSignal<string>();
const [mousePos, setMousePos] = createSignal<Point>();

document.addEventListener('mousedown', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains('edge-dragger-out')) {
    setFromId(target.parentElement.dataset.nodeId);
  }
});

document.addEventListener('mouseup', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const nodeId = target?.dataset?.nodeId || target?.parentElement?.dataset?.nodeId;
  if (nodeId && fromId()) {
    const currentFromId = edges()[fromId()];
    if (!currentFromId) {
      edges()[fromId()] = [nodeId];
    } else if (!currentFromId.includes(nodeId)) {
      edges()[fromId()].push(nodeId);
    }
    setEdges({ ...edges() });
  }
  setFromId(undefined);
  setMousePos(undefined);
});

document.addEventListener('mousemove', (e) => {
  if (!fromId()) return;
  setMousePos({ x: e.clientX, y: e.clientY });
});

export default function EdgesCanvas() {
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
              const outPos = () => getElementPos(fromNode(), 'out');
              const inPos = () => getElementPos(toNode(), 'in');

              return <path d={convertLineToSpline(outPos(), inPos())} fill="none" stroke="#a16207" stroke-width="2" />;
            }}
          </For>
        )}
      </For>
      <Show when={fromId() && mousePos()}>
        <path
          d={`M${convertSvgPos(getElementPos(nodeMapper()[fromId()].element, 'out'))}
              L${mousePos().x} ${mousePos().y} `}
          fill="none"
          stroke="#a16207"
          stroke-width="2"
        />
      </Show>
    </svg>
  );
}

const getElementPos = (element: HTMLElement, type: 'in' | 'out') => {
  if (!element || !element?.style || !element?.style?.transform) return { x: 0, y: 0 };
  const { e: x, f: y } = new WebKitCSSMatrix(element.style.transform);
  return { x: type === 'out' ? x + element.offsetWidth : x, y: y + element.offsetHeight / 2 + 1 };
};

export const convertLineToSpline = (from: Point, to: Point) => {
  const fromSvg = { x: from.x * scale() + translate().x, y: from.y * scale() + translate().y };
  const toSvg = { x: to.x * scale() + translate().x, y: to.y * scale() + translate().y };

  const p1 = { x: (fromSvg.x * 4 + toSvg.x) / 5, y: fromSvg.y };
  const p2 = { x: (fromSvg.x * 2 + toSvg.x) / 3, y: fromSvg.y };
  const p3 = { x: (fromSvg.x + toSvg.x) / 2, y: (fromSvg.y + toSvg.y) / 2 };
  const p4 = { x: (fromSvg.x + toSvg.x * 2) / 3, y: toSvg.y };
  const p5 = { x: (fromSvg.x + toSvg.x * 4) / 5, y: toSvg.y };

  const controlPoint = [p1, p2, p3, p4, p5].reduce((acc, cur) => `${acc} ${cur.x} ${cur.y},`, '');

  return `M${fromSvg.x} ${fromSvg.y} C ${controlPoint} ${toSvg.x} ${toSvg.y}`;
};
