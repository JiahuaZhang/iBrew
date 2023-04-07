import { computed, effect, Signal, signal } from '@preact/signals-react';
import { CSSProperties } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  path: React.ReactNode;
  src: string;
  viewBoxDimension: number;
};

type ButtonProps = {
  id: string;
  isPlaying: Signal<boolean>,
  audio: Signal<HTMLAudioElement | null>;
  style: Signal<CSSProperties>;
} & Props;

const DIMENSION = 40;
const VIEW_BOX_DIMENSION = 20;

const SignalSoundButton = ({ id, isPlaying, audio, style, path, src, viewBoxDimension }: ButtonProps) => {
  return <svg
    className='inline-grid'
    viewBox={`0 0 ${VIEW_BOX_DIMENSION} ${VIEW_BOX_DIMENSION}`}
    width={DIMENSION}
    height={DIMENSION}
  >
    <clipPath
      id={id}
      transform={`scale(${VIEW_BOX_DIMENSION / viewBoxDimension})`}
    >
      {path}
    </clipPath>
    <foreignObject
      x="0"
      y="0"
      width={DIMENSION}
      height={DIMENSION}
      clipPath={`url(#${id})`}>
      <audio loop ref={r => audio.value = r} >
        <source src={src} type='audio/mpeg' />
      </audio>

      <div
        onClick={() => isPlaying.value = !isPlaying.value}
        style={style.value}
        className={`cursor-pointer w-full h-full bg-[length:200%_200%] ${isPlaying.value ? 'animate-flow' : ''}`}
      />
    </foreignObject>
  </svg>;
};

export const SoundButton = ({ path, src, viewBoxDimension }: Props) => {
  const isPlaying = signal(false);
  const audio = signal<HTMLAudioElement | null>(null);

  effect(() => {
    if (isPlaying.value) {
      audio.value?.play();
    } else {
      audio.value?.pause();
    }
  });

  const style: Signal<CSSProperties> = computed(() => {
    return isPlaying.value
      ? { backgroundImage: 'linear-gradient(45deg, #ff4800, #dfd902, #20dc68, #0092f4, #da54d8)' }
      : { backgroundColor: 'black' };
  });

  return <SignalSoundButton
    viewBoxDimension={viewBoxDimension}
    id={uuidv4()}
    isPlaying={isPlaying}
    audio={audio}
    style={style}
    path={path}
    src={src}
  />;
};