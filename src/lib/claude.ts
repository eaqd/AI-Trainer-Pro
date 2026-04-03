import Anthropic from '@anthropic-ai/sdk'

export async function evaluatePrompt(
  apiKey: string,
  scenario: string,
  userPrompt: string
): Promise<{
  scores: { clarity: number; specificity: number; constraints: number; edgeCases: number; overall: number }
  feedback: string
  strengths: string[]
  improvements: string[]
  improvedPrompt: string
}> {
  const client = new Anthropic({ apiKey })

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
${userPrompt}
"""

Evaluate on these criteria (score each 1-5):
1. Clarity - Is the prompt clear and unambiguous?
2. Specificity - Does it include enough detail?
3. Constraints - Are there appropriate constraints/boundaries?
4. Edge Cases - Does it address potential edge cases?
5. Overall Quality - How effective is this prompt overall?

Respond with valid JSON only:
{
  "scores": { "clarity": N, "specificity": N, "constraints": N, "edgeCases": N, "overall": N },
  "feedback": "Overall assessment string",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "improvedPrompt": "An improved version of their prompt"
}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse evaluation response')
  return JSON.parse(jsonMatch[0])
}
