import type { UiLanguage } from '../config/schema';

/**
 * Chat-chrome string table (status/session messages, card labels, buttons).
 * `zh` mirrors the pre-i18n hardcoded strings verbatim; `en` is the natural
 * English translation. Runtime language defaults to 'zh' so existing
 * behavior is unchanged until a profile opts into `preferences.uiLanguage`.
 */
const zh = {
  'common.notSet': '(未设置)',
  'common.currentMarker': '  ← 当前',
  'common.button.delete': '删除',
  'common.button.newSession': '🆕 新会话',
  'common.button.resume': '🔁 恢复会话',
  'common.button.help': '💡 帮助',
  'common.adminOnly': '❌ 此命令仅管理员可用。',
  'common.commandProcessed': '命令已处理。',

  'ws.title': '📂 工作目录',
  'ws.currentCwd': '当前 cwd：{cwd}',
  'ws.empty': '暂无命名工作目录。',
  'ws.emptyHint': '💡 发送 `/ws save <name>` 把当前 cwd 存为命名工作目录',
  'ws.button.switch': '切换到此处',
  'ws.usage': '用法：`/ws [list|save <name>|use <name>|remove <name>]`',
  'ws.save.usage': '用法：`/ws save <name>`',
  'ws.save.noCwd': '当前 chat 未设置 cwd，先用 `/cd` 设置再保存。',
  'ws.save.success': '✓ 工作目录别名已保存：`{name}` → {cwd}',
  'ws.use.usage': '用法：`/ws use <name>`',
  'ws.aliasNotFound': '未找到工作目录别名：`{name}`',
  'ws.use.success': '✓ 已切换到 `{name}` ({cwd})\n（session 已重置）',
  'ws.remove.usage': '用法：`/ws remove <name>`',
  'ws.remove.success': '✓ 已删除工作目录别名：`{name}`',

  'resume.title': '🔁 恢复历史会话',
  'resume.empty': '此 cwd 下没有历史会话。',
  'resume.lineCountDetail': '{n} 条',
  'resume.button.current': '已是当前会话',
  'resume.button.resumeThis': '▸ 恢复此会话',
  'resume.needCwd': '请先使用 /cd <path> 选择工作目录，再查看或恢复会话。',
  'resume.groupNotSupported': '群聊中不展示历史会话详情。请私聊 bot 使用 `/resume` 查看和选择历史会话。',
  'resume.codexAvailable': '当前 Codex thread 可恢复。\n使用 `/resume use {nonce}` 恢复（10 分钟内有效）。',
  'resume.codexInvalid': '当前上下文不可恢复这个会话，请先用 `/resume` 重新生成恢复候选。',
  'resume.claudeInvalid': '当前上下文不可恢复这个会话，请重新选择当前工作区和权限策略下的会话。',
  'resume.codexNone': '当前上下文没有可恢复的 Codex thread，请先在当前工作区完成一次运行。',
  'resume.applied': '已完成，请继续发送下一条消息。',

  'new.interruptedAndStarted': '已中断当前任务并开始新会话。',
  'new.started': '已开始新会话。',

  'newchat.createFailed': '❌ 创建群失败：{msg}\n\n确认 bot 已开启 `im:chat` 权限。',
  'newchat.welcomeWithCwd': '🎉 群已建好，cwd 继承自原群：`{cwd}`\n\n@我 + 任意消息开始对话。',
  'newchat.welcomeNoCwd': '🎉 群已建好。\n\n@我 + 任意消息开始对话。',
  'newchat.created': '✓ 已创建群 **{name}**，去新群里继续。',

  'cd.usage': '用法：`/cd <绝对路径>` 或 `/cd ~/xxx`',
  'cd.notAbsolute': '请使用绝对路径，或 `~/xxx` 表示 home 下的子路径。',
  'cd.success': '✓ 已切换 cwd 到 `{cwd}`\n（session 已重置）',

  'doc.hint': '云文档评论现在不需要绑定工作区；在支持的文档评论里 @bot 即可触发回复。',

  'stop.adminOnly': '❌ 指定 scope 停止任务仅管理员可用。',
  'stop.requested': '已请求停止 `{scope}`。',
  'stop.notFound': '未找到正在运行的任务：`{scope}`。',

  'timeout.adminOnly': '❌ 指定 scope 设置 timeout 仅管理员可用。',
  'timeout.minutes': '{n} 分钟',
  'timeout.notEnabled': '未启用',
  'timeout.usage':
    '\n\n用法:\n- `/timeout 15` 当前 session 设 15 分钟\n- `/timeout off` 当前 session 关闭探活\n- `/timeout default` 清除 session 覆盖,回退全局\n- `/timeout comment:<scopeHash> 15` 管理员设置 comment scope\n\n_注:`/new` 会清掉当前 session 的覆盖,回到全局_',
  'timeout.disabledCurrent': '已关闭（当前 session）',
  'timeout.currentEffective': '⏱ 当前 session{scopeLabel} 探活:{effective}\n全局默认:{global}{usage}',
  'timeout.followsGlobal': '⏱ 当前 session{scopeLabel} 探活:跟随全局({global}){usage}',
  'timeout.cleared': '✅ 已清除 session 覆盖,回退到全局({global})。',
  'timeout.notOverridden': '当前 session 本来就没设过覆盖,跟随全局({global})。',
  'timeout.off': '✅ 已关闭当前 session 的探活。',
  'timeout.invalidUsage': '❌ 用法:`/timeout <1-120>` / `/timeout off` / `/timeout default`',
  'timeout.set': '✅ 当前 session 探活已设为 {n} 分钟。',

  'ps.none': '当前没有 bot 在运行(理论上不可能,你正在跟其中之一对话…)',
  'ps.tableHeader': '| # | ID | Bot | 启动 |',
  'ps.currentReplying': ' ← 当前正在回复',
  'ps.header': '🧭 **当前有 {n} 个 bot 在运行**',
  'ps.footer': '用 `/exit <id|#>` 关掉某一个;`/exit {id}` 关掉正在回复你的这个 bot。',

  'time.ago.seconds': '{n}s 前',
  'time.ago.minutes': '{n}m 前',
  'time.ago.hours': '{n}h 前',
  'time.ago.days': '{n}d 前',

  'exit.usage': '用法:`/exit <id|#>` —— `id` 是 `/ps` 显示的短 id,`#` 是序号。\n当前正在回复你的是 `{id}`。',
  'exit.notFound': '❌ 没找到匹配的 bot:`{target}`。发 `/ps` 看可选目标。',
  'exit.self': '👋 即将关闭当前 bot `{id}`,再见。',
  'exit.otherFailed': '❌ 关掉 bot `{id}` 失败:{err}',
  'exit.stillAlive': '📨 已请求关闭 `{id}`,但还在收尾。再发 `/ps` 复查一下。',
  'exit.otherSuccess': '✓ 已关闭 bot `{id}`。',

  'status.title': '📊 当前状态',
  'status.staleCwdWarning': ' ⚠️ 旧 cwd，下一条会新建',
  'status.topicScopeSuffix': '_（话题独立 session）_',
  'status.sessionEmptyCodex': '(未建立)',
  'status.sessionEmptyDefault': '(无)',

  'help.title': '💡 使用帮助',
  'help.button.status': '📊 状态',
  'help.body': [
    '**命令列表**',
    '',
    '- `/new` `/reset` — 清空当前 chat 的会话',
    '- `/new chat [name]` — 新建群+新会话，自动拉你进群',
    '- `/resume [N]` — 列出并恢复历史会话（最多 N 条）',
    '- `/cd <path>` — 切换工作目录（会重置 session）',
    '- `/ws list|save <name>|use <name>|remove <name>` — 工作目录',
    '- `/account` — 查看当前应用；`/account change` 换 appId/secret 并重连',
    '- `/config` — 调整偏好、访问控制和 lark-cli 身份策略',
    '- `/status` — 当前状态',
    '- `/stop` — 结束当前正在跑的任务（也可点卡片底部 ⏹ 终止 按钮）',
    '- `/stop comment:<scopeHash>` — 管理员停止云文档评论任务',
    '- `/timeout [N|off|default]` — 当前 session 的探活分钟数,`/config` 改全局默认',
    '- `/timeout comment:<scopeHash> N` — 管理员设置云文档评论任务探活',
    '- `/ps` — 列出本机所有 bot,标识当前正在回复的那个',
    '- `/exit <id|#>` — 关掉指定 bot(用 `/ps` 看 id/序号)',
    '- `/reconnect` — 强制重连 WebSocket(网络抖动后 bot 没反应时用)',
    '- `/doctor [描述]` — 把日志和描述交给 {agent} 自助诊断',
    '- `/help` — 本帮助',
    '',
    '其他内容直接交给 {agent}。',
  ].join('\n'),
} as const;

