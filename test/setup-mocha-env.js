import Enzyme from 'enzyme';
import React from 'react';
const Adapter = require('@cfaester/enzyme-adapter-react-18').default;
import { JSDOM } from 'jsdom';

/* required when running >= 16.0 */
Enzyme.configure({ adapter: new Adapter() });

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });

  global.window = dom.window;
  global.document = window.document;
  // global.Node = Node; // Node is not always easily available from jsdom import, usually window.Node works

  if (!global.navigator) {
    global.navigator = {
      userAgent: 'node.js',
      appVersion: '',
    };
  } else {
    // If it exists, try to override properties if needed, or just leave it
    // In newer JSDOM/Node, it might be present.
    // We can try to define it if configurable
    try {
      global.DocumentFragment = window.DocumentFragment;
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'node.js',
          appVersion: '',
        },
        writable: true,
        configurable: true,
      });
    } catch (e) {
      console.warn('Could not override global.navigator', e);
    }
  }

  function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
      .filter((prop) => typeof target[prop] === 'undefined')
      .map((prop) => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
  }

  copyProps(dom.window, global);

  // Fix: Node is available on window
  global.Node = window.Node;

  const KEYS = ['HTMLElement'];
  KEYS.forEach((key) => {
    global[key] = window[key];
  });

  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: {
        documentElement: window.document.body,
        parent: {
          nodeName: 'BODY',
        },
      },
    },
  });

  global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
  };

  global.window.cancelAnimationFrame = () => {};
  global.getComputedStyle = global.window.getComputedStyle;
  global.HTMLInputElement = global.window.HTMLInputElement;
  global.Element = global.window.Element;
  global.Event = global.window.Event;
  global.window.getComputedStyle = () => ({});
  // Aggressive URL mock
  const NativeURL = global.window.URL;

  // We accept that we might break strict URL validation for specific edge cases,
  // but we need createObjectURL to work without "instanceof Blob" checks from Node/JSDOM.
  class MockURL extends NativeURL {
    constructor(url, base) {
      super(url, base);
    }
    static createObjectURL(blob) {
      return 'http://mock-url';
    }
    static revokeObjectURL(url) {
      // noop
    }
  }

  global.window.URL = MockURL;
  global.URL = MockURL;

  global.Blob = class Blob {
    constructor(content, options) {
      this.content = content;
      this.options = options;
    }
  };
}

console.log('Setup loaded');
setupDom();
console.error = function () {};
