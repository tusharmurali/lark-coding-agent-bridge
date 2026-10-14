import type { NormalizedMessage } from '@larksuite/channel';
import { realpath } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AgentEvent } from '../../../src/agent/types.js';
import { createDefaultProfileConfig } from '../../../src/config/profile-schema.js';
import { SessionStore } from '../../../src/session/store.js';
import { WorkspaceStore } from '../../../src/workspace/store.js';
import { FakeAgentAdapter } from '../../helpers/fake-agent.js';
import { createTmpProfile } from '../../helpers/tmp-profile.js';

const sdkMock = vi.hoisted(() => ({
  channel: undefined as FakeLarkChannel | undefined,
  createLarkChannel: vi.fn(() => {
    if (!sdkMock.channel) throw new Error('fake channel not configured');
    return sdkMock.channel;
  }),
}));

vi.mock('@larksuite/channel', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@larksuite/channel')>();
  return {
    ...actual,
    createLarkChannel: sdkMock.createLarkChannel,
  };
});

import { startChannel } from '../../../src/bot/channel.js';

interface MessageHandlerMap {
  message?: (msg: NormalizedMessage) => Promise<void> | void;
}

interface Outbound {
  chatId: string;
  options: unknown;
}

interface FakeLarkChannel {
  handlers: MessageHandlerMap;
  sent: Outbound[];
  streams: Outbound[];
  botIdentity: { openId: string; name: string };
  rawClient: {
    request: ReturnType<typeof vi.fn>;
    application: { v6: { application: { get: ReturnType<typeof vi.fn> } } };
    im: {
      v1: {
        message: { get: ReturnType<typeof vi.fn>; mergeForward: ReturnType<typeof vi.fn> };
        messageReaction: { create: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
      };
    };
  };
  on(handlers: MessageHandlerMap): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getChatMode(chatId: string): Promise<'group' | 'topic'>;
  getConnectionStatus(): { state: 'connected'; reconnectAttempts: number };
  send(chatId: string, content: unknown, options?: unknown): Promise<{ messageId: string }>;
  stream(chatId: string, input: unknown, options?: unknown): Promise<{ messageId: string }>;
}

const SOURCE = 'oc_source';
const TARGET = 'oc_target';
const ANSWER: AgentEvent[] = [
  { type: 'text', delta: 'the answer' },
  { type: 'done', terminationReason: 'normal' },
];

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  sdkMock.channel = undefined;
  sdkMock.createLarkChannel.mockClear();
  await Promise.all(cleanups.splice(0).map((cleanup) => cleanup()));
});

