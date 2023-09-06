import { useScale, useTranslate } from '_@primitives/useTransform';
import { createSignal, onMount } from 'solid-js';
import { Point, type NodeInfo } from '_@primitives/useNodesAndEdges';
import { isMouseDown } from '_@primitives/createOnMouseDown';

type NodeProps = {
  node: NodeInfo;
  setNode: (node: NodeInfo) => void;
};

const [translate] = useTranslate;
const [scale] = useScale;
export default function Node({ node, setNode }: NodeProps) {
  const [dragPos, setDragPos] = createSignal<{ x: number; y: number }>();
  const [droppable, setDroppable] = createSignal(false);
  let ref: HTMLDivElement;

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      if (!dragPos()) return;

      const x = (e.clientX - translate().x - dragPos().x) / scale();
      const y = (e.clientY - translate().y - dragPos().y) / scale();

      node.pos = { x, y };
      ref.style.transform = getTransform(node.pos);
      setNode(node);
    });
    document.addEventListener('mouseup', () => {
      if (!dragPos()) return;
      setDragPos(undefined);
      setDroppable(false);
    });
  });

  return (
    <div
      ref={(el) => {
        node.element = el;
        ref = el;
      }}
      classList={{
        'isolate z-20': true,
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
        if (isMouseDown()) setDroppable(true);
      }}
      onMouseLeave={() => {
        setDroppable(false);
      }}
      data-node-id={node.id}
      // onMouseUp={(e) => {
      //   console.log('UP ON', e.target);
      // }}
    >
      <p class="select-none pointer-events-none">{node.title || 'Node Title'}</p>

      {/* Edge dragger */}
      {Object.values(pointMapperClass).map((v) => (
        <div class={`${v}  absolute w-4 h-6  cursor-grab `} style={{ transform: `translate(-50%, -50%)` }} />
      ))}
    </div>
  );
}

function getTransform(nodePos: Point) {
  return `translate(${nodePos.x * scale() + translate().x}px, ${
    nodePos.y * scale() + translate().y
  }px) scale(${scale()})`;
}

const pointMapperClass = {
  // top: 'edge-dragger-t top-0 left-[50%]',
  right: 'edge-dragger-out top-[50%] left-[calc(100%_+_3px)] bg-green-500 clip-path-arrow-right',
  // bottom: 'edge-dragger-b top-[100%] left-[50%]',
  left: 'edge-dragger-in top-[50%] left-0 bg-red-500  clip-path-arrow-right',
};
