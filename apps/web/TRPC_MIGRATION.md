# tRPC Migration Guide

This document outlines the tRPC integration added to the web application, copied from the AOT implementation.

## What was added

### 1. Dependencies
Added the following tRPC packages to `package.json`:
- `@trpc/client@^11.0.0-rc.446`
- `@trpc/react-query@^11.0.0-rc.446`
- `@trpc/server@^11.0.0-rc.446`

### 2. tRPC Configuration Files

#### `/src/trpc/query-client.ts`
- Configures TanStack Query client with SuperJSON serialization
- Sets up dehydration/hydration for SSR

#### `/src/trpc/react.tsx`
- Client-side tRPC React Query integration
- Provides the `TRPCReactProvider` component
- Includes type inference helpers for inputs/outputs

#### `/src/trpc/server.ts`
- Server-side tRPC usage for React Server Components
- Provides hydration helpers for SSR

### 3. Server API Structure

#### `/src/server/api/trpc.ts`
- Core tRPC setup with context creation
- Defines public and protected procedures
- Integrates with NextAuth for authentication

#### `/src/server/api/root.ts`
- Main router configuration
- Exports the `AppRouter` type for type safety

#### `/src/server/api/routers/user.ts`
- Example user router with basic CRUD operations
- Demonstrates both public and protected procedures

### 4. API Route Handler

#### `/src/app/api/trpc/[trpc]/route.ts`
- Next.js API route handler for tRPC requests
- Handles both GET and POST requests

### 5. Provider Integration

Updated `/src/app/providers.tsx` to replace the existing QueryClient with `TRPCReactProvider`, which includes:
- TanStack Query setup
- React Query Devtools
- tRPC client configuration

## Usage Examples

### Client-side (React Components)

```tsx
'use client';
import { api } from '~/trpc/react';

export function UserProfile() {
  const { data: profile, isLoading } = api.user.getProfile.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{profile?.name}</div>;
}
```

### Server-side (React Server Components)

```tsx
import { api } from '~/trpc/server';

export async function UserProfileServer() {
  const profile = await api.user.getProfile();
  
  return <div>{profile?.name}</div>;
}
```

### Mutations

```tsx
'use client';
import { api } from '~/trpc/react';

export function UpdateProfile() {
  const updateProfile = api.user.updateProfile.useMutation();
  
  const handleSubmit = (data: { name: string }) => {
    updateProfile.mutate(data);
  };
  
  // ... rest of component
}
```

## Test Page

A test page has been created at `/trpc-test` to demonstrate the tRPC integration.

## Migration Path

This implementation provides a foundation for gradually migrating existing API routes to tRPC:

1. **Start with new features**: Use tRPC for new API endpoints
2. **Migrate existing routes**: Convert existing API routes to tRPC procedures
3. **Type safety**: Take advantage of end-to-end type safety
4. **Server-side usage**: Use tRPC for server components where appropriate

## Next Steps

1. Add more routers for different domains (challenges, tracks, etc.)
2. Migrate existing API routes to tRPC procedures
3. Add proper error handling and validation
4. Consider adding middleware for common functionality (rate limiting, etc.)