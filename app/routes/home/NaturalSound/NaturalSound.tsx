import { FiMusic } from 'react-icons/fi';
import { Bird } from './Bird';
import { Cricket } from './Cricket';
import { Fire } from './Fire';
import { Ocean } from './Ocean';
import { Rain } from './Rain';
import { Thunder } from './Thunder';
import { Waterfall } from './Waterfall';
import { Wind } from './Wind';
import { useQueryState } from '../../../components/hook/useQueryState';

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