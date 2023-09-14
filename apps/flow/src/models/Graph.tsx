import axios from 'axios';
import { Nodes } from './Nodes';
import { Edge } from './Edge';

const data = await axios.get('https://platform-api.sens-vn.com/graph/1').then((data) => data.data.data[0]);

export class Graph {
  _nodes: Nodes;
  _edges: Edge;
  constructor() {
    const nodes = new Nodes(data.nodes);
    const edges = new Edge(data.edges);
    this._nodes = nodes;
    this._edges = edges;
  }

  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }
}
