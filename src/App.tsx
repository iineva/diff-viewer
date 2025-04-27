import { useMemo, useEffect } from "react";
import "./App.css";
import { useLocalStorage } from "react-use";
import {
  useSearchParamBase64DecodeToString,
  useSearchParamBool,
} from "./utils/hooks";
import DiffItem from "./components/DiffItem";
import TabItem from "./components/TabItem";
import ButtonItem from "./components/ButtonItem";
import { sortTxt } from "./utils/strings";

function App() {
  // param from url query
  const readonlyParam = useSearchParamBool("readonly") || false;
  const compactModeParam = useSearchParamBool("compactMode");
  const leftCodeParam = useSearchParamBase64DecodeToString("leftCode");
  const rightCodeParam = useSearchParamBase64DecodeToString("rightCode");
  const jsonModeParam = useSearchParamBool("jsonMode");
  const hiddenToolBar = useSearchParamBool("hiddenToolBar");

  // param from localStorage
  const [jsonMode, setJonMode] = useLocalStorage("_json_mode_", jsonModeParam);
  const [count = 0, setCount] = useLocalStorage("_diff_item_count_", 1);
  const [index, setIndex] = useLocalStorage("_diff_item_index_", 0);
  const [compactMode, setCompactMode] = useLocalStorage(
    "_compact_mode_",
    compactModeParam
  );
  const [sort, setSort] = useLocalStorage("_sort_", false);
  const readonly = readonlyParam || sort;

  // 代码只读模式优先从 URL 获取
  let [leftCode, setLeftCode] = useLocalStorage(`_left_code_${index}_`, "");
  let [rightCode, setRightCode] = useLocalStorage(`_right_code_${index}_`, "");
  leftCode = readonly ? leftCodeParam : leftCode;
  rightCode = readonly ? rightCodeParam : rightCode;
  setLeftCode = readonly ? () => {} : setLeftCode;
  setRightCode = readonly ? () => {} : setRightCode;

  // sort by line
  leftCode = useMemo(() => {
    if (!sort) return leftCode;
    return sortTxt(leftCode);
  }, [sort, leftCode]);
  rightCode = useMemo(() => {
    if (!sort) return rightCode;
    return sortTxt(rightCode);
  }, [sort, rightCode]);

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
      {!hiddenToolBar && (
        <div className="top">
          <div style={{ flex: 1 }}>
            {!readonly && (
              <>
                {items}
                <span className="tab" onClick={() => setCount(count + 1)}>
                  +
                </span>
                <span
                  className="tab"
                  onClick={() => setCount(Math.max(1, count - 1))}
                >
                  -{" "}
                </span>
              </>
            )}
          </div>

          <ButtonItem
            title={readonly ? "只读模式" : "编辑模式"}
            value={readonly}
          />
          <ButtonItem
            title={compactMode ? "紧凑" : "展开"}
            value={compactMode}
            setValue={setCompactMode}
          />
          <ButtonItem title={"JSON"} value={jsonMode} setValue={setJonMode} />
          <ButtonItem
            title={sort ? "按行排序" : "对比原文"}
            value={sort}
            setValue={setSort}
          />
        </div>
      )}

      <DiffItem
        key={index}
        compactMode={compactMode}
        marginTop={!hiddenToolBar}
        leftCode={leftCode}
        setLeftCode={setLeftCode}
        rightCode={rightCode}
        setRightCode={setRightCode}
        readOnly={readonly}
        jsonMode={jsonMode}
      />
    </>
  );
}

export default App;
