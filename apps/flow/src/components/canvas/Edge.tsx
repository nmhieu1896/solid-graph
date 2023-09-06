import { NodeInfo, edgeSrc, mousePos, nodeMapper, useEdges, useNodes, type Point } from '_@primitives/useNodesAndEdges';
import { convertSvgPos, useScale, useTranslate } from '_@primitives/useTransform';
import { For, Show, onMount } from 'solid-js';

const [translate] = useTranslate;
const [scale] = useScale;
const [, setNodes] = useNodes;
const [edges, setEdges] = useEdges;

export default function EdgesCanvas() {
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
                const fromNode = () => nodeMapper()[fromNodeId];
                const toNode = () => nodeMapper()[toNodeId];
                const outPos = () => getElementPos(fromNode(), 'out');
                const inPos = () => getElementPos(toNode(), 'in');
                const fromInSvg = () => ({
                  x: outPos().x * scale() + translate().x,
                  y: outPos().y * scale() + translate().y,
                });
                const toInSvg = () => ({
                  x: inPos().x * scale() + translate().x,
                  y: inPos().y * scale() + translate().y,
                });

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
            d={`M${convertSvgPos(getElementPos(nodeMapper()[edgeSrc()], 'out'))}
              L${mousePos().x} ${mousePos().y} `}
            fill="none"
            stroke="#a16207"
            stroke-width="2"
          />
        </Show>
      </svg>
    </>
  );
}

const getElementPos = (node: NodeInfo, type: 'in' | 'out') => {
  const element = node.element;
  if (!element || !element?.style || !element?.style?.transform) return { x: 0, y: 0 };

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
