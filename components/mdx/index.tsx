"use client"

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
            "relative rounded bg-secondary px-[0.3rem] py-[0.2rem] font-mono text-sm text-emerald-400",
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
        "mt-8 scroll-m-20 text-4xl font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-foreground",
        className
      )}
      {...props}
    />
  ),
  
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 text-muted-foreground [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc text-muted-foreground", className)} {...props} />
  ),
  
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal text-muted-foreground", className)} {...props} />
  ),
  
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-emerald-500/50 pl-6 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
  
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t border-border p-0", className)} {...props} />
  ),
  
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border border-border px-4 py-2 text-left font-bold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border border-border px-4 py-2 text-left text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  
  Callout,
  CodeBlock,
}

// Simple MDX component that renders children with proper styling
export function Mdx({ code, className }: MdxProps) {
  // For now, render a placeholder since we don't have contentlayer
  return (
    <div className={cn("mdx", className)}>
      <pre className="p-4 rounded-xl bg-secondary/50 border border-border overflow-auto">
        <code className="text-sm text-muted-foreground">{code}</code>
      </pre>
    </div>
  )
}

export function SimpleMdx({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mdx max-w-none", className)}>
      {children}
    </div>
  )
}
