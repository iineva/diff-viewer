import { useMemo } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

const sortTxt = (t?: string) => (t || "").split("\n").sort().join("\n");

function DiffItem({
  sort,
  showInput,
  showDiffOnly,
  marginTop,
  leftCode,
  setLeftCode,
  rightCode,
  setRightCode,
  extraLinesSurroundingDiff = 1,
}: {
  sort?: boolean;
  showInput?: boolean;
  showDiffOnly?: boolean;
  marginTop?: boolean;
  leftCode?: string;
  setLeftCode: (s: string) => void;
  rightCode?: string;
  setRightCode: (s: string) => void;
  extraLinesSurroundingDiff?: number;
}) {
  const newLeftCode = useMemo(() => {
    if (!sort) return leftCode;
    return sortTxt(leftCode);
  }, [sort, leftCode]);
  const newRightCode = useMemo(() => {
    if (!sort) return rightCode;
    return sortTxt(rightCode);
  }, [sort, rightCode]);
  return (
    <div className={`diff-item ${marginTop ? "margin-top" : ""}`}>
      {showInput ? (
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
        extraLinesSurroundingDiff={extraLinesSurroundingDiff}
        oldValue={newLeftCode}
        newValue={newRightCode}
        splitView={true}
      />
    </div>
  );
}

export default DiffItem;
