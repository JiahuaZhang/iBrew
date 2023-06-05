import { ContentEditor } from './ContentEditor';

// todo, sync up all state, include child part as well
// todo, remove tag (editor itself would include tags, config option (flat 2d on its own))
export const TrackContent = () => {

  return <div className='border-0 border-gray-200 w-full' >
    <ContentEditor />
    {/* todo: add button to svae, control / command + s to auto save */}
  </div>;
};