import React from 'react';

// from https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/select-examples/films.tsx

function escapeRegExpChars(text) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

export function highlightText(text, query) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);

  if (words.length === 0) {
    return [text];
  }

  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens = [];

  let match = regexp.exec(text);
  while (match) {
    // const match = regexp.exec(text);
    // if (!match) {
    //   break;
    // }

    const { length } = match[0];
    const before = text.slice(lastIndex, regexp.lastIndex - length);

    if (before.length > 0) {
      tokens.push(before);
    }

    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);

    match = regexp.exec(text);
  }

  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }

  return tokens;
}
