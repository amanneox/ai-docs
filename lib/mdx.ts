import { compileMDX } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx/mdx-components"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

export async function compileMDXContent(content: string) {
  const { content: compiledContent, frontmatter } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight, rehypeSlug],
      },
    },
  })

  return {
    content: compiledContent,
    frontmatter,
  }
}

export function isMDXContent(content: string): boolean {
  const mdxPatterns = [
    /<[A-Z][a-zA-Z]*/g, // JSX components
    /\{[^}]*\}/g, // JSX expressions
    /---\s*\n[\s\S]*?\n---/g, // Frontmatter
  ]

  return mdxPatterns.some((pattern) => pattern.test(content))
}

export function extractFrontmatter(content: string): Record<string, any> {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
  
  if (!frontmatterMatch) {
    return {}
  }

  const frontmatterText = frontmatterMatch[1]
  const frontmatter: Record<string, any> = {}

  frontmatterText.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":")
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim()
      try {
        frontmatter[key.trim()] = JSON.parse(value)
      } catch {
        frontmatter[key.trim()] = value
      }
    }
  })

  return frontmatter
}
