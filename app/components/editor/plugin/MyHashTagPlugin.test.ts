import { expect, test } from 'vitest';
import { REGEX } from './MyHashTagPlugin';

test('simple # match all', () => {
  const arr = ['foo', 'bar', 'baz'];

  arr.map(item => `#${item}`)
    .map(item => expect(REGEX.exec(item)?.[0]).equal(item));
});

test('no match', () => {
  const arr = ['apple', 'ba na na', '#', 'pounds sign at the end#', '         #', '#;', '#!', '#,'];

  arr.map(item => REGEX.exec(item))
    .map(item => expect(item).toBeNull());
});

test('can match chinese', () => {
  const arr = ['拉风', '帅气', '逼人'];

  arr.map(item => `#${item}`)
    .map(item => expect(REGEX.exec(item)?.[0]).equal(item));
});

test('hyphen would not be ignored', () => {
  const arr = ['foo-bar', 'bar-baz', '拉风---帅气____逼人'];
  arr.map(item => `#${item}`)
    .map(item => expect(REGEX.exec(item)?.[0]).equal(item));
});