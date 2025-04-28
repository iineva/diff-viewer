import { useMemo, useEffect } from "react";
import { useLocalStorage } from "react-use";
import DiffItem from "./components/DiffItem";
import TabItem from "./components/TabItem";
import ButtonItem from "./components/ButtonItem";

function AppEditor() {
  // param from localStorage
  const [jsonMode, setJonMode] = useLocalStorage("_json_mode_", false);
  const [count = 0, setCount] = useLocalStorage("_diff_item_count_", 1);
  const [index, setIndex] = useLocalStorage("_diff_item_index_", 0);
  const [compactMode, setCompactMode] = useLocalStorage(
    "_compact_mode_",
    false
  );

  // 代码只读模式优先从 URL 获取
  const [leftCode, setLeftCode] = useLocalStorage(`_left_code_${index}_`, "");
  const [rightCode, setRightCode] = useLocalStorage(
    `_right_code_${index}_`,
    ""
  );

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
      <div className="top">
        <div style={{ flex: 1 }}>
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
        </div>

        <ButtonItem
          title={compactMode ? "紧凑" : "展开"}
          value={compactMode}
          setValue={setCompactMode}
        />
        <ButtonItem title={"JSON"} value={jsonMode} setValue={setJonMode} />
      </div>

      <DiffItem
        key={index}
        compactMode={compactMode}
        marginTop={true}
        leftCode={leftCode}
        setLeftCode={setLeftCode}
        rightCode={rightCode}
        setRightCode={setRightCode}
        readOnly={false}
        jsonMode={jsonMode}
        originalEditable={true}
      />
    </>
  );
}

export default AppEditor;
