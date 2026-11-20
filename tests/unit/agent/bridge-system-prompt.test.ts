import { describe, expect, it } from 'vitest';
import {
  BRIDGE_SYSTEM_PROMPT,
  buildBridgeSystemPrompt,
  prefixBridgeSystemPrompt,
} from '../../../src/agent/bridge-system-prompt';

describe('bridge system prompt bot collaboration rules', () => {
  it('states that bots only receive messages via a real structured mention', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('only receives a group message when it is really @-mentioned');
    expect(BRIDGE_SYSTEM_PROMPT).toContain('never receive');
  });

  it('scopes the mention requirement to bots, not human users', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('human users');
  });

  it('tells the agent not to mention other bots by default to avoid loops', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('do not @ other bots by default');
    expect(BRIDGE_SYSTEM_PROMPT).toContain('endless loop');
  });

  it('allows mentioning a bot when the user explicitly asks for a handoff', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('explicitly asks');
  });

  it('points self-identification at the bridge_context botOpenId field', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('botOpenId');
  });

  it('documents the senderType and mentions context fields', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('senderType');
    expect(BRIDGE_SYSTEM_PROMPT).toContain('mentions');
  });

  it('tells the agent not to mimic the batch sender annotation format', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('[name (user|bot)]');
    expect(BRIDGE_SYSTEM_PROMPT).toContain('do not imitate');
  });

  it('tells the agent to request every app scope when logging in', () => {
    expect(BRIDGE_SYSTEM_PROMPT).toContain('A login replaces the user\'s granted scopes');
    expect(BRIDGE_SYSTEM_PROMPT).toContain('lark-cli auth scopes');
    expect(BRIDGE_SYSTEM_PROMPT).toContain('Never use `--recommend`');
  });
});

describe('buildBridgeSystemPrompt', () => {
  it('returns the base prompt unchanged when no identity is available', () => {
    expect(buildBridgeSystemPrompt(undefined)).toBe(BRIDGE_SYSTEM_PROMPT);
  });

  it('appends a concrete identity line with open_id and name', () => {
    const prompt = buildBridgeSystemPrompt({ openId: 'ou_bot_self', name: '助手' });
    expect(prompt.startsWith(BRIDGE_SYSTEM_PROMPT)).toBe(true);
    expect(prompt).toContain('ou_bot_self');
    expect(prompt).toContain('助手');
  });

  it('appends the identity line even when the bot name is missing', () => {
    const prompt = buildBridgeSystemPrompt({ openId: 'ou_bot_self' });
    expect(prompt).toContain('ou_bot_self');
  });
});

describe('prefixBridgeSystemPrompt', () => {
  it('prefixes the identity-aware system prompt before the user message', () => {
    const prompt = prefixBridgeSystemPrompt('hello world', { openId: 'ou_bot_self' });
    expect(prompt).toContain('ou_bot_self');
    expect(prompt.indexOf('ou_bot_self')).toBeLessThan(prompt.indexOf('## user_message'));
    expect(prompt.endsWith('hello world')).toBe(true);
  });

  it('keeps working without an identity', () => {
    const prompt = prefixBridgeSystemPrompt('hello world', undefined);
    expect(prompt.startsWith(BRIDGE_SYSTEM_PROMPT)).toBe(true);
    expect(prompt.endsWith('hello world')).toBe(true);
  });
});
