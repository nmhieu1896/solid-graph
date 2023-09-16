import { Accessor, createSignal, Setter } from 'solid-js';
import { Edges } from './Edges';
import { Nodes } from './Nodes';
import { EdgeSnapshot, FullNodesSnapshot, GraphSnapshot, NodeSnapshot } from './interfaces';

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
    //key can be `${nodeId}` | `graph` | `edge` | `full-nodes`
    //each item in stack is {key1: snapshot, key2:snapshot, ...}
    //Multi keys is for different nodes/edges changes
    //  EXAMPLE Step1 : Drag NODE-A from posA1 -> posA2
    //  EXAMPLE Step2 : Drag NODE-B from posB1 -> posB2,
    //  EXAMPLE behavior: Stack should have 3 items, because we can undo/redo 2 times.
    //  EXAMPLE STACK : [ { NODE-A: { pos: posA1 } }
    //                    { NODE-A: { pos: posA2 } } ,{ NODE-B: {pos: posB1} }
    //                    { NODE-B: { pos: posB1 } } ]
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
    // Like examples Above, when we drag NODE-B, we have to store initial state of step B
    // But we previous state of Node A and initial state of B is not 2 steps, it just one step => store in same stack's item
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
