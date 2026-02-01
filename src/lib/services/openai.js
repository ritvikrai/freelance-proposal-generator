import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProposal(jobDetails, profile) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert freelance proposal writer. Write compelling, personalized proposals that win clients.

Key principles:
- Start with a hook that shows understanding of their problem
- Demonstrate relevant experience without being generic
- Include specific deliverables and timeline
- Add a personal touch that shows genuine interest
- End with a clear call to action

Return JSON:
{
  "subject": "Email subject line",
  "greeting": "Personalized greeting",
  "hook": "Opening that addresses their specific need",
  "experience": "Relevant experience paragraph",
  "approach": "How you'll tackle this project",
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "timeline": "Estimated timeline",
  "pricing": "Suggested pricing strategy",
  "closing": "Call to action",
  "fullProposal": "Complete proposal text ready to send"
}`,
      },
      {
        role: 'user',
        content: `Generate a winning proposal for:

Job Details:
${jobDetails}

My Profile:
Name: ${profile.name || 'Freelancer'}
Skills: ${profile.skills || 'Full-stack development, UI/UX'}
Experience: ${profile.experience || '5+ years'}
Portfolio: ${profile.portfolio || 'Available upon request'}
Rate: ${profile.rate || 'Negotiable'}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.8,
  });

  const content = response.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse proposal:', e);
  }
  
  return { fullProposal: content };
}

export async function improveProposal(proposal, feedback) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a proposal improvement expert. Refine proposals based on feedback.',
      },
      {
        role: 'user',
        content: `Original proposal:\n${proposal}\n\nFeedback/Improvements needed:\n${feedback}`,
      },
    ],
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
}

export async function analyzeJobPosting(jobPosting) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Analyze job postings and extract key information. Return JSON:
{
  "clientType": "startup/agency/enterprise",
  "budget": "estimated budget",
  "urgency": "high/medium/low",
  "keyRequirements": ["req1", "req2"],
  "redFlags": ["potential concerns"],
  "winningStrategy": "how to stand out"
}`,
      },
      {
        role: 'user',
        content: jobPosting,
      },
    ],
    max_tokens: 600,
  });

  try {
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse analysis:', e);
  }
  
  return null;
}
