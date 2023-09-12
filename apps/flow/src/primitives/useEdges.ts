import { Edge } from '_@models/edge';

export const edge = new Edge({
  '1': ['2', '3'],
  '2': ['4'],
});

{
  document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      edge.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  });

  document.addEventListener('mouseup', (e) => {
    const target = e.target;
    queueMicrotask(() => {
      //Defer
      edge.edgeSrc = undefined;
      edge.mousePos = undefined;
    });
    if (!(target instanceof HTMLElement)) return;

    edge.createEdge(target?.dataset?.nodeId || target?.parentElement?.dataset?.nodeId);
  });

  document.addEventListener('mousemove', (e) => {
    if (!edge.edgeSrc) return;
    edge.mousePos = { x: e.clientX, y: e.clientY };
  });
}
