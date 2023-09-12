import { createSignal } from 'solid-js';
import { BaseNode } from './BaseNode';
import type { BaseConstructorProps, INode, SliderRightFormProps } from './BaseNode';

export class BashNode extends BaseNode implements INode {
  bash = '';

  constructor(nodeInfo: BaseConstructorProps) {
    super(nodeInfo);
    this.type = 'bash';
  }

  SliderRightForm({ self, onSubmit }: SliderRightFormProps<BashNode>) {
    const [title, setTitle] = createSignal(self.node().title);
    const [bash, setBash] = createSignal(self.node().title);
    const _onSubmit = () => {
      self.setNode({ ...self.node(), title: title() });
      this.bash = bash();
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