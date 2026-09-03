# Update Ported Challenges Cron Job

This document describes the implementation of a Vercel cron job to automatically run the `update-ported-challenges.ts` script on a schedule.

## Overview

**Issue**: [#1701](https://github.com/typehero/typehero/issues/1701)  
**Purpose**: Automate the execution of the update-ported-challenges script  
**Schedule**: Daily at 2:00 AM UTC  
**Path**: `/api/cron/update-ported-challenges`

## Implementation

### Files Added/Modified

1. **New API Route**: `apps/web/src/app/api/cron/update-ported-challenges/route.ts`
   - Secure endpoint with Bearer token authentication
   - Imports and executes the update script
   - Comprehensive error handling and logging

2. **Updated Configuration**: `apps/web/vercel.json`
   - Added new cron job configuration
   - Schedule: `"0 2 * * *"` (daily at 2 AM UTC)

### Security

The cron job is secured using the `CRON_SECRET` environment variable:

1. **Generate Secret**:
   ```bash
   openssl rand -hex 32
   ```

2. **Set Environment Variable**:
   Add `CRON_SECRET` to your Vercel project environment variables with the generated value.

3. **Authentication**:
   Vercel automatically includes the secret as a Bearer token in the `Authorization` header when invoking the cron job.

### Script Execution

The cron job imports the existing script at:
```
packages/db/temp/update-ported-challenges.ts
```

The script runs automatically when imported due to its top-level execution structure.

## Testing

### Local Testing
```bash
# Set CRON_SECRET in .env.local
echo "CRON_SECRET=your_generated_secret_here" >> .env.local

# Test the endpoint
curl -H "Authorization: Bearer your_generated_secret_here" \
  http://localhost:3000/api/cron/update-ported-challenges
```

### Production Testing
1. Navigate to Vercel Dashboard → Project Settings → Cron Jobs
2. Find the "update-ported-challenges" cron job
3. Click "Run" to manually trigger execution
4. Check logs for execution results

## Monitoring

### Logs
- **Function Logs**: Available in Vercel Dashboard → Functions tab
- **Cron Job Logs**: Available in Vercel Dashboard → Settings → Cron Jobs → View Logs
- **Console Output**: All execution details are logged to console

### Expected Responses
- **Success**: HTTP 200 with execution time and timestamp
- **Unauthorized**: HTTP 401 if CRON_SECRET is missing or incorrect
- **Error**: HTTP 500 with error details and execution time

## Schedule

**Current**: `"0 2 * * *"` (Daily at 2:00 AM UTC)

### Alternative Schedules
- Every 6 hours: `"0 */6 * * *"`
- Weekly (Sunday): `"0 2 * * 0"`
- Weekdays only: `"0 2 * * 1-5"`

## Environment Variables Required

- `CRON_SECRET`: Secure random string (minimum 16 characters recommended)

## Related Files

- **Script**: `packages/db/temp/update-ported-challenges.ts`
- **Example Cron Jobs**: `apps/web/src/app/api/cron/short-url-cleanup/route.ts`
- **Configuration**: `apps/web/vercel.json`

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Verify `CRON_SECRET` is set in Vercel environment variables
   - Ensure the secret matches what's being sent

2. **Import Errors**
   - Check that the relative path to the script is correct
   - Verify all dependencies are available in the web app context

3. **Execution Timeout**
   - Monitor execution time in logs
   - Consider breaking up long-running operations

### Debugging

1. **Check Logs**: Use Vercel Dashboard → Functions → View Logs
2. **Manual Testing**: Use the "Run" button in Cron Jobs settings
3. **Local Testing**: Test the endpoint locally with proper authentication

## Deployment

This cron job will be automatically deployed with the next production deployment. Vercel will:

1. Parse the `vercel.json` configuration
2. Set up the scheduled execution
3. Provide the cron job interface in the dashboard

No additional deployment steps are required beyond merging this PR and deploying to production.