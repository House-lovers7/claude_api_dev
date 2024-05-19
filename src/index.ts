import { callAnthropicAPI, AnthropicAPIOptions } from "./api/anthropic";
import { ToolManager } from "./services/tool-manager";
import { ToolExecutor } from "./services/tool-executor";

import * as dotenv from "dotenv";
dotenv.config();

async function handleClaudeRequest(userInput: string, apiOptions: AnthropicAPIOptions = {}): Promise<string> {
  const toolManager = new ToolManager();
  const toolExecutor = new ToolExecutor(toolManager);

  // ここでツールの登録を行う
  // 例: toolManager.registerTool(...)

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

async function main() {
  console.log("Hello, Claude API!");

  const userInput = "What is the weather like in San Francisco?";
  const result = await handleClaudeRequest(userInput);
  console.log(result);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});