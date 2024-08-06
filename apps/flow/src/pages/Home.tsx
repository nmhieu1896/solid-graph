import { A } from '@solidjs/router';
import { For } from 'solid-js';

export default function Home() {
  return (
    <div class="px-20 py-10 grid grid-cols-4 gap-10">
      <h1 class="col-span-4 text-center text-5xl">HOME PAGE</h1>

      <For each={[]}>
        {(item) => (
          <A
            class="border border-red-400 p-5 hover:bg-lime-100 cursor-pointer"
            href={`/${item.projectId}`}
          >
            <p>Project Id: {item.projectId}</p>
            <h3>Project Name: {item.projectName}</h3>
          </A>
        )}
      </For>
    </div>
  );
}