describe('per-chat reply target', () => {
  it('forwards a redirected group message to the target chat and replies under the copy', async () => {
    const h = await startTestBridge();

    await h.channel.handlers.message?.(message({ messageId: 'om_question', content: 'why?' }));
    await waitFor(() => h.channel.streams.length === 1);

    expect(h.channel.rawClient.im.v1.message.mergeForward).toHaveBeenCalledWith({
      params: { receive_id_type: 'chat_id' },
      data: { receive_id: TARGET, message_id_list: ['om_question'] },
    });
    expect(h.channel.streams[0]).toEqual({ chatId: TARGET, options: { replyTo: 'om_forwarded' } });
    expect(outboundTo(h.channel, SOURCE)).toEqual([]);
  });

  it('threads the reply under the forwarded copy when the target is a topic group', async () => {
    const h = await startTestBridge();
    h.channel.rawClient.im.v1.message.mergeForward.mockResolvedValueOnce({
      code: 0,
      data: { message: { message_id: 'om_forwarded', thread_id: 'omt_feed_topic' } },
    });

    await h.channel.handlers.message?.(message({ messageId: 'om_question', content: 'why?' }));
    await waitFor(() => h.channel.streams.length === 1);

    expect(h.channel.streams[0]).toEqual({
      chatId: TARGET,
      options: { replyTo: 'om_forwarded', replyInThread: true },
    });
  });

  it('ignores a reply in a redirected group unless it mentions the bot', async () => {
    const h = await startTestBridge();

    await h.channel.handlers.message?.(
      message({ messageId: 'om_reply', rootId: 'om_question', content: 'thanks' }),
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(h.channel.rawClient.im.v1.message.mergeForward).not.toHaveBeenCalled();
    expect(h.agent.runOptions).toEqual([]);

    await h.channel.handlers.message?.(
      message({
        messageId: 'om_reply_at',
        rootId: 'om_question',
        content: '@Bridge and this?',
        mentionedBot: true,
      }),
    );
    await waitFor(() => h.channel.streams.length === 1);
    expect(h.channel.rawClient.im.v1.message.mergeForward).toHaveBeenCalledWith({
      params: { receive_id_type: 'chat_id' },
      data: { receive_id: TARGET, message_id_list: ['om_reply_at'] },
    });
  });

  it('leaves the reply threaded in place for a group without a target', async () => {
    const h = await startTestBridge();

    await h.channel.handlers.message?.(
      message({
        messageId: 'om_plain',
        chatId: 'oc_plain',
        threadId: 'omt_plain',
        content: 'hi',
        mentionedBot: true,
      }),
    );
    await waitFor(() => h.channel.streams.length === 1);

    expect(h.channel.rawClient.im.v1.message.mergeForward).not.toHaveBeenCalled();
    expect(h.channel.streams[0]).toEqual({
      chatId: 'oc_plain',
      options: { replyTo: 'om_plain', replyInThread: true },
    });
  });

  it('hands a slash command from a redirected group to the agent instead of answering it there', async () => {
    const h = await startTestBridge();

    await h.channel.handlers.message?.(message({ messageId: 'om_slash', content: '/status' }));
    await waitFor(() => h.agent.runOptions.length === 1);
    await waitFor(() => h.channel.streams.length === 1);

    expect(h.agent.runOptions[0]?.prompt).toContain('/status');
    expect(outboundTo(h.channel, SOURCE)).toEqual([]);
  });

  it('skips the run when the forward fails rather than answering in the source group', async () => {
    const h = await startTestBridge();
    h.channel.rawClient.im.v1.message.mergeForward.mockResolvedValueOnce({
      code: 230001,
      msg: 'forward not allowed',
    });

    await h.channel.handlers.message?.(message({ messageId: 'om_blocked', content: 'why?' }));
    await waitFor(() => h.channel.rawClient.im.v1.message.mergeForward.mock.calls.length === 1);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(h.agent.runOptions).toEqual([]);
    expect(h.channel.sent).toEqual([]);
    expect(h.channel.streams).toEqual([]);
  });
});

function outboundTo(channel: FakeLarkChannel, chatId: string): Outbound[] {
  return [...channel.sent, ...channel.streams].filter((out) => out.chatId === chatId);
}

async function startTestBridge(): Promise<{ channel: FakeLarkChannel; agent: FakeAgentAdapter }> {
  const tmp = await createTmpProfile('chat-reply-target-');
  const workspace = await realpath(tmp.workspace);
  const baseProfileConfig = createDefaultProfileConfig({
    agentKind: 'claude',
    accounts: { app: { id: 'cli_test', secret: 'secret', tenant: 'feishu' } },
    access: {
      allowedChats: [SOURCE, 'oc_plain'],
      chatRequireMention: { [SOURCE]: false },
      chatReplyTarget: { [SOURCE]: TARGET },
    },
  });
  const profileConfig = {
    ...baseProfileConfig,
    workspaces: { ...baseProfileConfig.workspaces, default: workspace },
  };
  const sessions = new SessionStore(join(tmp.profile, 'sessions.json'));
  const workspaces = new WorkspaceStore(join(tmp.profile, 'workspaces.json'));
  const agent = new FakeAgentAdapter({ events: ANSWER });
  const channel = createFakeLarkChannel();
  sdkMock.channel = channel;
  const bridge = await startChannel({
    cfg: profileConfig,
    agent,
    sessions,
    workspaces,
    controls: {
      profile: 'test',
      profileConfig,
      ownerRefreshState: 'unknown' as const,
      async refreshOwner() {},
      async restart() {},
      async exit() {},
      configPath: '/tmp/config.json',
      cfg: profileConfig,
      processId: 'proc_test',
    },
  });
  cleanups.push(async () => {
    await bridge.disconnect();
    await Promise.all([sessions.flush(), workspaces.flush()]);
    await tmp.cleanup();
  });
  return { channel, agent };
}

function createFakeLarkChannel(): FakeLarkChannel {
  const handlers: MessageHandlerMap = {};
  const sent: Outbound[] = [];
  const streams: Outbound[] = [];
  return {
    handlers,
    sent,
    streams,
    botIdentity: { openId: 'ou_bot', name: 'Bridge' },
    rawClient: {
      request: vi.fn(async () => ({ data: { items: [] } })),
      application: {
        v6: {
          application: {
            get: vi.fn(async () => ({ data: { app: { owner: { owner_id: 'ou_owner' } } } })),
          },
        },
      },
      im: {
        v1: {
          message: {
            get: vi.fn(async () => ({ data: { items: [] } })),
            mergeForward: vi.fn(async () => ({
              code: 0,
              data: { message: { message_id: 'om_forwarded' } },
            })),
          },
          messageReaction: {
            create: vi.fn(async () => ({ data: { reaction_id: 'reaction_1' } })),
            delete: vi.fn(async () => ({})),
          },
        },
      },
    },
    on(nextHandlers) {
      Object.assign(handlers, nextHandlers);
    },
    async connect() {},
    async disconnect() {},
    async getChatMode() {
      return 'group';
    },
    getConnectionStatus() {
      return { state: 'connected', reconnectAttempts: 0 };
    },
    async send(chatId, _content, options) {
      sent.push({ chatId, options });
      return { messageId: `om_sent_${sent.length}` };
    },
    async stream(chatId, input, options) {
      streams.push({ chatId, options });
      if (isMarkdownStreamInput(input)) {
        await input.markdown({ setContent: async () => {} });
      }
      return { messageId: `om_stream_${streams.length}` };
    },
  };
}

function message(input: {
  messageId: string;
  content: string;
  chatId?: string;
  threadId?: string;
  rootId?: string;
  mentionedBot?: boolean;
}): NormalizedMessage {
  return {
    messageId: input.messageId,
    chatId: input.chatId ?? SOURCE,
    chatType: 'group',
    senderId: 'ou_member',
    senderName: 'Member',
    content: input.content,
    rawContentType: 'text',
    resources: [],
    mentions: input.mentionedBot
      ? [{ key: '@_user_1', openId: 'ou_bot', name: 'Bridge', isBot: true }]
      : [],
    mentionAll: false,
    mentionedBot: input.mentionedBot === true,
    createTime: 1760000001000,
    ...(input.threadId ? { threadId: input.threadId } : {}),
    ...(input.rootId ? { rootId: input.rootId } : {}),
  } as unknown as NormalizedMessage;
}

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error('timed out waiting for async work');
}

interface MarkdownStreamInput {
  markdown(ctrl: { setContent(markdown: string): Promise<void> }): Promise<void> | void;
}

function isMarkdownStreamInput(input: unknown): input is MarkdownStreamInput {
  return Boolean(input && typeof input === 'object' && 'markdown' in input);
}
