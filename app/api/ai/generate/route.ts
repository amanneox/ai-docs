import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const isOpenAIConfigured = process.env.OPENAI_API_KEY && 
  process.env.OPENAI_API_KEY.startsWith("sk-") &&
  process.env.OPENAI_API_KEY.length > 20

const mockResponses: Record<string, (text: string) => string> = {
  improve: (text) => `${text}\n\n[Improved version with better clarity and professional tone. The text has been enhanced with proper structure and refined language while maintaining the original meaning.]`,
  summarize: (text) => `Summary:\n• ${text.substring(0, 100)}...\n• Key point extracted from the content\n• Main idea condensed for quick reference`,
  expand: (text) => `${text}\n\n[Expanded with additional details, examples, and explanations to provide more comprehensive coverage of the topic. This includes relevant context, supporting arguments, and practical applications.]`,
  ideas: (text) => `Related Ideas & Topics:\n1. ${text.substring(0, 50)}... development\n2. Advanced strategies for implementation\n3. Best practices and common pitfalls\n4. Future trends and considerations\n5. Integration with existing workflows`,
  custom: (text) => `[AI Response]: Based on your request "${text.substring(0, 100)}...", here's a thoughtful response with relevant information, structured clearly and professionally.`,
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { prompt, documentId, stream = false, action = "custom" } = body

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    if (!isOpenAIConfigured) {
      console.log("[AI_GENERATE] Using mock response (OpenAI not configured)")
      
      const textMatch = prompt.match(/:\\s*([\\s\\S]+)$/)
      const text = textMatch ? textMatch[1].trim() : prompt
      
      const mockKey = Object.keys(mockResponses).find(key => prompt.toLowerCase().includes(key)) || "custom"
      const mockResponse = mockResponses[mockKey](text)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({
        content: mockResponse,
        model: "mock-gpt-4o-mini",
        usage: { promptTokens: 100, completionTokens: 150, totalTokens: 250 },
        mock: true,
      })
    }

    try {
      const { openai } = await import("@ai-sdk/openai")
      const { generateText } = await import("ai")

      const systemPrompt = `You are an AI writing assistant integrated into AI Docs, a collaborative documentation platform. 
Your task is to help users improve their writing, generate content, and provide suggestions.

Guidelines:
- Be concise and professional
- Maintain the original tone unless asked otherwise
- Format output in Markdown
- For code examples, use proper syntax highlighting with language tags
- When expanding content, add relevant details and examples
- When summarizing, capture the key points accurately

Respond directly with the generated content without additional commentary.`

      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 2000,
      })

      return NextResponse.json({
        content: result.text,
        model: "gpt-4o-mini",
        usage: result.usage,
      })
    } catch (openaiError) {
      console.error("[AI_GENERATE] OpenAI error:", openaiError)
      
      const textMatch = prompt.match(/:\\s*([\\s\\S]+)$/)
      const text = textMatch ? textMatch[1].trim() : prompt
      const mockKey = Object.keys(mockResponses).find(key => prompt.toLowerCase().includes(key)) || "custom"
      
      return NextResponse.json({
        content: mockResponses[mockKey](text),
        model: "mock-fallback",
        usage: { promptTokens: 100, completionTokens: 150, totalTokens: 250 },
        mock: true,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("[AI_GENERATE] Error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
