import { callAnthropicAPI, AnthropicAPIOptions } from "./anthropic";
import { ToolManager } from "../services/tool-manager";
import { ToolExecutor } from "../services/tool-executor";

async function handleClaudeRequest(userInput: string, apiOptions: AnthropicAPIOptions = {}): Promise<string> {
  const toolManager = new ToolManager();
  const toolExecutor = new ToolExecutor(toolManager);

  toolManager.registerTool({
    name: "calculator",
    description: "A simple calculator that evaluates mathematical expressions.",
    inputSchema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "The mathematical expression to evaluate.",
        },
      },
      required: ["expression"],
    },
  });

  const tools = toolManager.getTools();
  const claudeResponse = await callAnthropicAPI(userInput, tools, apiOptions);

  if (claudeResponse.stopReason === "tool_use") {
    const toolResult = await toolExecutor.handleToolUseResponse(claudeResponse);
    if (toolResult.isError) {
      return `Error: ${toolResult.content}`;
    }

    const claudeResponseWithToolResult = await callAnthropicAPI(
      JSON.stringify(toolResult),
      tools,
      apiOptions
    );

    return JSON.stringify(claudeResponseWithToolResult.content);
  }

  return JSON.stringify(claudeResponse.content);
}

// 実行例
(async () => {
  const userInput = "What is 1 plus 2?";
  const result = await handleClaudeRequest(userInput);
  console.log(result);
})();