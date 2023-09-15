import { Accessor, Setter, createSignal } from 'solid-js';
import { Graph } from './Graph';
import { ISnapshot } from './interfaces';

type EdgeMap = Record<string, string[]>;

export class Edges implements ISnapshot<EdgeSnapshot> {
  private _edges: Accessor<EdgeMap>;
  private _setEdges: Setter<EdgeMap>;
  private _edgeSrc: Accessor<string | undefined>;
  private _setEdgeSrc: Setter<string | undefined>;
  private _mousePos: Accessor<Point | undefined>;
  private _setMousePos: Setter<Point | undefined>;
  private graph?: Graph;

  constructor(initEdge: EdgeMap, graph: Graph) {
    const [edgeSrc, setEdgeSrc] = createSignal<string>();
    const [edges, setEdges] = createSignal(initEdge, { equals: false });
    const [mousePos, setMousePos] = createSignal<Point>();
    this._edges = edges;
    this._setEdges = setEdges;
    this._edgeSrc = edgeSrc;
    this._setEdgeSrc = setEdgeSrc;
    this._mousePos = mousePos;
    this._setMousePos = setMousePos;
    this.graph = graph;
  }

  takeSnapshot() {
    return {
      snapshotType: 'edge',
      edges: this._edges(),
    } as const;
  }
  useSnapshot(edge: Omit<EdgeSnapshot, 'snapshotType'>) {
    return this._setEdges(edge.edges);
  }

  updateHistory() {
    this.graph.pushHistory(this.takeSnapshot());
  }

  setEdges(edges: EdgeMap) {
    this.updateHistory();
    this._setEdges(edges);
    this.updateHistory();
  }

  get edges() {
    return this._edges();
  }

  get edgeSrc() {
    return this._edgeSrc();
  }
  set edgeSrc(src: string | undefined) {
    this._setEdgeSrc(src);
  }
  get mousePos() {
    return this._mousePos();
  }
  set mousePos(pos: Point | undefined) {
    if (!this._edgeSrc) return;
    this._setMousePos(pos);
  }

  allowEdgeCreation(targetNodeId?: string): targetNodeId is string {
    return Boolean(this._edgeSrc() && targetNodeId && this._edgeSrc() !== targetNodeId);
  }

  createEdge(targetNodeId?: string) {
    if (!this.allowEdgeCreation(targetNodeId)) return;
    const src = this._edgeSrc() as string;

    const newEdges = structuredClone(this._edges());
    const currentFromId = newEdges[src];
    if (!currentFromId) {
      newEdges[src] = [targetNodeId];
    } else if (!currentFromId.includes(targetNodeId)) {
      currentFromId.push(targetNodeId);
    }
    this.setEdges(newEdges);
  }

  removeEdge(fromId: string, toId: string) {
    const newEdges = structuredClone(this._edges());
    const currentFromId = newEdges[fromId];
    if (!currentFromId) return;

    newEdges[fromId] = currentFromId.filter((id) => id !== toId);

    this.setEdges(newEdges);
  }

  removeEdgeByNodeId(nodeId: string) {
    const newEdges = {};
    Object.keys(this._edges()).forEach((fromId) => {
      if (nodeId === fromId) return;
      newEdges[fromId] = this._edges()[fromId].filter((id) => id !== nodeId);
    });
    this._setEdges(newEdges);
  }

  clearDraggingEdge() {
    queueMicrotask(() => {
      //Defer
      this._setEdgeSrc(undefined);
      this._setMousePos(undefined);
    });
  }
}

export type EdgeSnapshot = {
  snapshotType: 'edge';
  edges: EdgeMap;
};
