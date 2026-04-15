/**
 * Merender Strapi v5 rich text block array menjadi string HTML.
 * @param {Array} blocks - Array block dari field content Strapi
 * @returns {string} - HTML string
 */
export function renderStrapiBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';

  return blocks
    .map((block) => renderBlock(block))
    .join('');
}

function escapeHtml(text: any): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderChildren(children: any[]): string {
  if (!Array.isArray(children)) return '';
  return children.map((child) => renderInline(child)).join('');
}

function renderInline(node: any): string {
  if (!node) return '';

  // Teks biasa
  if (node.type === 'text') {
    let text = escapeHtml(node.text ?? '');
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strikethrough) text = `<s>${text}</s>`;
    if (node.code) text = `<code>${text}</code>`;
    return text;
  }

  // Link
  if (node.type === 'link') {
    const href = escapeHtml(node.url ?? '#');
    const inner = renderChildren(node.children);
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  }

  return '';
}

function renderBlock(block: any): string {
  if (!block) return '';

  switch (block.type) {
    case 'paragraph':
      return `<p>${renderChildren(block.children)}</p>`;

    case 'heading': {
      const level = block.level ?? 2;
      const tag = `h${Math.min(Math.max(level, 1), 6)}`;
      return `<${tag}>${renderChildren(block.children)}</${tag}>`;
    }

    case 'list': {
      const tag = block.format === 'ordered' ? 'ol' : 'ul';
      const items = (block.children ?? [])
        .map((item) => `<li>${renderChildren(item.children)}</li>`)
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }

    case 'quote':
      return `<blockquote>${renderChildren(block.children)}</blockquote>`;

    case 'code':
      return `<pre><code>${escapeHtml(block.children?.[0]?.text ?? '')}</code></pre>`;

    case 'image': {
      const { url, alternativeText, width, height } = block.image ?? {};
      if (!url) return '';
      const alt = escapeHtml(alternativeText ?? '');
      const widthAttr = width ? ` width="${width}"` : '';
      const heightAttr = height ? ` height="${height}"` : '';
      return `<img src="${escapeHtml(url)}" alt="${alt}"${widthAttr}${heightAttr} loading="lazy" />`;
    }

    case 'divider':
      return `<hr />`;

    default:
      // Fallback: render children jika ada
      if (block.children) {
        return `<p>${renderChildren(block.children)}</p>`;
      }
      return '';
  }
}
