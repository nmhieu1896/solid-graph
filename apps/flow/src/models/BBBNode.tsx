import { createSignal } from 'solid-js';
import { BaseNode } from './BaseNode';
import type { BaseConstructorProps } from './BaseNode';
import { Graph } from './Graph';
import { INode, SliderRightFormProps } from './interfaces';

export class BBBNode extends BaseNode implements INode {
  attributes = {
    inputForBBB: '',
  };

  constructor(nodeInfo: BaseConstructorProps, graph: Graph) {
    super(nodeInfo, graph);
    this.type = 'BBB';
  }

  SliderRightForm({ self, onSubmit }: SliderRightFormProps<BBBNode>) {
    const [title, setTitle] = createSignal(self.node().title);
    const [value, setValue] = createSignal('');
    const _onSubmit = (e) => {
      e.preventDefault();

      self.setNode({ ...self.node(), title: title() });
      self.attributes.inputForBBB = value();
      onSubmit();
    };
    return (
      <form class="grid gap-5" onSubmit={_onSubmit}>
        <label>Title</label>
        <input type="text" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} />
        <label>Value for BBB Input</label>
        <input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
