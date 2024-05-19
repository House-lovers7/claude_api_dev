import { ToolDefinition } from "../models/tool-definition";
import { ToolUseResponse } from "../models/tool-response";

export interface AnthropicAPIOptions {
  model?: string;
  maxTokens?: number;
  toolChoiceType?: string;
  toolChoiceName?: string;
}

export async function callAnthropicAPI(
  userInput: string,
  tools: ToolDefinition[],
  options: AnthropicAPIOptions = {}
): Promise<ToolUseResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const url = "https://api.anthropic.com/v1/messages";
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
    "anthropic-version": "2023-06-01",
    "anthropic-beta": "tools-2024-05-16",
  };
  const body = {
    model: options.model || "claude-3-opus-20240229",
    max_tokens: options.maxTokens || 2048,
    tool_choice: options.toolChoiceType
      ? {
          type: options.toolChoiceType,
          name: options.toolChoiceName || "",
        }
      : undefined,
    tools: tools,
    messages: [{ role: "user", content: userInput }],
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ToolUseResponse;
}