import { expect } from 'chai';
import sinon from 'sinon';

describe('background.js', function() {
  let chrome;

  beforeEach(async function() {
    // 模拟 Chrome API
    global.chrome = {
      runtime: {
        onInstalled: {
          addListener: sinon.stub()
        },
        onMessage: {
          addListener: sinon.stub()
        },
        sendMessage: sinon.stub()
      },
      contextMenus: {
        create: sinon.stub(),
        onClicked: {
          addListener: sinon.stub()
        }
      },
      tabs: {
        sendMessage: sinon.stub()
      }
    };

    // 动态加载 background.js
    await import('./background.js');
  });

  afterEach(function() {
    // 清除模拟的 Chrome API
    sinon.restore();
  });

  it('should create context menu on installation', function() {
    expect(chrome.runtime.onInstalled.addListener.calledOnce).to.be.true;
    const callback = chrome.runtime.onInstalled.addListener.getCall(0).args[0];
    callback();
    expect(chrome.contextMenus.create.calledOnce).to.be.true;
    expect(chrome.contextMenus.create.getCall(0).args[0]).to.deep.equal({
      id: 'lookupWord',
      title: 'Look up word',
      contexts: ['selection']
    });
  });

  it('should send message to content script on context menu click', function() {
    const info = { menuItemId: 'lookupWord', selectionText: 'test' };
    const tab = { id: 1 };
    const callback = chrome.contextMenus.onClicked.addListener.getCall(0).args[0];
    callback(info, tab);
    expect(chrome.tabs.sendMessage.calledOnce).to.be.true;
    expect(chrome.tabs.sendMessage.getCall(0).args[0]).to.equal(1);
    expect(chrome.tabs.sendMessage.getCall(0).args[1]).to.deep.equal({
      type: 'LOOKUP_WORD',
      text: 'test'
    });
  });
});