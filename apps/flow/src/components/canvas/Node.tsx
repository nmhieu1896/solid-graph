import { useScale, useTranslate } from '_@primitives/useTransform';
import { createSignal, onMount } from 'solid-js';
import { type NodeInfo } from '_@primitives/useNodes';

type NodeProps = {
  node: NodeInfo;
  setNode: (node: NodeInfo) => void;
};

export default function Node({ node, setNode }: NodeProps) {
  const [translate] = useTranslate;
  const [scale] = useScale;
  const [dragPos, setDragPos] = createSignal<{ x: number; y: number }>();
  let ref: HTMLDivElement;

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      if (!dragPos()) return;
      const [x, y] = [
        (e.clientX - translate().x - dragPos().x) / scale(),
        (e.clientY - translate().y - dragPos().y) / scale(),
      ];
      ref.style.transform = `translate(${x}px,${y}px)`;
      node.pos = { x, y };
      setNode(node);
    });
    document.addEventListener('mouseup', () => {
      if (!dragPos()) return;
      // const { e: x, f: y } = new WebKitCSSMatrix(ref.style.transform);
      // node.pos = { x, y };
      // setNode(node);
      setDragPos(undefined);
      console.log('stop dragging');
    });
  });

  return (
    <div
      ref={(el) => {
        node.element = el;
        ref = el;
      }}
      class="border border-red-500 absolute py-4 px-8 cursor-pointer"
      style={{
        transform: `translate(${node.pos.x}px, ${node.pos.y}px)`,
      }}
      onMouseDown={(e) => {
        console.log('MOUSE DOWN', e.target);
        if (e.target === ref) setDragPos({ x: e.offsetX * scale(), y: e.offsetY * scale() });
      }}
      // onMouseUp={(e) => {
      //   console.log('UP ON', e.target);
      // }}
    >
      <p class="select-none pointer-events-none">{node.title || 'Node Title'}</p>

      {/* Edge dragger */}
      {Object.values(pointMapperClass).map((v) => (
        <div
          class={`${v} absolute w-3 h-3 rounded-full bg-green-500 cursor-grab `}
          style={{ transform: `translate(-50%, -50%)` }}
        />
      ))}
    </div>
  );
}

const pointMapperClass = {
  top: 'edge-dragger-t top-0 left-[50%]',
  right: 'edge-dragger-r top-[50%] left-[100%]',
  bottom: 'edge-dragger-b top-[100%] left-[50%]',
  left: 'edge-dragger-l top-[50%] left-0',
};
