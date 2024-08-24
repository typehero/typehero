import { handler } from './src/lambda.ts';

const server = Bun.serve({
  port: 8000,
  async fetch(req) {
    const raw = await req.json();
    console.info('raw', raw);
    if(raw.typeName === undefined || raw.content === undefined) {
      return Response.json({ error: 'Missing typeName or content' }, { status: 400 });
    }
    const handlerResult = await handler(raw, {});
    return Response.json(handlerResult);
  }
});

console.info('listening on http://localhost:8000');
