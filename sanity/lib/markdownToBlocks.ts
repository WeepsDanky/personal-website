/**
 * Converts Markdown text to Sanity Portable Text blocks.
 *
 * Supported:
 *   Block-level: headings (h1–h4), paragraphs, blockquotes,
 *                bullet lists, numbered lists, fenced code blocks, horizontal rules
 *   Inline:      **bold**, *italic*, `code`, ~~strikethrough~~,
 *                __underline__, [link](url)
 */

type Span = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

type MarkDef = {
  _type: 'link'
  _key: string
  href: string
}

type PTBlock = {
  _type: 'block'
  _key: string
  style: string
  markDefs: MarkDef[]
  children: Span[]
  listItem?: 'bullet' | 'number'
  level?: number
}

type CodeBlock = {
  _type: 'codeBlock'
  _key: string
  language?: string
  filename?: string
  code: string
}

export type PortableTextBlock = PTBlock | CodeBlock

function k(): string {
  return Math.random().toString(36).slice(2, 10)
}

function block(
  style: string,
  children: Span[],
  markDefs: MarkDef[],
  listItem?: 'bullet' | 'number',
  level?: number
): PTBlock {
  const b: PTBlock = { _type: 'block', _key: k(), style, markDefs, children }
  if (listItem) { b.listItem = listItem; b.level = level ?? 1 }
  return b
}

// Inline regex — order matters: code first, then bold-italic, bold, underline, italic, strike, link
const INLINE_RE =
  /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g

function parseInline(text: string): { spans: Span[]; markDefs: MarkDef[] } {
  INLINE_RE.lastIndex = 0
  const markDefs: MarkDef[] = []
  const parts: { text: string; marks: string[] }[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), marks: [] })
    }
    const token = match[0]
    if (token[0] === '`') {
      parts.push({ text: token.slice(1, -1), marks: ['code'] })
    } else if (token.startsWith('***')) {
      parts.push({ text: token.slice(3, -3), marks: ['strong', 'em'] })
    } else if (token.startsWith('**')) {
      parts.push({ text: token.slice(2, -2), marks: ['strong'] })
    } else if (token.startsWith('__')) {
      parts.push({ text: token.slice(2, -2), marks: ['underline'] })
    } else if (token.startsWith('~~')) {
      parts.push({ text: token.slice(2, -2), marks: ['strike-through'] })
    } else if (token[0] === '*' || token[0] === '_') {
      parts.push({ text: token.slice(1, -1), marks: ['em'] })
    } else if (token[0] === '[') {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (m) {
        const linkKey = k()
        markDefs.push({ _type: 'link', _key: linkKey, href: m[2] })
        parts.push({ text: m[1], marks: [linkKey] })
      } else {
        parts.push({ text: token, marks: [] })
      }
    } else {
      parts.push({ text: token, marks: [] })
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), marks: [] })
  }

  return {
    spans: parts
      .filter((p) => p.text.length > 0)
      .map((p) => ({ _type: 'span' as const, _key: k(), text: p.text, marks: p.marks })),
    markDefs,
  }
}

function makeSpans(text: string): { children: Span[]; markDefs: MarkDef[] } {
  const { spans, markDefs } = parseInline(text)
  const children: Span[] =
    spans.length > 0 ? spans : [{ _type: 'span', _key: k(), text, marks: [] }]
  return { children, markDefs }
}

export function markdownToBlocks(markdown: string): PortableTextBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: PortableTextBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // --- Fenced code block ---
    if (line.startsWith('```')) {
      const meta = line.slice(3).trim()
      const [lang, ...rest] = meta.split(' ')
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({
        _type: 'codeBlock',
        _key: k(),
        ...(lang ? { language: lang } : {}),
        ...(rest.length > 0 ? { filename: rest.join(' ') } : {}),
        code: codeLines.join('\n'),
      })
      i++ // skip closing ```
      continue
    }

    // --- Headings ---
    const hMatch = line.match(/^(#{1,4}) (.+)$/)
    if (hMatch) {
      const { children, markDefs } = makeSpans(hMatch[2])
      blocks.push(block(`h${hMatch[1].length}`, children, markDefs))
      i++
      continue
    }

    // --- Horizontal rule ---
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      i++
      continue
    }

    // --- Blockquote ---
    if (line.startsWith('> ') || line === '>') {
      const text = line.startsWith('> ') ? line.slice(2) : ''
      const { children, markDefs } = makeSpans(text)
      blocks.push(block('blockquote', children, markDefs))
      i++
      continue
    }

    // --- Bullet list ---
    const bulletMatch = line.match(/^(\s*)([-*+]) (.+)$/)
    if (bulletMatch) {
      const level = Math.floor(bulletMatch[1].length / 2) + 1
      const { children, markDefs } = makeSpans(bulletMatch[3])
      blocks.push(block('normal', children, markDefs, 'bullet', level))
      i++
      continue
    }

    // --- Numbered list ---
    const numMatch = line.match(/^(\s*)\d+\. (.+)$/)
    if (numMatch) {
      const level = Math.floor(numMatch[1].length / 2) + 1
      const { children, markDefs } = makeSpans(numMatch[2])
      blocks.push(block('normal', children, markDefs, 'number', level))
      i++
      continue
    }

    // --- Empty line ---
    if (line.trim() === '') {
      i++
      continue
    }

    // --- Paragraph (accumulate consecutive plain lines) ---
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^#{1,4} /) &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !lines[i].match(/^(\s*)([-*+]) /) &&
      !lines[i].match(/^(\s*)\d+\. /) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }

    if (paraLines.length > 0) {
      const { children, markDefs } = makeSpans(paraLines.join(' '))
      blocks.push(block('normal', children, markDefs))
    }
  }

  return blocks
}
