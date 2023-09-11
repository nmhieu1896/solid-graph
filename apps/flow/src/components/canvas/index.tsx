import { useNodes } from '_@primitives/useNodesAndEdges';
import { For } from 'solid-js';
import EdgesCanvas from './Edge';
import Node from './Node';

export default function Canvas() {
  const [nodes] = useNodes;

  return (
    <>
      <EdgesCanvas />

      <For each={nodes()}>{(node) => <Node node={node} />}</For>
    </>
  );
}
