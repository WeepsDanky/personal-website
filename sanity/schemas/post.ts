import { defineField, defineType } from 'sanity'
import { z } from 'zod'

import { PencilSwooshIcon } from '~/assets'
import { MarkdownBodyInput } from '~/sanity/components/MarkdownBodyInput'
import { readingTimeType } from '~/sanity/schemas/types/readingTime'

export const Post = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  mainImage: z
    .object({
      _ref: z.string(),
      asset: z.object({
        url: z.string(),
        lqip: z.string().optional(),
        dominant: z
          .object({
            background: z.string(),
            foreground: z.string(),
          })
          .optional(),
        dimensions: z
          .object({
            width: z.number(),
            height: z.number(),
            aspectRatio: z.number(),
          })
          .optional(),
      }),
    })
    .optional()
    .nullable(),
  publishedAt: z.string(),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  body: z.any(),
  readingTime: z.number(),
  mood: z.enum(['happy', 'sad', 'neutral']),
})
export type Post = z.infer<typeof Post>
export type PostDetail = Post & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headings: any[]
  related?: Post[]
}

export default defineType({
  name: 'post',
  title: '文章',
  type: 'document',
  icon: PencilSwooshIcon,
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '内容',
      type: 'blockContent',
      components: {
        input: MarkdownBodyInput,
      },
    }),
    defineField({
      name: 'mainImage',
      title: '主图',
      type: 'image',
      description:
        '文章封面图（可选）。未上传时将根据标题自动生成渐变封面。/ Cover image (optional). A gradient cover is auto-generated from the title when not provided.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'slug',
      title: '链接标识符',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            ? input
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '')
                .slice(0, 96)
            : crypto.randomUUID(),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: '分类',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: '阅读时长（分钟）',
      type: readingTimeType.name,
      validation: (Rule) => Rule.required(),
      options: {
        source: 'body',
      },
    }),
    defineField({
      name: 'mood',
      title: '文章情绪',
      type: 'string',
      options: {
        list: [
          { title: 'Neutral', value: 'neutral' },
          { title: 'Happy', value: 'happy' },
          { title: 'Sad', value: 'sad' },
        ],
        layout: 'radio',
      },
    }),
  ],

  initialValue: () => ({
    publishedAt: new Date().toISOString(),
    mood: 'neutral',
    readingTime: 0,
  }),

  preview: {
    select: {
      title: 'title',
      author: 'slug',
      media: 'mainImage',
    },
  },
})
