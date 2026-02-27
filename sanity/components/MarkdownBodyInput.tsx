import { Box, Button, Card, Flex, Stack, Text, TextArea } from '@sanity/ui'
import React, { useCallback, useState } from 'react'
import { set, type InputProps } from 'sanity'

import { markdownToBlocks } from '~/sanity/lib/markdownToBlocks'

const PLACEHOLDER = `# 标题

正文段落，支持 **加粗**、*斜体*、\`行内代码\`、~~删除线~~、__下划线__。

## 二级标题

- 无序列表项
- 无序列表项

1. 有序列表项
2. 有序列表项

> 引用块内容

\`\`\`ts
// 代码块（可在 \`\`\` 后指定语言）
const hello = "world"
\`\`\`

[链接文本](https://example.com)`

export function MarkdownBodyInput(props: InputProps) {
  const [open, setOpen] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [mode, setMode] = useState<'replace' | 'append'>('replace')

  const handleConvert = useCallback(() => {
    if (!markdown.trim()) return
    const newBlocks = markdownToBlocks(markdown)
    if (newBlocks.length === 0) return

    if (mode === 'replace') {
      props.onChange(set(newBlocks))
    } else {
      const current = (props.value as unknown[]) ?? []
      props.onChange(set([...current, ...newBlocks]))
    }
    setMarkdown('')
    setOpen(false)
  }, [markdown, mode, props])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}

      <Flex>
        <Button
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={2}
          onClick={() => setOpen((v) => !v)}
          text={open ? '▲ 收起 Markdown 导入' : '▼ 从 Markdown 导入'}
        />
      </Flex>

      {open && (
        <Card border radius={2} padding={3} tone="primary">
          <Stack space={3}>
            <Text size={1} weight="semibold" muted>
              粘贴 Markdown 内容，自动转为富文本
            </Text>
            <TextArea
              fontSize={1}
              rows={12}
              value={markdown}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMarkdown(e.currentTarget.value)
              }
              placeholder={PLACEHOLDER}
              style={{ fontFamily: 'monospace', resize: 'vertical' }}
            />
            <Flex gap={2} align="center" wrap="wrap">
              <Button
                mode={mode === 'replace' ? 'default' : 'ghost'}
                tone={mode === 'replace' ? 'primary' : 'default'}
                fontSize={1}
                padding={2}
                onClick={() => setMode('replace')}
                text="替换全部内容"
              />
              <Button
                mode={mode === 'append' ? 'default' : 'ghost'}
                tone={mode === 'append' ? 'primary' : 'default'}
                fontSize={1}
                padding={2}
                onClick={() => setMode('append')}
                text="追加到末尾"
              />
              <Box flex={1} />
              <Button
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={() => setMarkdown('')}
                text="清除"
                disabled={!markdown}
              />
              <Button
                tone="positive"
                fontSize={1}
                padding={2}
                onClick={handleConvert}
                text="转换并导入"
                disabled={!markdown.trim()}
              />
            </Flex>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
