import type { LinksFunction } from '@remix-run/node';
import { TrackContent } from '~/routes/home.track_.new/TrackContent';
import editorCSS from './PlaygroundEditorTheme.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: editorCSS }];

const New = () => {
  return <TrackContent />;
};

export default New;