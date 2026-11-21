import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Cron Job: Update Ported Challenges
 * 
 * This API route is designed to be called by Vercel's cron job scheduler
 * to automatically run the update-ported-challenges script on a schedule.
 * 
 * Path: /api/cron/update-ported-challenges
 * Method: GET
 * Authentication: Bearer token via CRON_SECRET environment variable
 * 
 * Related to GitHub Issue: #1701
 */

// Force dynamic rendering to ensure this runs as a server-side function
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify this request is coming from Vercel cron
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.error('CRON_SECRET environment variable is not set');
    return NextResponse.json(
      { error: 'Cron configuration error' }, 
      { status: 500 }
    );
  }
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron request attempt');
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  const startTime = Date.now();
  
  try {
    console.log('Starting update-ported-challenges cron job...');
    
    // Import and execute the update script
    // Note: The script is a top-level execution, so we import it to trigger execution
    await import('../../../../../../../packages/db/temp/update-ported-challenges');
    
    const executionTime = Date.now() - startTime;
    
    console.log(`update-ported-challenges completed successfully in ${executionTime}ms`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Update ported challenges completed successfully',
      timestamp: new Date().toISOString(),
      executionTimeMs: executionTime
    });
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('update-ported-challenges cron job failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      executionTimeMs: executionTime
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Cron job execution failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      executionTimeMs: executionTime
    }, { status: 500 });
  }
}