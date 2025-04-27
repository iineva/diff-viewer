import { useMemo, useEffect } from "react";
import "./App.css";
import { useLocalStorage } from "react-use";
import {
  useSearchParamBase64DecodeToString,
  useSearchParamBool,
  useSearchParamInt,
} from "./utils/hooks";
import DiffItem from "./components/DiffItem";
import TabItem from "./components/TabItem";

function App() {
  const readonly = useSearchParamBool("readonly");
  const [count = 0, setCount] = useLocalStorage("_diff_item_count_", 1);
  const [index, setIndex] = useLocalStorage("_diff_item_index_", 0);
  const [showInput, setShowInput] = useLocalStorage("_show_input_", true);
  const [showDiffOnlyStorage, setShowDiffOnly] = useLocalStorage(
    "_show_diff_only_",
    true
  );
  const showDiffOnly = useSearchParamBool("showDiffOnly", showDiffOnlyStorage);
  const [leftCodeStorage, setLeftCode] = useLocalStorage(
    readonly ? `_left_code_${new Date().getTime()}` : `_left_code_${index}_`,
    ""
  );
  const [rightCodeStorage, setRightCode] = useLocalStorage(
    readonly ? `_left_code_${new Date().getTime()}` : `_right_code_${index}_`,
    ""
  );
  const leftCode = useSearchParamBase64DecodeToString(
    "leftCode",
    leftCodeStorage
  );
  const rightCode = useSearchParamBase64DecodeToString(
    "rightCode",
    rightCodeStorage
  );
  const extraLinesSurroundingDiff = useSearchParamInt(
    "extraLinesSurroundingDiff",
    1
  );
  const [sort, setSort] = useLocalStorage("_sort_", false);
  const items = useMemo(
    () =>
      new Array(count)
        .fill(0)
        .map((_, i) => (
          <TabItem
            key={i}
            index={i}
            actived={i === index}
            onClick={() => setIndex(i)}
          />
        )),
    [count, setIndex, index]
  );

  useEffect(() => {
    if ((index || 0) >= count) setIndex(count - 1);
  }, [index, setIndex, count]);

  return (
    <>
      {!readonly && (
        <div className="top">
          <div style={{ flex: 1 }}>
            {items}
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
          <span
            className={`button tab`}
            onClick={() => setShowInput(!showInput)}
          >
            {showInput ? "显示输入" : "隐藏输入"}
          </span>
          <span
            className={`button tab ${sort ? "actived" : ""}`}
            onClick={() => setSort(!sort)}
          >
            {sort ? "已自动排序" : "已关闭排序"}
          </span>
        </div>
      )}
      <DiffItem
        // index={index}
        sort={readonly ? false : sort}
        showInput={readonly ? false : showInput}
        showDiffOnly={showDiffOnly}
        marginTop={!readonly}
        leftCode={leftCode}
        setLeftCode={setLeftCode}
        rightCode={rightCode}
        setRightCode={setRightCode}
        extraLinesSurroundingDiff={extraLinesSurroundingDiff}
      />
    </>
  );
}

export default App;
