import { useState } from "react";
import {
  useSearchParamBase64DecodeToString,
  useSearchParamBool,
} from "./utils/hooks";
import DiffItem from "./components/DiffItem";
import ButtonItem from "./components/ButtonItem";

function AppTempMode() {
  // param from url query
  const readonly = useSearchParamBool("readonly") || false;
  const hiddenToolBar = useSearchParamBool("hiddenToolBar");
  const [lineWrapping, setLineWrapping] = useState(
    useSearchParamBool("lineWrapping")
  );
  const [jsonMode, setJonMode] = useState(useSearchParamBool("jsonMode"));
  const [compactMode, setCompactMode] = useState(
    useSearchParamBool("compactMode")
  );
  const [leftCode, setLeftCode] = useState(
    useSearchParamBase64DecodeToString("leftCode")
  );
  const [rightCode, setRightCode] = useState(
    useSearchParamBase64DecodeToString("rightCode")
  );

  return (
    <>
      {!hiddenToolBar && (
        <div className="top">
          <div style={{ flex: 1 }}></div>

          <ButtonItem
            title={readonly ? "只读模式" : "编辑模式"}
            value={readonly}
          />
          <ButtonItem
            title={lineWrapping ? "自动换行" : "关闭换行"}
            value={lineWrapping}
            setValue={setLineWrapping}
          />
          <ButtonItem
            title={compactMode ? "紧凑" : "展开"}
            value={compactMode}
            setValue={setCompactMode}
          />
          <ButtonItem title={"JSON"} value={jsonMode} setValue={setJonMode} />
        </div>
      )}

      <DiffItem
        compactMode={compactMode}
        marginTop={!hiddenToolBar}
        leftCode={leftCode}
        setLeftCode={setLeftCode}
        rightCode={rightCode}
        setRightCode={setRightCode}
        readOnly={readonly}
        jsonMode={jsonMode}
        lineWrapping={lineWrapping}
        originalEditable={false}
      />
    </>
  );
}

export default AppTempMode;