type Key = keyof typeof zh;

const en: Record<Key, string> = {
  'common.notSet': '(not set)',
  'common.currentMarker': '  ← current',
  'common.button.delete': 'Delete',
  'common.button.newSession': '🆕 New session',
  'common.button.resume': '🔁 Resume session',
  'common.button.help': '💡 Help',
  'common.adminOnly': '❌ This command is admin-only.',
  'common.commandProcessed': 'Command processed.',

  'ws.title': '📂 Workspaces',
  'ws.currentCwd': 'Current cwd: {cwd}',
  'ws.empty': 'No named workspaces yet.',
  'ws.emptyHint': '💡 Send `/ws save <name>` to save the current cwd as a named workspace',
  'ws.button.switch': 'Switch here',
  'ws.usage': 'Usage: `/ws [list|save <name>|use <name>|remove <name>]`',
  'ws.save.usage': 'Usage: `/ws save <name>`',
  'ws.save.noCwd': 'No cwd set for this chat yet — use `/cd` to set one before saving.',
  'ws.save.success': '✓ Workspace alias saved: `{name}` → {cwd}',
  'ws.use.usage': 'Usage: `/ws use <name>`',
  'ws.aliasNotFound': 'No such workspace alias: `{name}`',
  'ws.use.success': '✓ Switched to `{name}` ({cwd})\n(session reset)',
  'ws.remove.usage': 'Usage: `/ws remove <name>`',
  'ws.remove.success': '✓ Workspace alias removed: `{name}`',

  'resume.title': '🔁 Resume history',
  'resume.empty': 'No history sessions under this cwd.',
  'resume.lineCountDetail': '{n} lines',
  'resume.button.current': 'Current session',
  'resume.button.resumeThis': '▸ Resume this session',
  'resume.needCwd': 'Use /cd <path> to pick a working directory first, then view or resume sessions.',
  'resume.groupNotSupported':
    "Session history isn't shown in group chats. DM the bot and use `/resume` to view and pick a session.",
  'resume.codexAvailable':
    'A Codex thread is available to resume.\nUse `/resume use {nonce}` to resume it (valid for 10 minutes).',
  'resume.codexInvalid':
    "This session can't be resumed in the current context — run `/resume` again to regenerate a resume candidate.",
  'resume.claudeInvalid':
    "This session can't be resumed in the current context — pick a session under the current workspace and permission policy.",
  'resume.codexNone':
    'No resumable Codex thread in the current context — finish a run in this workspace first.',
  'resume.applied': 'Done — send your next message to continue.',

  'new.interruptedAndStarted': 'Interrupted the current task and started a new session.',
  'new.started': 'Started a new session.',

  'newchat.createFailed': '❌ Failed to create group: {msg}\n\nMake sure the bot has the `im:chat` permission enabled.',
  'newchat.welcomeWithCwd':
    '🎉 Group created — cwd inherited from the original group: `{cwd}`\n\n@ me with any message to start.',
  'newchat.welcomeNoCwd': '🎉 Group created.\n\n@ me with any message to start.',
  'newchat.created': '✓ Group **{name}** created — continue there.',

  'cd.usage': 'Usage: `/cd <absolute path>` or `/cd ~/xxx`',
  'cd.notAbsolute': 'Use an absolute path, or `~/xxx` for a path under home.',
  'cd.success': '✓ Switched cwd to `{cwd}`\n(session reset)',

  'doc.hint':
    "Cloud doc comments no longer need a bound workspace — @ the bot in a supported doc comment to trigger a reply.",

  'stop.adminOnly': '❌ Stopping a task by scope is admin-only.',
  'stop.requested': 'Requested stop for `{scope}`.',
  'stop.notFound': 'No running task found: `{scope}`.',

  'timeout.adminOnly': '❌ Setting timeout by scope is admin-only.',
  'timeout.minutes': '{n} min',
  'timeout.notEnabled': 'not enabled',
  'timeout.usage':
    '\n\nUsage:\n- `/timeout 15` set 15 minutes for the current session\n- `/timeout off` disable idle-check for the current session\n- `/timeout default` clear the session override, fall back to global\n- `/timeout comment:<scopeHash> 15` admin: set a comment scope\n\n_Note: `/new` clears the current session\'s override, reverting to global_',
  'timeout.disabledCurrent': 'off (current session)',
  'timeout.currentEffective': '⏱ Current session{scopeLabel} idle-check: {effective}\nGlobal default: {global}{usage}',
  'timeout.followsGlobal': '⏱ Current session{scopeLabel} idle-check: follows global ({global}){usage}',
  'timeout.cleared': '✅ Cleared the session override, reverted to global ({global}).',
  'timeout.notOverridden': 'This session had no override set — it already follows global ({global}).',
  'timeout.off': '✅ Disabled idle-check for the current session.',
  'timeout.invalidUsage': '❌ Usage: `/timeout <1-120>` / `/timeout off` / `/timeout default`',
  'timeout.set': '✅ Idle-check for the current session set to {n} minutes.',

  'ps.none': "No bots currently running (shouldn't be possible — you're talking to one of them right now…)",
  'ps.tableHeader': '| # | ID | Bot | Started |',
  'ps.currentReplying': ' ← currently replying',
  'ps.header': '🧭 **{n} bot(s) currently running**',
  'ps.footer': 'Use `/exit <id|#>` to shut one down; `/exit {id}` shuts down the one replying to you.',

  'time.ago.seconds': '{n}s ago',
  'time.ago.minutes': '{n}m ago',
  'time.ago.hours': '{n}h ago',
  'time.ago.days': '{n}d ago',

  'exit.usage':
    'Usage: `/exit <id|#>` — `id` is the short id shown by `/ps`, `#` is the index.\nThe one replying to you right now is `{id}`.',
  'exit.notFound': '❌ No matching bot found: `{target}`. Send `/ps` to see the available targets.',
  'exit.self': '👋 Shutting down this bot `{id}`, bye.',
  'exit.otherFailed': '❌ Failed to shut down bot `{id}`: {err}',
  'exit.stillAlive': '📨 Requested shutdown for `{id}`, but it is still wrapping up. Send `/ps` again to check.',
  'exit.otherSuccess': '✓ Bot `{id}` shut down.',

  'status.title': '📊 Current Status',
  'status.staleCwdWarning': ' ⚠️ stale cwd, a new one will be created on the next message',
  'status.topicScopeSuffix': '_(per-topic session)_',
  'status.sessionEmptyCodex': '(not started)',
  'status.sessionEmptyDefault': '(none)',

  'help.title': '💡 Help',
  'help.button.status': '📊 Status',
  'help.body': [
    '**Commands**',
    '',
    "- `/new` `/reset` — clear the current chat's session",
    '- `/new chat [name]` — create a new group + new session, auto-invites you',
    '- `/resume [N]` — list and resume history sessions (up to N)',
    '- `/cd <path>` — switch working directory (resets the session)',
    '- `/ws list|save <name>|use <name>|remove <name>` — workspaces',
    '- `/account` — view the current app; `/account change` to swap appId/secret and reconnect',
    '- `/config` — adjust preferences, access control, and lark-cli identity policy',
    '- `/status` — current status',
    '- `/stop` — stop the currently running task (or tap ⏹ Stop on the card)',
    '- `/stop comment:<scopeHash>` — admin: stop a cloud-doc comment task',
    '- `/timeout [N|off|default]` — idle-check minutes for the current session; `/config` changes the global default',
    '- `/timeout comment:<scopeHash> N` — admin: set idle-check for a cloud-doc comment task',
    '- `/ps` — list all bots on this machine, marking the one replying to you',
    '- `/exit <id|#>` — shut down a given bot (see id/index via `/ps`)',
    '- `/reconnect` — force-reconnect the WebSocket (use after a network blip)',
    '- `/doctor [description]` — hand logs and description to {agent} for self-diagnosis',
    '- `/help` — this help',
    '',
    'Anything else goes straight to {agent}.',
  ].join('\n'),
};

const tables: Record<UiLanguage, Record<Key, string>> = { zh, en };

let currentLocale: UiLanguage = 'zh';

/** Set the active chat-chrome language. Called by the runtime once it has
 * resolved the profile's `preferences.uiLanguage`. */
export function setLocale(locale: UiLanguage): void {
  currentLocale = locale;
}

export function getLocale(): UiLanguage {
  return currentLocale;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function t(key: Key, vars?: Record<string, string | number>): string {
  return interpolate(tables[currentLocale][key], vars);
}
