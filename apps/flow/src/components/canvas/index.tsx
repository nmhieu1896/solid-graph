import { For } from 'solid-js';
import EdgesCanvas from './Edge';
import Node from './Node';
import { Graph } from '_@models/Graph';

export default function Canvas({ graph }: { graph: Graph }) {
  return (
    <>
      <EdgesCanvas graph={graph} />

      <For each={graph.nodes.nodes}>{(node) => <Node node={node} graph={graph} />}</For>
    </>
  );
}
