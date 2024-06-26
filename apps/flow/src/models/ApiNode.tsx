import { createSignal } from 'solid-js';
import { BaseNode } from './BaseNode';
import type { BaseConstructorProps } from './BaseNode';
import { Graph } from './Graph';
import { INode, SliderRightFormProps } from './interfaces';

export class ApiNode extends BaseNode implements INode {
  attributes = {
    api: '',
  };

  constructor(nodeInfo: BaseConstructorProps, graph: Graph) {
    super(nodeInfo, graph);
    this.type = 'api';
  }

  SliderRightForm({ self, onSubmit }: SliderRightFormProps<ApiNode>) {
    const [title, setTitle] = createSignal(self.node().title);
    const [api, setApi] = createSignal('');
    const _onSubmit = (e) => {
      e.preventDefault();

      self.setNode({ ...self.node(), title: title() });
      self.attributes.api = api();
      onSubmit();
    };
    return (
      <form class="grid gap-5" onSubmit={_onSubmit}>
        <label>Title</label>
        <input type="text" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} />
        <label>API</label>
        <input value={api()} onInput={(e) => setApi(e.currentTarget.value)} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
