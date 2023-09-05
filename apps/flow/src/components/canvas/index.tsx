import { useNodes, type NodeInfo } from '_@primitives/useNodes';
import { useScale, useTranslate } from '_@primitives/useTransform';
import { For } from 'solid-js';
import EdgesCanvas from './Edge';
import Node from './Node';

export default function Canvas() {
  const [translate] = useTranslate;
  const [scale] = useScale;
  const [nodes, setNodes] = useNodes;

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
