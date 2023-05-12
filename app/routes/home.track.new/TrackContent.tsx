import { signal } from '@preact/signals-react';

const title = signal('Temporary title');
const content = signal({});
const tags = signal<string[]>(['tag1', 'tag2']);

export const TrackContent = () => {

  return <div className='border-2 border-gray-200' >
    <input
      type="text"
      value={title.value}
      onChange={(e) => title.value = e.target.value}
    />

    <section>
      Editor part
    </section>

    <section>
      tag parts
    </section>
  </div>;
};