import { Nodes } from '_@models/Nodes';

//----------- Node And Edge-------------
export const nodes = new Nodes([
  { type: 'api', id: '1', pos: { x: 0, y: 0 }, title: 'Node 1' },
  { type: 'api', id: '2', pos: { x: 250, y: 100 }, title: 'Node 2' },
  { type: 'api', id: '3', pos: { x: 500, y: -100 }, title: 'Node 3' },
  { type: 'bash', id: '4', pos: { x: 600, y: 300 }, title: 'Node 4' },
  { type: 'bash', id: '5', pos: { x: 300, y: 300 }, title: 'Node 5' },
]);
