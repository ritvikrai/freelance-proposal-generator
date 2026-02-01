import { NextResponse } from 'next/server';
import { generateProposal, analyzeJobPosting } from '@/lib/services/openai';
import { saveProposal, getProfile } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { jobDetails } = await request.json();

    if (!jobDetails || jobDetails.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide detailed job information' },
        { status: 400 }
      );
    }

    const profile = await getProfile();

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return demo data
      const demoProposal = {
        subject: `Experienced Developer Ready to Help - ${jobDetails.slice(0, 30)}...`,
        greeting: `Hi there,`,
        hook: `I noticed you're looking for help with this project, and I'm genuinely excited about the opportunity.`,
        experience: `With over 5 years of experience in similar projects, I've helped numerous clients achieve their goals.`,
        approach: `I would start by understanding your specific needs, then create a detailed plan before execution.`,
        deliverables: [
          'Complete implementation',
          'Documentation',
          'Testing and QA',
          '2 weeks of support',
        ],
        timeline: '2-3 weeks for completion',
        pricing: 'I can work within your budget - let\'s discuss specifics.',
        closing: 'I\'d love to discuss this project further. When would be a good time for a quick call?',
        fullProposal: `Hi there,\n\nI noticed you're looking for help with this project, and I'm genuinely excited about the opportunity.\n\nWith over 5 years of experience in similar projects, I've helped numerous clients achieve their goals. I would start by understanding your specific needs, then create a detailed plan before execution.\n\nWhat you'll get:\n- Complete implementation\n- Documentation\n- Testing and QA\n- 2 weeks of support\n\nTimeline: 2-3 weeks\n\nI'd love to discuss this project further. When would be a good time for a quick call?\n\nBest regards`,
        note: 'Demo mode - Add OPENAI_API_KEY for personalized AI-generated proposals',
      };

      const saved = await saveProposal(jobDetails, demoProposal, null);
      return NextResponse.json({ success: true, data: saved });
    }

    // Run analysis and generation in parallel
    const [proposal, analysis] = await Promise.all([
      generateProposal(jobDetails, profile),
      analyzeJobPosting(jobDetails),
    ]);

    if (!proposal) {
      return NextResponse.json(
        { error: 'Failed to generate proposal' },
        { status: 500 }
      );
    }

    const saved = await saveProposal(jobDetails, proposal, analysis);

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.error('Generate proposal error:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal', details: error.message },
      { status: 500 }
    );
  }
}
