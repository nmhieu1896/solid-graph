import { Accessor, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

type Props = {
  children: any;
  open: Accessor<boolean>;
  onClose: () => void;
};

export default function Modal({ children, open, onClose }: Props) {
  return (
    <Show when={open()}>
      <Portal>
        <div class="w-[100vw] h-[100vh] relative">
          <div
            class="bg-slate-500 opacity-25 absolute top-0 left-0 w-full h-full animate-fade-in-to-o30"
            onClick={onClose}
          />

          <div class="w-[45vw] h-full absolute right-0 top-0 bg-white animate-slide-over">{children}</div>
        </div>
      </Portal>
    </Show>
  );
}
