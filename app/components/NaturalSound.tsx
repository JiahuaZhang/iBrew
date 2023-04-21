import { FiMusic } from 'react-icons/fi';
import { Bird } from './NaturalSound/Bird';
import { Cricket } from './NaturalSound/Cricket';
import { Fire } from './NaturalSound/Fire';
import { Ocean } from './NaturalSound/Ocean';
import { Rain } from './NaturalSound/Rain';
import { Thunder } from './NaturalSound/Thunder';
import { Waterfall } from './NaturalSound/Waterfall';
import { Wind } from './NaturalSound/Wind';
import { useQueryState } from './hook/useQueryState';

export const NaturalSound = () => {
  const { state, toggle } = useQueryState('tool', 'sound');

  return <div className={`${state ? '' : 'inline-block'}`} >
    <FiMusic
      className='text-5xl cursor-pointer hover:text-blue-800'
      onClick={toggle}
    />
    <div
      className={`overflow-hidden transition-all ease-in-out duration-300 ${state ? 'w-[10rem]' : 'w-0 h-0 opacity-0'}`}
    >
      Natural Sound
      <br />
      <Rain />
      <Ocean />
      <Waterfall />
      <Thunder />
      <Wind />
      <Bird />
      <Cricket />
      <Fire />
    </div>
  </div>;
};