import { isVNode } from "../../../jsx-runtime/index.js";
import { escapeHTML, HTMLString, isHTMLString, markHTMLString } from "../escape.js";
import { spreadAttributes } from "../index.js";
import { isPromise } from "../util.js";
import { renderJSX } from "../jsx.js";
import { renderChild } from "./any.js";
import { Fragment } from "./common.js";
import { createBufferedRenderer, voidElementNames } from "./util.js";
import { isAstroComponentFactory } from "./astro/factory.js";
import { createAstroComponentInstance } from "./astro/instance.js";
import { isRenderTemplateResult } from "./astro/render-template.js";
import { containsServerDirective, ServerIslandComponent } from "./server-islands.js";
const ClientOnlyPlaceholder = "astro-client-only";
class TemplateFrame {
  /** The RenderTemplateResult this frame walks. */
  templateResult;
  /** Resume position: the next `htmlParts`/`expressions` index to process. */
  cursor;
  constructor(templateResult) {
    this.templateResult = templateResult;
    this.cursor = 0;
  }
  storeCursor(index) {
    this.cursor = index;
  }
}
async function renderStreaming(root, result, destination) {
  const stack = [root];
  const openTagCache = /* @__PURE__ */ new Map();
  const closeTagCache = /* @__PURE__ */ new Map();
  const closeTagFor = (type) => {
    let tag = closeTagCache.get(type);
    if (tag === void 0) {
      tag = new HTMLString(`</${type}>`);
      closeTagCache.set(type, tag);
    }
    return tag;
  };
  let batch = "";
  let buffered = false;
  let firstAsync = null;
  const tail = [];
  let tailStatic = "";
  const emitStatic = (s) => {
    if (!s) return;
    if (buffered) tailStatic += s;
    else batch += s;
  };
  const flushTailStatic = () => {
    if (tailStatic) {
      tail.push(tailStatic);
      tailStatic = "";
    }
  };
  const renderDynamic = (node) => (d) => {
    if (isVNode(node)) {
      return renderJSX(result, node).then((out) => renderChild(d, out));
    }
    return renderChild(d, node);
  };
  const handleVNode = (vnode) => {
    const type = vnode.type;
    if (!type) {
      throw new Error(
        `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
      );
    }
    if (type === Fragment) {
      stack.push(vnode.props?.children);
      return;
    }
    if (isAstroComponentFactory(type)) {
      const props = {};
      const slots = {};
      for (const [key, value] of Object.entries(vnode.props ?? {})) {
        if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
          slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
        } else {
          props[key] = value;
        }
      }
      const displayName = type.name || "Anonymous";
      if (containsServerDirective(props)) {
        const island = new ServerIslandComponent(result, props, slots, displayName);
        result._metadata.propagators.add(island);
        stack.push(island);
        return;
      }
      stack.push(createAstroComponentInstance(result, displayName, type, props, slots));
      return;
    }
    if (typeof type === "string" && type !== ClientOnlyPlaceholder) {
      const props = vnode.props;
      let hasAttrs = false;
      if (props) {
        for (const key in props) {
          if (key !== "children") {
            hasAttrs = true;
            break;
          }
        }
      }
      const children = props?.children;
      const isVoid = (children == null || children === "") && voidElementNames.test(type);
      if (!hasAttrs) {
        const key = isVoid ? `${type}/` : type;
        let openTag = openTagCache.get(key);
        if (openTag === void 0) {
          openTag = isVoid ? `<${type}/>` : `<${type}>`;
          openTagCache.set(key, openTag);
        }
        emitStatic(openTag);
        if (!isVoid) {
          stack.push(closeTagFor(type));
        }
      } else {
        const { children: _children, ...attrsProps } = props ?? {};
        const attrs = spreadAttributes(attrsProps);
        if (isVoid) {
          emitStatic(`<${type}${attrs}/>`);
          return;
        }
        emitStatic(`<${type}${attrs}>`);
        stack.push(markHTMLString(`</${type}>`));
      }
      if (!isVoid && children != null && children !== "") {
        if (typeof children === "string" && (type === "style" || type === "script")) {
          stack.push(markHTMLString(children));
        } else {
          stack.push(children);
        }
      }
      return;
    }
    if (typeof type === "function" && vnode.props?.["server:root"]) {
      stack.push(type(vnode.props ?? {}));
      return;
    }
    stack.push(renderJSX(result, vnode));
  };
  while (stack.length > 0) {
    const node = stack.pop();
    if (node == null || node === false) continue;
    if (node instanceof TemplateFrame) {
      const htmlParts = node.templateResult.htmlParts;
      const expressions = node.templateResult.expressions;
      let i = node.cursor;
      while (i < htmlParts.length) {
        if (htmlParts[i]) {
          emitStatic(htmlParts[i]);
        }
        if (i >= expressions.length) {
          break;
        }
        const expression = expressions[i];
        i++;
        if (expression == null || expression === false) continue;
        const expressionType = typeof expression;
        if (expressionType === "string") {
          emitStatic(escapeHTML(expression));
          continue;
        }
        if (expressionType === "number" || expressionType === "bigint" || expressionType === "boolean") {
          emitStatic(String(expression));
          continue;
        }
        if (expression instanceof HTMLString || isHTMLString(expression)) {
          emitStatic(expression.toString());
          continue;
        }
        node.storeCursor(i);
        stack.push(node);
        stack.push(expression);
        break;
      }
      continue;
    }
    const nodeType = typeof node;
    if (nodeType === "string") {
      emitStatic(escapeHTML(node));
      continue;
    }
    if (nodeType === "number" || nodeType === "bigint" || nodeType === "boolean") {
      emitStatic(String(node));
      continue;
    }
    if (node instanceof HTMLString || isHTMLString(node)) {
      emitStatic(node.toString());
      continue;
    }
    if (Array.isArray(node)) {
      for (let i = node.length - 1; i >= 0; i--) stack.push(node[i]);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      stack.push(new TemplateFrame(node));
      continue;
    }
    if (isVNode(node)) {
      handleVNode(node);
      continue;
    }
    if (!buffered) {
      if (batch) {
        destination.write(markHTMLString(batch));
        batch = "";
      }
      const rendered = renderDynamic(node)(destination);
      if (isPromise(rendered)) {
        buffered = true;
        firstAsync = rendered;
      }
    } else {
      flushTailStatic();
      tail.push(createBufferedRenderer(destination, renderDynamic(node)));
    }
  }
  if (!buffered) {
    if (batch) {
      destination.write(markHTMLString(batch));
    }
    return;
  }
  await firstAsync;
  flushTailStatic();
  for (const seg of tail) {
    if (typeof seg === "string") {
      destination.write(markHTMLString(seg));
    } else {
      const r = seg.flush();
      if (isPromise(r)) await r;
    }
  }
}
export {
  renderStreaming
};
