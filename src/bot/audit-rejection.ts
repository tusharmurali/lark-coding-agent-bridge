/**
 * Feishu's tenant message audit rejects an outbound message it believes holds
 * sensitive data with a 400 ("The messages do NOT pass the audit, ext=contain
 * sensitive data: <kind>"). Emails are masked before sending (see
 * card/mask-email.ts); other kinds, such as a list of long numeric ids read as
 * national id numbers, cannot be predicted, so the reply is lost. Returns the
 * audit's stated reason for such an error, so the caller can tell the chat.
 */
const AUDIT_RE = /do NOT pass the audit(?:, ext=(.+))?/;

export function auditRejectionReason(err: unknown): string | undefined {
  const message = err instanceof Error ? err.message : String(err);
  const match = AUDIT_RE.exec(message);
  if (!match) return undefined;
  return match[1]?.trim() || 'no reason given';
}
