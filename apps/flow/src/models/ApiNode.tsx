import { createSignal } from 'solid-js';
import { BaseNode } from './BaseNode';
import type { BaseConstructorProps, INode, SliderRightFormProps } from './BaseNode';

export class ApiNode extends BaseNode implements INode {
  attributes = {
    api: '',
  };

  constructor(nodeInfo: BaseConstructorProps) {
    super(nodeInfo);
    this.type = 'api';
  }

  get() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { element, ...currNode } = this.node();
    return { ...currNode, type: this.type, attributes: this.attributes };
  }

  SliderRightForm({ self, onSubmit }: SliderRightFormProps<ApiNode>) {
    const [title, setTitle] = createSignal(self.node().title);
    const [api, setApi] = createSignal('');
    const _onSubmit = (e) => {
      e.preventDefault();
      console.log({ self });
      self.setNode((currNode) => ({ ...currNode, title: title() }));
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
