import { NextResponse } from 'next/server';
import { getProposals, updateProposalStatus } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const proposals = await getProposals(status);
    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Get proposals error:', error);
    return NextResponse.json(
      { error: 'Failed to get proposals' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status required' },
        { status: 400 }
      );
    }
    
    const updated = await updateProposalStatus(id, status);
    return NextResponse.json({ success: true, proposal: updated });
  } catch (error) {
    console.error('Update proposal error:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}
