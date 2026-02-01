"use client"

import { useMDXComponent } from "next-contentlayer/hooks"
import { CodeBlock } from "./code-block"
import { Callout } from "./callout"
import { cn } from "@/lib/utils"

interface MdxProps {
  code: string
  className?: string
}

const mdxComponents = {
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <div className={cn("mb-4 mt-6 overflow-hidden rounded-lg", className)}>
      <pre {...props} />
    </div>
  ),
  
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes("language-")
    
    if (isInline) {
      return (
        <code
          className={cn(
            "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
            className
          )}
          {...props}
        >
          {children}
        </code>
      )
    }
    
    const language = className?.replace("language-", "") || "typescript"
    
    return (
      <CodeBlock
        code={String(children).replace(/\n$/, "")}
        language={language}
        showLineNumbers
      />
    )
  },
  
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-8 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic",
        className
      )}
      {...props}
    />
  ),
  
  hr: ({ ...props }) => <hr className="my-8" {...props} />,
  
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t p-0", className)} {...props} />
  ),
  
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  
  Callout,
  CodeBlock,
}

export function Mdx({ code, className }: MdxProps) {
  const Component = useMDXComponent(code)
  
  return (
    <div className={cn("mdx", className)}>
      <Component components={mdxComponents} />
    </div>
  )
}

export function SimpleMdx({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mdx prose prose-neutral dark:prose-invert max-w-none", className)}>
      {children}
    </div>
  )
}
