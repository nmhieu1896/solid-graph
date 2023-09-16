import { Accessor, createSignal, Setter } from 'solid-js';
import { NodeSnapshot } from './BaseNode';
import { Edges, EdgeSnapshot } from './Edges';
import { FullNodesSnapshot, Nodes } from './Nodes';

type UnionSnapshot = NodeSnapshot | EdgeSnapshot | FullNodesSnapshot | GraphSnapshot;
export class Graph {
  private _nodes: Accessor<Nodes>;
  private _edges: Accessor<Edges>;
  private _setNodes: Setter<Nodes>;
  private _setEdges: Setter<Edges>;
  history: Record<string, UnionSnapshot>[] = [];
  historyIndex = -1;
  private debounceTimer: any;

  constructor() {
    const [nodes, setNodes] = createSignal(new Nodes([], this));
    const [edges, setEdges] = createSignal(new Edges({}, this));
    this._nodes = nodes;
    this._edges = edges;
    this._setNodes = setNodes;
    this._setEdges = setEdges;
  }

  undo() {
    if (this.historyIndex <= -this.history.length) return;

    this.historyIndex = this.historyIndex - 1;
    const data = this.history.at(this.historyIndex);
    if (!data) return;

    Object.values(data).forEach((snapshot) => {
      if (snapshot.snapshotType === 'edge')
        queueMicrotask(() => this._edges().useSnapshot(snapshot));
      if (snapshot.snapshotType === 'node')
        this._nodes().getNode(snapshot.id)?.useSnapshot(snapshot);
      if (snapshot.snapshotType === 'full-nodes') this._nodes().useSnapshot(snapshot);
      if (snapshot.snapshotType === 'graph') this.useSnapshot(snapshot);
    });
  }

  redo() {
    if (this.historyIndex === -1) return;

    this.historyIndex = this.historyIndex + 1;
    const data = this.history.at(this.historyIndex);
    if (!data) return;

    Object.values(data).forEach((snapshot) => {
      if (snapshot.snapshotType === 'edge')
        queueMicrotask(() => this._edges().useSnapshot(snapshot));
      if (snapshot.snapshotType === 'node')
        this._nodes().getNode(snapshot.id)?.useSnapshot(snapshot);
      if (snapshot.snapshotType === 'full-nodes') this._nodes().useSnapshot(snapshot);
      if (snapshot.snapshotType === 'graph') this.useSnapshot(snapshot);
    });
  }

  pushHistory(data: UnionSnapshot) {
    const key = data.snapshotType === 'node' ? data?.id : data.snapshotType;

    // RESET HISTORY WHEN PUSH NEW DATA IN THE MIDDLE OF HISTORY
    if (this.historyIndex < -1) {
      this.history.splice(this.historyIndex + 1);
      this.historyIndex = -1;
    }

    // NO DEBOUNCE WHEN LENGTH = 0
    if (this.history.length === 0) {
      return this.history.push({ [key]: data });
    }

    // NO DEBOUNCE WHEN previous history is not contain current  NODE/EDGE
    if (!this.history.at(-1)?.[key]) {
      return (this.history.at(-1)[key] = data);
    }

    // DEBOUNCE CHANGE
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.history.push({ [key]: data });
    }, 500);
  }

  //-------------History management----------------
  useSnapshot(data: Omit<GraphSnapshot, 'snapshotType'>) {
    this._edges().useSnapshot(data.edges);
    this._nodes().useSnapshot(data.nodes);
  }

  takeSnapshot(): GraphSnapshot {
    const nodes = { nodes: this._nodes().takeSnapshot().nodes };
    const edges = { edges: this._edges().takeSnapshot().edges };
    return { snapshotType: 'graph', nodes, edges };
  }

  updateHistory() {
    this.pushHistory(this.takeSnapshot());
  }
  //-------------History management----------------

  get nodes() {
    return this._nodes();
  }

  get edges() {
    return this._edges();
  }
}

export type GraphSnapshot = {
  snapshotType: 'graph';
  nodes: Omit<FullNodesSnapshot, 'snapshotType'>;
  edges: Omit<EdgeSnapshot, 'snapshotType'>;
};
