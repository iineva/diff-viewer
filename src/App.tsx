import { useMemo, useEffect, useCallback } from "react";
import "./App.css";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { useLocalStorage } from "react-use";
import { Typography } from "antd";

const { Paragraph } = Typography;

const sortTxt = (t?: string) => (t || "").split("\n").sort().join("\n");

function DiffItem({
  index,
  sort,
  showInput,
  showDiffOnly,
}: {
  index?: number;
  sort?: boolean;
  showInput?: boolean;
  showDiffOnly?: boolean;
}) {
  const [leftCode, setLeftCode] = useLocalStorage(`_left_code_${index}_`, "");
  const [rightCode, setRightCode] = useLocalStorage(
    `_right_code_${index}_`,
    ""
  );
  const newLeftCode = useMemo(() => {
    if (!sort) return leftCode;
    return sortTxt(leftCode);
  }, [sort, leftCode]);
  const newRightCode = useMemo(() => {
    if (!sort) return rightCode;
    return sortTxt(rightCode);
  }, [sort, rightCode]);
  return (
    <div className="diff-item">
      {showInput || !leftCode || !rightCode ? (
        <div style={{ display: "flex" }}>
          <textarea
            className="input"
            value={leftCode}
            placeholder="Please input text."
            onChange={(e) => setLeftCode(e.target.value)}
          />
          <textarea
            className="input"
            value={rightCode}
            placeholder="Please input text."
            onChange={(e) => setRightCode(e.target.value)}
          />
        </div>
      ) : undefined}
      <ReactDiffViewer
        styles={{
          line: { wordBreak: "break-word" },
          wordDiff: { padding: 0 },
        }}
        compareMethod={DiffMethod.WORDS}
        showDiffOnly={showDiffOnly}
        disableWordDiff={false}
        extraLinesSurroundingDiff={1}
        oldValue={newLeftCode}
        newValue={newRightCode}
        splitView={true}
      />
    </div>
  );
}

function TabItem({
  index,
  actived,
  onClick,
}: {
  index: number;
  actived: boolean;
  onClick: () => void;
}) {
  const [item_title, setTitle] = useLocalStorage(`_tab_item_${index}_`, "");
  const title = item_title || ''
  const setOkTitle = useCallback((t?: string) => {
    setTitle((t || "").trim() || `Tab ${index + 1}`);
  }, [setTitle, index])
  useEffect(() => {
    if (title?.length) {
      return;
    }
    setOkTitle(title);
  }, [title, setOkTitle]);
  return (
    <Paragraph
      editable={{
        onChange: setOkTitle,
      }}
      // value={title}
      className={`tab ${actived ? "actived" : ""}`}
      onClick={onClick}
    >
      {title}
    </Paragraph>
  );
}

function App() {
  const [item_count, setCount] = useLocalStorage("_diff_item_count_", 1);
  const count = item_count || 0
  const [index, setIndex] = useLocalStorage("_diff_item_index_", 0);
  const [showInput, setShowInput] = useLocalStorage("_show_input_", true);
  const [showDiffOnly, setShowDiffOnly] = useLocalStorage(
    "_show_diff_only_",
    true
  );
  const [sort, setSort] = useLocalStorage("_sort_", false);
  const items = useMemo(() => new Array(count).fill(0), [count]);
  useEffect(() => {
    if ((index || 0) >= count) setIndex(count - 1);
  }, [index, setIndex, count]);
  return (
    <>
      <div className="top">
        <div style={{ flex: 1 }}>
          {items.map((_, i) => (
            <TabItem
              key={i}
              index={i}
              actived={i === index}
              onClick={() => setIndex(i)}
            />
          ))}

          <span className="tab" onClick={() => setCount(count + 1)}>
            +
          </span>
          <span
            className="tab"
            onClick={() => setCount(Math.max(1, count - 1))}
          >
            -
          </span>
        </div>
        <span
          className={`button tab`}
          onClick={() => setShowDiffOnly(!showDiffOnly)}
        >
          {showDiffOnly ? "简洁" : "详细"}
        </span>
        <span className={`button tab`} onClick={() => setShowInput(!showInput)}>
          {showInput ? "显示输入" : "隐藏输入"}
        </span>
        <span
          className={`button tab ${sort ? "actived" : ""}`}
          onClick={() => setSort(!sort)}
        >
          {sort ? "已自动排序" : "已关闭排序"}
        </span>
      </div>
      <DiffItem
        index={index}
        sort={sort}
        showInput={showInput}
        showDiffOnly={showDiffOnly}
      />
    </>
  );
}

export default App;
