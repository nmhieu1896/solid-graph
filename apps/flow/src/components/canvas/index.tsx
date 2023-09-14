import { For } from 'solid-js';
import EdgesCanvas from './Edge';
import Node from './Node';
import { graph } from '_@primitives/useGraph';

export default function Canvas() {
  return (
    <>
      <EdgesCanvas />

      <For each={graph.nodes.nodes}>{(node) => <Node node={node} />}</For>
    </>
  );
}
