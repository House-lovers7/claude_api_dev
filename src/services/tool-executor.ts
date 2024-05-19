import { ToolUseRequest, ToolResultRequest } from "../models/tool-request";
import { ToolUseResponse, ToolUseContent } from "../models/tool-response";
import { ToolManager } from "./tool-manager";

export class ToolExecutor {
  private toolManager: ToolManager;

  constructor(toolManager: ToolManager) {
    this.toolManager = toolManager;
  }

  async executeToolUse(req: ToolUseRequest): Promise<any> {
    const tool = this.toolManager.getTool(req.toolName);
    if (!tool) {
      throw new Error(`Unknown tool: ${req.toolName}`);
    }

    // ツール入力の検証
    // TODO: req.toolInputをtool.inputSchemaに従って検証する

    // TODO: ツールの実行（ツール名に基づいて適切な関数を呼び出す）
    return { result: "dummy" };
  }

  async handleToolUseResponse(res: ToolUseResponse): Promise<ToolResultRequest> {
    const toolUse = res.content.find((c) => c.type === "tool_use") as ToolUseContent;
    if (!toolUse) {
      throw new Error("No tool_use content found");
    }

    try {
      const result = await this.executeToolUse({
        toolName: toolUse.name,
        toolInput: toolUse.input,
      });

      return {
        toolUseId: toolUse.id,
        content: result,
      };
    } catch (error) {
      return {
        toolUseId: toolUse.id,
        content: String(error),
        isError: true,
      };
    }
  }
}