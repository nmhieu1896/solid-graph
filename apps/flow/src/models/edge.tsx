import { Accessor, Setter, createSignal } from 'solid-js';

type EdgeMap = Record<string, string[]>;
type Point = { x: number; y: number };

export class Edge {
  private _edges: Accessor<EdgeMap>;
  private _setEdge: Setter<EdgeMap>;
  private _edgeSrc: Accessor<string | undefined>;
  private _setEdgeSrc: Setter<string | undefined>;
  private _mousePos: Accessor<Point | undefined>;
  private _setMousePos: Setter<Point | undefined>;

  constructor(initEdge: EdgeMap) {
    const [edgeSrc, setEdgeSrc] = createSignal<string>();
    const [edges, setEdges] = createSignal(initEdge, { equals: false });
    const [mousePos, setMousePos] = createSignal<Point>();
    this._edges = edges;
    this._setEdge = setEdges;
    this._edgeSrc = edgeSrc;
    this._setEdgeSrc = setEdgeSrc;
    this._mousePos = mousePos;
    this._setMousePos = setMousePos;
  }

  get edges() {
    return this._edges();
  }
  set edges(edges: EdgeMap) {
    this._setEdge(edges);
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
    this._setMousePos(pos);
  }

  allowEdgeCreation(targetNodeId?: string): targetNodeId is string {
    return Boolean(this._edgeSrc() && targetNodeId && this._edgeSrc() !== targetNodeId);
  }

  createEdge(targetNodeId?: string) {
    if (!this.allowEdgeCreation(targetNodeId)) return;
    const src = this._edgeSrc() as string;

    const newEdges = this._edges();
    const currentFromId = newEdges[src];
    if (!currentFromId) {
      newEdges[src] = [targetNodeId];
    } else if (!currentFromId.includes(targetNodeId)) {
      currentFromId.push(targetNodeId);
    }
    this._setEdge(newEdges);
  }

  deleteEdge(fromId: string, toId: string) {
    const newEdges = this._edges();
    const currentFromId = newEdges[fromId];
    if (!currentFromId) return;

    newEdges[fromId] = currentFromId.filter((id) => id !== toId);
    console.log(newEdges);
    this._setEdge(newEdges);
  }
}
