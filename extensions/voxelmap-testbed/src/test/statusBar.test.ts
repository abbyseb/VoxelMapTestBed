// Task ID: 2.2 — Status bar TestBed · mode · pack
import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { formatStatusBarText } from '../branding/statusBar';
import { registerStatusBar } from '../branding/registerStatusBar';

describe('2.2 statusBar', () => {
  it('formatStatusBarText shows mode and pack', () => {
    expect(formatStatusBarText('mock', 'spare-demo-v1')).toBe(
      'TestBed · mock · spare-demo-v1',
    );
    expect(formatStatusBarText('demo', 'spare-demo-v1')).toBe(
      'TestBed · demo · spare-demo-v1',
    );
    expect(formatStatusBarText('live')).toBe('TestBed · live · —');
  });

  it('registerStatusBar shows item wired to welcome command', () => {
    const context = { subscriptions: [] as { dispose: () => void }[] } as vscode.ExtensionContext;
    const item = registerStatusBar(context, {
      getDataMode: () => 'mock',
      getPackId: () => 'spare-demo-v1',
    });
    expect(vscode.window.createStatusBarItem).toHaveBeenCalled();
    expect(item.command).toBe('vmtb.welcome.open');
    expect(item.text).toContain('TestBed · mock · spare-demo-v1');
    expect(item.show).toHaveBeenCalled();
  });

  it('status bar refreshes when session changes', () => {
    const context = { subscriptions: [] as { dispose: () => void }[] } as vscode.ExtensionContext;
    let pack = 'pack-a';
    const listeners: (() => void)[] = [];
    const onDidChange = (fn: () => void) => {
      listeners.push(fn);
      return { dispose: () => {} };
    };
    const item = registerStatusBar(context, {
      getDataMode: () => 'demo',
      getPackId: () => pack,
      onDidChange,
    });
    pack = 'pack-b';
    for (const fn of listeners) {
      fn();
    }
    expect(item.text).toContain('pack-b');
  });
});
