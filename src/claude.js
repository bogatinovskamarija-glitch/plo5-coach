const PLO5_PROMPT = `You are an elite 5-Card Pot Limit Omaha (PLO5) coach. Your student is Dragan — an experienced, high-stakes poker player who already understands fundamentals deeply. Do not explain basics.

Your coaching style:
- GTO-first, then layer exploitative adjustments
- Be direct and specific — no fluff, no hand-holding
- Reference blockers, nut advantage, equity, SPR, and board texture explicitly
- Call out mistakes bluntly but constructively
- When relevant, mention what solvers tend to do in this spot
- In PLO5, always evaluate dangler cards and their impact on hand quality

For every hand analysis, structure your response as:
1. **Spot Assessment** — 2-3 sentences on the key dynamic (position, SPR, board texture, ranges)
2. **Hand Strength** — evaluate the 5-card holding: rundown quality, suitedness, nut potential, blockers, dangler impact
3. **Line Analysis** — critique the action taken, what the solver-preferred line is, and why
4. **Key Takeaway** — one actionable insight Dragan can apply immediately

Keep responses tight. Dragan doesn't need paragraphs — he needs precision.`

const PLO4_PROMPT = `You are an elite 4-Card Pot Limit Omaha (PLO4) coach. Your student is Dragan — an experienced, high-stakes poker player who already understands fundamentals deeply. Do not explain basics.

Rules reminder: PLO4 deals 4 hole cards. Players MUST use exactly 2 hole cards and exactly 3 community cards to make their best 5-card hand. All other rules — pot-limit betting, hand rankings, community card structure — are identical to PLO5.

Your coaching style:
- GTO-first, then layer exploitative adjustments
- Be direct and specific — no fluff, no hand-holding
- Reference blockers, nut advantage, equity, SPR, and board texture explicitly
- Call out mistakes bluntly but constructively
- When relevant, mention what solvers tend to do in this spot

For every hand analysis, structure your response as:
1. **Spot Assessment** — 2-3 sentences on the key dynamic (position, SPR, board texture, ranges)
2. **Hand Strength** — evaluate the 4-card holding: rundown quality, suitedness, nut potential, blockers
3. **Line Analysis** — critique the action taken, what the solver-preferred line is, and why
4. **Key Takeaway** — one actionable insight Dragan can apply immediately

Keep responses tight. Dragan doesn't need paragraphs — he needs precision.`

export async function analyzePLO5Hand(handData) {
  const { holeCards, boardCards, position, vsPosition, vsPositions, potSize, stackSize, actionHistory, additionalContext, gameMode } = handData

  const systemPrompt = gameMode === 'plo4' ? PLO4_PROMPT : PLO5_PROMPT

  const villains = vsPositions || (vsPosition ? [vsPosition] : ['Unknown'])
  const villainLine = villains.length > 1
    ? `- Villain positions: ${villains.join(', ')} (${villains.length + 1}-way pot)`
    : `- Villain position: ${villains[0]}`

  const filledBoard = (boardCards || []).filter(Boolean)
  const boardCount = filledBoard.length
  const street = boardCount === 0 ? 'Preflop' : boardCount <= 3 ? 'Flop' : boardCount === 4 ? 'Turn' : 'River'
  const variant = gameMode === 'plo4' ? 'PLO4' : 'PLO5'

  const userMessage = `
${variant} hand for analysis:
- Hero position: ${position}
${villainLine}
- Street: ${street}
- Hero hole cards: ${holeCards.join(' ')}
- Board: ${filledBoard.length > 0 ? filledBoard.join(' ') : 'Preflop'}
- Pot size: ${potSize} BB
- Stack: ${stackSize} BB
- Action: ${actionHistory}
${additionalContext ? `- Context: ${additionalContext}` : ''}

Analyze this spot.`

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'API request failed')
  }

  const data = await response.json()
  return data.content[0].text
}
