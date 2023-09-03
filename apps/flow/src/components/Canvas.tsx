import { Accessor, For, createEffect, createSignal, onMount } from 'solid-js';

type Translate = {
  x: number;
  y: number;
};
// background
type Props = {
  scale: Accessor<number>;
  translate: Accessor<Translate>;
};
type NodeInfo = {
  pos: { x: number; y: number };
  title?: string;
};

export default function Canvas({ scale, translate }: Props) {
  const [nodes, setNodes] = createSignal<NodeInfo[]>([
    { pos: { x: 0, y: 0 }, title: 'Node 1' },
    { pos: { x: 100, y: 100 }, title: 'Node 2' },
    { pos: { x: -300, y: -300 }, title: 'Node 3' },
  ]);

  return (
    <div
      class="w-full h-full border-[4px] border-green-500"
      style={{
        transform: `translate(${translate().x}px, ${
          translate().y
        }px) scale(${scale()})`,
        'transform-origin': '0 0 ',
      }}
    >
      <For each={nodes()}>
        {(node) => (
          <Node
            scale={scale}
            translate={translate}
            pos={node.pos}
            title={node.title}
          />
        )}
      </For>
    </div>
  );
}

type NodeProps = {
  pos: {
    x: number;
    y: number;
  };
  title?: string;
  translate: Accessor<Translate>;
  scale: Accessor<number>;
};
function Node({ pos, title, translate, scale }: NodeProps) {
  const [dragPos, setDragPos] = createSignal<{ x: number; y: number }>();
  let ref: HTMLDivElement;

  onMount(() => {
    ref.parentElement.parentElement.addEventListener('mousemove', (e) => {
      if (!dragPos()) return;
      console.log('start dragging');
      ref.style.transform = `translate(
          ${(e.clientX - translate().x - dragPos().x) / scale()}px,
          ${(e.clientY - translate().y - dragPos().y) / scale()}px)`;
    });
    ref.parentElement.parentElement.addEventListener('mouseup', () => {
      console.log('MOUSSEEE UPPPP');
      if (!dragPos()) return;
      setDragPos(undefined);
      console.log('stop dragging');
    });
  });

  return (
    <div
      ref={ref}
      class="border border-red-500 absolute py-4 px-8 cursor-grab"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
      onMouseDown={(e) => {
        console.log('MOUSE DOWN');
        setDragPos({ x: e.offsetX * scale(), y: e.offsetY * scale() });
      }}
      // onclick={() => {
      //   console.log('click clik');
      // }}
      onClick={() => {
        console.log('CLICK CLICK');
      }}
    >
      <p class="select-none pointer-events-none"> {title || 'Node Title'}</p>
    </div>
  );
}
