const RenderInstructionSymbol = /* @__PURE__ */ Symbol.for("astro:render");
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function isScriptInstruction(chunk) {
  return chunk && typeof chunk === "object" && "type" in chunk && chunk.type === "script";
}
export {
  createRenderInstruction,
  isRenderInstruction,
  isScriptInstruction
};
