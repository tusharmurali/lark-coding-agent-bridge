import { describe, expect, it } from 'vitest';
import { auditRejectionReason } from '../../../src/bot/audit-rejection';

describe('auditRejectionReason', () => {
  it('returns the reason the audit gives', () => {
    const err = new Error(
      'The messages do NOT pass the audit, ext=contain sensitive data: EMAIL_ADDRESS',
    );
    expect(auditRejectionReason(err)).toBe('contain sensitive data: EMAIL_ADDRESS');
  });

  it('still recognises a rejection without a reason', () => {
    expect(auditRejectionReason('The messages do NOT pass the audit')).toBe('no reason given');
  });

  it('ignores other send failures', () => {
    expect(auditRejectionReason(new Error('The message was withdrawn.'))).toBeUndefined();
  });
});
