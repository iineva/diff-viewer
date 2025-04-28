import { useEffect, useMemo, useState } from "react";
import { DiffEditor, MonacoDiffEditor } from "@monaco-editor/react";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { useSearchParamString } from "../utils/hooks";
import { postMessage } from "../utils/postMessage";
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
  lineWrapping,
  originalEditable,
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
  lineWrapping?: boolean; // 自动换行
  originalEditable?: boolean;
}) {
  const parentOrign = useSearchParamString("parent") || "";
  const newLeftCode = useMemo(() => {
    if (jsonMode) return tryPrettyJson(leftCode);
    return leftCode;
  }, [leftCode, jsonMode]);
  const newRightCode = useMemo(() => {
    if (jsonMode) return tryPrettyJson(rightCode);
    return rightCode;
  }, [rightCode, jsonMode]);
  const [editor, setEditor] = useState<MonacoDiffEditor | undefined>(undefined);

  useEffect(() => {
    if (!editor) return;

    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    postMessage({ event: "onMount", parent: parentOrign }, parentOrign); // iframe 上级通知成功挂在

    const postHeightChange = (height: number) => {
      const h = height + (marginTop ? 36 : 0);
      if (Math.abs(heightLast - h) > 5) {
        heightLast = h;
        postMessage(
          {
            event: "onHeightChange",
            value: h,
            from: "left",
            parent: parentOrign,
          },
          parentOrign
        );
      }
    };

    // 监听内容高度变化
    const node = originalEditor.getDomNode()?.querySelector(".view-lines");
    let heightLast = -1;
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target !== node) continue;
        const { height } = entry.contentRect; // 获取当前高度
        postHeightChange(height);
      }
    });
    node && resizeObserver.observe(node);

    // 监听原始编辑器内容变化
    const cancelOrgChange = originalEditor.onDidChangeModelContent(async () => {
      const t = originalEditor.getValue();
      setLeftCode && setLeftCode(t);
      postMessage(
        { event: "onTextChange", value: t, from: "left", parent: parentOrign },
        parentOrign
      );
      postHeightChange(originalEditor.getContentHeight());
    });
    originalEditor.onDidChangeModelLanguageConfiguration;

    // 监听修改编辑器内容变化
    const cancelModChange = modifiedEditor.onDidChangeModelContent(async () => {
      const t = modifiedEditor.getValue();
      setRightCode && setRightCode(t);
      postMessage(
        { event: "onTextChange", value: t, from: "right", parent: parentOrign },
        parentOrign
      );
      postHeightChange(modifiedEditor.getContentHeight());
    });

    return () => {
      resizeObserver && resizeObserver.disconnect();
      cancelOrgChange && cancelOrgChange.dispose();
      cancelModChange && cancelModChange.dispose();
    };
  }, [editor, parentOrign, marginTop, setLeftCode, setRightCode]);

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
          wordWrap: lineWrapping ? "on" : "off",
          minimap: { enabled: true, autohide: true },
          readOnly: readOnly,
          originalEditable: originalEditable,
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
        onMount={(e) => setEditor(e)}
      />
    </div>
  );
}

export default DiffItem;
