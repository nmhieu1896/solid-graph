import { nodes } from '_@primitives/useNodes';
import { For } from 'solid-js';
import EdgesCanvas from './Edge';
import Node from './Node';

export default function Canvas() {
  return (
    <>
      <EdgesCanvas />

      <For each={nodes.nodes()}>{(node) => <Node node={node} />}</For>
    </>
  );
}
