import { AutoLinkPlugin, createLinkMatcherWithRegExp, } from '@lexical/react/LexicalAutoLinkPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
// todo? for paste & toggle
// import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin'

const URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const MATCHERS = [createLinkMatcherWithRegExp(URL_REGEX, (text) => text.startsWith('http') ? text : `https://${text}`)];

export const MyLinkPlugin = () => {
  return <>
    <AutoLinkPlugin matchers={MATCHERS} />
    <LexicalClickableLinkPlugin />
  </>;
};