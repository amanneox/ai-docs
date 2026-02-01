import { CodeBlock } from "./code-block"

export const mdxComponents = {
  pre: ({ children, ...props }: any) => {
    const code = children?.props?.children || ""
    const className = children?.props?.className || ""
    const language = className.replace("language-", "") || "typescript"

    return (
      <CodeBlock
        code={code}
        language={language}
        showLineNumbers={true}
        className="my-4"
      />
    )
  },
  
  code: ({ children, className }: any) => {
    const isInline = !className
    
    if (isInline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      )
    }
    
    return <code className={className}>{children}</code>
  },

  h1: ({ children }: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl font-semibold mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-xl font-semibold mt-6 mb-3">{children}</h4>
  ),

  p: ({ children }: any) => (
    <p className="text-base leading-7 mb-4">{children}</p>
  ),

  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-base">{children}</li>
  ),

  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4">
      {children}
    </blockquote>
  ),

  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-primary underline hover:no-underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-muted">{children}</thead>
  ),
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => (
    <tr className="border-b border-border">{children}</tr>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-2">{children}</td>
  ),

  hr: () => <hr className="my-8 border-border" />,
}
