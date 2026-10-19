// A very small markdown reader, just enough for the texts in public/texts:
//   ## heading          > quote line          *** alone: a break between texts
//   *italic*  **bold**  ***both***   [a link](https://…)   [a dead link](dead:https://…)
//   ![caption](img/file.webp "left")   alone on its line: a picture beside the text
//   a blank line starts a new paragraph, a single line break stays a line break.
// Everything is HTML-escaped first, so the output is safe to inject.

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The opening and closing stars must touch a word, so footnote stars
// ("* Note…", "pète** de rire") stay as they are.
function inline(text) {
  return escapeHtml(text)
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // A link whose site is gone: the words stay, with a note saying where they led
    .replace(/\[([^\]\n]+)\]\(dead:https?:\/\/(?:www\.)?([^\s/)]+)[^\s)]*\)/g,
      '<span class="reader__dead">$1</span> <small class="reader__dead-note">(lien vers $2, site disparu)</small>')
    .replace(/\*\*\*(?=\S)([^*\n]*?\S)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(?=\S)([^*\n]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?=[^\s*])([^*\n]*?[^\s*])\*(?!\*)/g, '$1<em>$2</em>');
}

// base: where the text lives, so a picture's relative path can be resolved
export function renderMarkdown(source, base = '') {
  const out = [];
  let para = [];
  let quote = [];
  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map(inline).join('<br>')}</p>`);
    para = [];
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote><p>${quote.map(inline).join('<br>')}</p></blockquote>`);
    quote = [];
  };

  source.replace(/\r\n?/g, '\n').split('\n').forEach((raw) => {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) {
      flushPara();
      flushQuote();
    } else if (/^!\[[^\]]*\]\([^)\s]+(?:\s+"(?:left|right)")?\)$/.test(line.trim())) {
      flushPara();
      flushQuote();
      const [, cap, src, side] = line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"(left|right)")?\)$/);
      const url = /^(https?:)?\//.test(src) ? src : base + src;
      out.push(
        `<figure class="reader__fig reader__fig--${side || 'right'}">` +
          `<img src="${escapeHtml(url)}" alt="${escapeHtml(cap)}" loading="lazy">` +
          (cap ? `<figcaption>${inline(cap)}</figcaption>` : '') +
          '</figure>'
      );
    } else if (line.trim() === '***') {
      flushPara();
      flushQuote();
      out.push('<hr>');
    } else if (/^#{1,6}\s/.test(line)) {
      flushPara();
      flushQuote();
      out.push(`<h2>${inline(line.replace(/^#+\s+/, ''))}</h2>`);
    } else if (/^>\s?/.test(line)) {
      flushPara();
      quote.push(line.replace(/^>\s?/, ''));
    } else {
      flushQuote();
      para.push(line);
    }
  });
  flushPara();
  flushQuote();
  return out.join('\n');
}
