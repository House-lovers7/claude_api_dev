import { ToolDefinition } from "../models/tool-definition";

export class ToolManager {
  private tools: Record<string, ToolDefinition> = {};

  registerTool(tool: ToolDefinition): void {
    if (!tool.name.match(/^[a-zA-Z0-9_-]{1,64}$/)) {
      throw new Error(`Invalid tool name: ${tool.name}`);
    }
    this.tools[tool.name] = tool;
  }

  getTool(name: string): ToolDefinition | undefined {
    return this.tools[name];
  }

  getTools(): ToolDefinition[] {
    return Object.values(this.tools);
  }
}