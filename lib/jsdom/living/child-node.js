"use strict";

// TODO: need to pass related web-platform-tests.

module.exports = core => {
  // https://dom.spec.whatwg.org/#interface-childnode
  // NoInterfaceObject

  function ensureNode(doc, node) {
    if (typeof node === "string") {
      return doc.createTextNode(node);
    } else if (!(node instanceof doc.defaultView.Node)) {
      throw new TypeError("Expected a Node or a string");
    }

    return node;
  }

  function ensureNodeArguments(doc, args) {
    let node = null;

    if (args.length === 1) {
      node = ensureNode(doc, args[0]);
    } else {
      node = doc.createDocumentFragment();
      for (let i = 0; args.length > i; i++) {
        node.appendChild(ensureNode(doc, args[i]));
      }
    }

    return node;
  }

  const ChildNodeInterface = {
    // Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-before
    before() {
      const parent = this.parentNode;
      if (arguments.length === 0 || parent === null) {
        return;
      }

      const node = ensureNodeArguments(this._ownerDocument, arguments);
      parent.insertBefore(node, this);
    },

    // Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-after
    after() {
      const parent = this.parentNode;
      if (arguments.length === 0 || parent === null) {
        return;
      }

      const node = ensureNodeArguments(this._ownerDocument, arguments);
      const nextSibling = this.nextSibling;

      if (nextSibling === null) {
        parent.appendChild(node);
      } else {
        parent.insertBefore(node, nextSibling);
      }
    },

    // TODO: replaceWith

    // Removes node.
    // https://dom.spec.whatwg.org/#dom-childnode-remove
    remove() {
      const parent = this.parentNode;
      if (parent === null) {
        return;
      }

      parent.removeChild(this);
    }
  };

  for (const Constructor of [core.DocumentType, core.Element, core.CharacterData]) {
    for (const funcName in ChildNodeInterface) {
      Constructor.prototype[funcName] = ChildNodeInterface[funcName];
    }
  }
};