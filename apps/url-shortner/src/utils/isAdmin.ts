export function isAdmin(session: any) {
  if (!session) {
    return false;
  }
  return session.user.role.includes('ADMIN');
}
