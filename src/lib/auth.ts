export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ODDS_ADMIN_PASSWORD;
  if (!expected) return false;
  return input === expected;
}
