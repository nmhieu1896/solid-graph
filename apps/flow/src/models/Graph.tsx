import axios from 'axios';
import { Nodes } from './Nodes';
import { Edge, EdgeSnapshot } from './Edge';
import { NodeInstance, NodeSnapshot } from './BaseNode';
import { Accessor, Setter, createSignal } from 'solid-js';

const data = await axios.get('https://platform-api.sens-vn.com/graph/1').then((data) => data.data.data[0]);

type GraphSnapshot = NodeSnapshot | EdgeSnapshot;
export class Graph {
  _nodes: Nodes;
  _edges: Edge;
  history: Record<string, GraphSnapshot>[] = [];
  historyIndex = -1;
  debounceTimer: any;

  constructor() {
    const nodes = new Nodes(data.nodes, this);
    const edges = new Edge(data.edges, this);
    this._nodes = nodes;
    this._edges = edges;
  }

  undo() {
    if (this.historyIndex <= -this.history.length) return;

    this.historyIndex = this.historyIndex - 1;
    const data = this.history.at(this.historyIndex);
    if (!data) return;

    Object.values(data).forEach((snapshot) => {
      if (snapshot.snapshotType === 'edge') {
        this.edges.useSnapshot(snapshot);
      } else {
        this.nodes.useSnapshot(snapshot);
      }
    });
  }

  redo() {
    if (this.historyIndex === -1) return;

    this.historyIndex = this.historyIndex + 1;
    const data = this.history.at(this.historyIndex);
    if (!data) return;

    Object.values(data).forEach((snapshot) => {
      if (snapshot.snapshotType === 'edge') {
        this.edges.useSnapshot(snapshot);
      } else {
        this.nodes.useSnapshot(snapshot);
      }
    });
  }

  pushHistory(data: GraphSnapshot) {
    const key = data.snapshotType === 'node' ? data?.id : 'edge';

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

  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }
}
