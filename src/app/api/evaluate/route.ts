import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userResponse, scenario } = body

    // Get API key from settings
    const settings = await prisma.userSettings.findUnique({
      where: { id: 'default' },
    })

    if (!settings?.apiKey) {
      return NextResponse.json({
        feedback: 'To get AI-powered feedback on your prompt writing, please add your Claude API key in Settings. For now, here are general tips:\n\n1. Be specific about what you want\n2. Include constraints and format requirements\n3. Consider edge cases\n4. Specify the target audience\n5. Include examples when helpful',
        score: null,
        aiPowered: false,
      })
    }

    // Use Claude API for evaluation
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: settings.apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert AI training evaluator. Evaluate the following prompt written by a trainee.

Scenario: ${scenario}

Trainee's prompt:
"""
${userResponse}
"""

Evaluate on these criteria (score each 1-5):
1. Clarity - Is the prompt clear and unambiguous?
2. Specificity - Does it include enough detail?
3. Constraints - Are there appropriate constraints/boundaries?
4. Edge Cases - Does it address potential edge cases?
5. Overall Quality - How effective is this prompt overall?

Provide:
- A score for each criterion (1-5)
- An overall score (1-5)
- Specific feedback on what was done well
- Specific suggestions for improvement
- An example of how the prompt could be improved

Format your response as JSON with this structure:
{
  "scores": { "clarity": N, "specificity": N, "constraints": N, "edgeCases": N, "overall": N },
  "feedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "improvedPrompt": "string"
}`,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    let evaluation
    try {
      // Try to parse as JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : { feedback: responseText }
    } catch {
      evaluation = { feedback: responseText }
    }

    return NextResponse.json({
      ...evaluation,
      aiPowered: true,
    })
  } catch (error) {
    console.error('Error evaluating prompt:', error)
    return NextResponse.json({
      feedback: 'Failed to evaluate with AI. Please check your API key in Settings.',
      score: null,
      aiPowered: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
