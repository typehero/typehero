export async function GET() {
  return new Response('Auth required', {
    status: 401,
    headers: { 'WWW-authenticate': 'Basic realm="Secure Area"' },
  });
}
