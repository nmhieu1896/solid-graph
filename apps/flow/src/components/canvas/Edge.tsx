import {
  NodeInfo,
  edgeSrc,
  mousePos,
  useEdges,
  useNodeMapper,
  useNodes,
  type Point,
} from '_@primitives/useNodesAndEdges';
import { calibPosition, useScale } from '_@primitives/useTransform';
import { For, Show, onMount } from 'solid-js';

const [scale] = useScale;
const [, setNodes] = useNodes;
const [edges, setEdges] = useEdges;

export default function EdgesCanvas() {
  const [nodeMapper] = useNodeMapper;
  onMount(() => {
    setNodes((nodes) => [...nodes]);
  });

  const onDeleteEdge = (fromId: string, toId: string) => () => {
    const currentFromId = edges()[fromId];
    if (!currentFromId) return;
    const newEdges = edges();
    newEdges[fromId] = currentFromId.filter((id) => id !== toId);
    setEdges(newEdges);
  };

  return (
    <>
      <svg class="absolute left-0 top-0 w-full h-full " xmlns="http://www.w3.org/2000/svg">
        <For each={Object.keys(edges())}>
          {(fromNodeId) => (
            <For each={edges()[fromNodeId]}>
              {(toNodeId) => {
                // 2 Nodes to create an Edge
                const fromNode = () => nodeMapper()[fromNodeId];
                const toNode = () => nodeMapper()[toNodeId];
                // 2 Nodes's output/input Position for creating edge
                const outPos = () => getElementPos(fromNode(), 'out');
                const inPos = () => getElementPos(toNode(), 'in');
                // 2 Nodes Position in SVG After translation and scaling and it's center for deletion
                const fromInSvg = () => calibPosition(outPos());
                const toInSvg = () => calibPosition(inPos());
                const center = () => ({ x: (fromInSvg().x + toInSvg().x) / 2, y: (fromInSvg().y + toInSvg().y) / 2 });

                return (
                  <>
                    <path
                      class="[&:hover+path]:stroke-[4] [&:hover+path]:stroke-slate-500 stroke-transparent [&:hover+path+circle]:fill-red-500"
                      d={convertLineToSpline(fromInSvg(), toInSvg())}
                      fill="none"
                      stroke-width="32"
                    />
                    <path
                      class="stroke-slate-400 pointer-events-none stroke-2 transition-[stroke-width,_stroke]"
                      d={convertLineToSpline(fromInSvg(), toInSvg())}
                      fill="none"
                    />
                    <circle
                      class="cursor-pointer hover:fill-red-500 fill-transparent transition"
                      cx={center().x}
                      cy={center().y}
                      r={10 * scale()}
                      onClick={onDeleteEdge(fromNodeId, toNodeId)}
                    />
                  </>
                );
              }}
            </For>
          )}
        </For>
        <Show when={edgeSrc() && mousePos()}>
          <path
            class="stroke-slate-400 pointer-events-none stroke-2 transition-[stroke-width,_stroke]"
            d={convertLineToSpline(calibPosition(getElementPos(nodeMapper()[edgeSrc()], 'out')), mousePos())}
            fill="none"
          />
        </Show>
      </svg>
    </>
  );
}

const getElementPos = (node: NodeInfo, type: 'in' | 'out') => {
  const element = node.element;
  if (!element || !element?.offsetWidth) return { x: 0, y: 0 };

  return {
    x: type === 'out' ? node.pos.x + element.offsetWidth : node.pos.x,
    y: node.pos.y + element.offsetHeight / 2 + 1,
  };
};

export const convertLineToSpline = (fromSvg: Point, toSvg: Point) => {
  const p1 = { x: (fromSvg.x * 4 + toSvg.x) / 5, y: fromSvg.y };
  const p2 = { x: (fromSvg.x * 2 + toSvg.x) / 3, y: fromSvg.y };
  const p3 = { x: (fromSvg.x + toSvg.x) / 2, y: (fromSvg.y + toSvg.y) / 2 };
  const p4 = { x: (fromSvg.x + toSvg.x * 2) / 3, y: toSvg.y };
  const p5 = { x: (fromSvg.x + toSvg.x * 4) / 5, y: toSvg.y };

  const controlPoint = [p1, p2, p3, p4, p5, toSvg].map((p) => `${p.x} ${p.y}`).join(', ');

  return `M${fromSvg.x} ${fromSvg.y} C ${controlPoint}`;
};
