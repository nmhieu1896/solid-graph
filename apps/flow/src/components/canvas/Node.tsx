import { useScale, useTranslate, calibPosition } from '_@primitives/useTransform';
import { createSignal, onMount } from 'solid-js';
import SlideOver from '_@components/modals/SlideOver';
import { INode } from '_@models/interfaces';
import { Graph } from '_@models/Graph';

type NodeProps = {
  node: INode;
  graph: Graph;
};

const [translate] = useTranslate;
const [scale] = useScale;
export default function Node({ node, graph }: NodeProps) {
  const [dragPos, setDragPos] = createSignal<{ x: number; y: number }>();
  const [droppable, setDroppable] = createSignal(false); // Droppable is for creating edges
  const [open, setOpen] = createSignal(false);
  let ref: HTMLDivElement;

  const onToggle = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      if (!dragPos()) return;

      const x = (e.clientX - translate().x - dragPos().x) / scale();
      const y = (e.clientY - translate().y - dragPos().y) / scale();

      node.pos = { x, y };
      ref.style.transform = getTransform(node.pos);
    });
    document.addEventListener('mouseup', () => {
      if (!dragPos()) return;
      setDragPos(undefined);
      setDroppable(false);
    });
  });

  return (
    <>
      <div
        ref={(el) => {
          node.element = el;
          ref = el;
        }}
        ondblclick={onToggle(true)}
        classList={{
          'border box-border absolute py-4 px-8': true,
          'border-red-500 cursor-pointer': !droppable(),
          'border-green-500 cursor-move': droppable(),
        }}
        style={{
          'transform-origin': '0 0',
          transform: getTransform(node.pos),
        }}
        onMouseDown={(e) => {
          if (e.target === ref) setDragPos({ x: e.offsetX * scale(), y: e.offsetY * scale() });
        }}
        onMouseOver={() => {
          if (graph.edges.allowEdgeCreation(node.id)) setDroppable(true);
        }}
        onMouseLeave={() => {
          setDroppable(false);
        }}
        data-node-id={node.id}
      >
        <div class="select-none pointer-events-none">
          <p>id: {node.id}</p>
          <p>Title: {node.title}</p>
          <p>Type: {node.type}</p>
        </div>

        {/* Edge dragger */}
        {Object.values(pointMapperClass).map((v) => (
          <div
            class={`${v}  absolute w-4 h-6  cursor-grab `}
            style={{ transform: `translate(-50%, -50%)` }}
          />
        ))}
      </div>

      <SlideOver open={open} onClose={onToggle(false)}>
        <div>
          <header class="flex justify-between p-4 border-b border-b-green-700 mb-4">
            <h1 class="text-2xl font-bold">
              {node.title} | Type: {node.type}
            </h1>
            <button
              onClick={() => {
                graph.nodes.removeNode(node.id);
                // graph.edges.removeEdgeByNodeId(node.id);
              }}
            >
              Delete node
            </button>
          </header>
          <node.SliderRightForm self={node} onSubmit={onToggle(false)} />
        </div>
      </SlideOver>
    </>
  );
}

function getTransform(nodePos: Point) {
  const pos = calibPosition(nodePos);
  return `translate(${pos.x}px, ${pos.y}px) scale(${scale()})`;
}

const pointMapperClass = {
  // top: 'edge-dragger-t top-0 left-[50%]',
  right: 'edge-dragger-out top-[50%] left-[calc(100%_+_3px)] bg-green-500 clip-path-arrow-right',
  // bottom: 'edge-dragger-b top-[100%] left-[50%]',
  left: 'edge-dragger-in top-[50%] left-0 bg-red-500  clip-path-arrow-right',
};
