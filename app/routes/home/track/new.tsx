import { Tabs, type TabsProps } from 'antd';
import { BiCog } from 'react-icons/bi';
import { MdArticle } from 'react-icons/md';
import { TrackContent } from '~/components/track/content/TrackContent';

// todo
// global command to toggle between panel?
// conditionaly layout?
// could toggle between
// but when content is minimal, could display both?

const New = () => {
  const Config = <div>Config</div>;

  const items: TabsProps['items'] = [
    { key: 'content', label: <MdArticle />, children: <TrackContent /> },
    { key: 'config', label: <BiCog />, children: Config },
  ];

  return <main>
    <Tabs centered items={items} />
  </main>;
};

export default New;