import { Edge } from '_@models/Edge';
import axios from 'axios';
import { createEffect } from 'solid-js';

const res: any = await axios.get('https://platform-api.sens-vn.com/graph/1').then((data) => data.data.data[0].edges);

export const edge = new Edge(res);
// export const edge = new Edge({
//   '1': ['2', '3'],
//   '2': ['4'],
// });

let debounce: any;
createEffect(() => {
  const newEdges = edge.edges;

  clearTimeout(debounce);

  debounce = setTimeout(
    () =>
      axios.patch('https://platform-api.sens-vn.com/graph/1', {
        projectId: '1',
        edges: newEdges,
      }),
    2000,
  );
});

{
  document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      edge.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  });

  document.addEventListener('mouseup', (e: any) => {
    edge.clearDraggingEdge();
    edge.createEdge(e.target?.dataset?.nodeId || e.target?.parentElement?.dataset?.nodeId);
  });

  document.addEventListener('mousemove', (e) => {
    edge.mousePos = { x: e.clientX, y: e.clientY };
  });
}
