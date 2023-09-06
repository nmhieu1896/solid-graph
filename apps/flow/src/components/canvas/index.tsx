import { useNodes, type NodeInfo } from '_@primitives/useNodesAndEdges';
import { For } from 'solid-js';
import EdgesCanvas from './Edge';
import Node from './Node';

export default function Canvas() {
  const [nodes, setNodes] = useNodes;

  const setNode = (index: number) => (newNode: NodeInfo) => {
    const newNodes = [...nodes()];
    newNodes[index] = newNode;
    setNodes(newNodes);
  };

  return (
    <>
      <EdgesCanvas />

      <For each={nodes()}>{(node, idx) => <Node node={node} setNode={setNode(idx())} />}</For>
    </>
  );
}
