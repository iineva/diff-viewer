import { useMemo } from "react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
loader.config({ monaco });
loader.init().then(/* ... */);

const tryPrettyJson = (j?: string) => {
  try {
    const obj = JSON.parse(j || "");
    return JSON.stringify(obj, null, 4);
  } catch (e) {
    return j;
  }
};

function DiffItem({
  compactMode,
  marginTop,
  leftCode,
  setLeftCode,
  rightCode,
  setRightCode,
  readOnly,
  jsonMode,
  language = "javascript",
}: {
  compactMode?: boolean; // 紧凑模式
  marginTop?: boolean;
  leftCode?: string;
  setLeftCode: (s: string) => void;
  rightCode?: string;
  setRightCode: (s: string) => void;
  readOnly?: boolean;
  jsonMode?: boolean; // json模式，自动格式化 json 后预览
  language?: string;
}) {
  const newLeftCode = useMemo(() => {
    if (jsonMode) return tryPrettyJson(leftCode);
    return leftCode;
  }, [leftCode, jsonMode]);
  const newRightCode = useMemo(() => {
    if (jsonMode) return tryPrettyJson(rightCode);
    return rightCode;
  }, [rightCode, jsonMode]);

  // 监听代码变化
  const handleEditorMount = (editor: MonacoDiffEditor) => {
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    // 监听原始编辑器内容变化
    originalEditor.onDidChangeModelContent(async () => {
      setLeftCode(originalEditor.getValue());
    });

    // 监听修改编辑器内容变化
    modifiedEditor.onDidChangeModelContent(async () => {
      setRightCode(modifiedEditor.getValue());
    });
  };

  return (
    <div className={`diff-item ${marginTop ? "margin-top" : ""}`}>
      <DiffEditor
        height="100%"
        original={newLeftCode}
        modified={newRightCode}
        originalLanguage={language}
        modifiedLanguage={language}
        theme="light"
        loading="Loading..."
        keepCurrentOriginalModel={true}
        keepCurrentModifiedModel={true}
        options={{
          wordBreak: "normal",
          wordWrap: "on",
          minimap: { enabled: true, autohide: true },
          readOnly: readOnly,
          originalEditable: !readOnly,
          fontSize: 16,
          renderGutterMenu: false,
          scrollBeyondLastLine: false,
          renderSideBySide: !compactMode,
          compactMode: compactMode,
          experimental: {
            useTrueInlineView: compactMode,
          },
          renderControlCharacters: false,
          renderMarginRevertIcon: false,
          showFoldingControls: "never",
          showUnused: false,
          copyWithSyntaxHighlighting: false,

          automaticLayout: true, // 自适应布局
          diffCodeLens: false, // 禁用代码镜头（移除“Revert this change”按钮）
          renderOverviewRuler: false, // 禁用概览标尺
          contextmenu: false, // 禁用右键上下文菜单
          enableSplitViewResizing: false, // 禁用分隔线调整
          renderIndicators: false, // 禁用差异装饰（如箭头图标）
          suggest: {
            // enabled: false // 禁用建议菜单
          },
          suggestOnTriggerCharacters: false, // 禁用触发字符建议
          // acceptSuggestionOnEnter: false // 禁用回车接受建议

          // renderIndicators: true,
          // compactMode: true,
        }}
        onMount={handleEditorMount}
      />
    </div>
  );
}

export default DiffItem;
