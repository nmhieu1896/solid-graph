import { createSignal } from 'solid-js';
import { BaseNode } from './BaseNode';
import type { BaseConstructorProps, INode, SliderRightFormProps } from './BaseNode';

export class BashNode extends BaseNode implements INode {
  attributes = {
    bash: '',
  };

  constructor(nodeInfo: BaseConstructorProps) {
    super(nodeInfo);
    this.type = 'bash';
  }

  get() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { element, ...currNode } = this.node();
    return { ...currNode, type: this.type, attributes: this.attributes };
  }

  SliderRightForm({ self, onSubmit }: SliderRightFormProps<BashNode>) {
    const [title, setTitle] = createSignal(self.node().title);
    const [bash, setBash] = createSignal('');
    const _onSubmit = (e) => {
      e.preventDefault();
      self.setNode({ ...self.node(), title: title() });
      self.attributes.bash = bash();
      onSubmit();
    };
    return (
      <form class="grid gap-5" onSubmit={_onSubmit}>
        <label>Title</label>
        <input type="text" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} />
        <label>Bash</label>
        <input value={bash()} onInput={(e) => setBash(e.currentTarget.value)} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
