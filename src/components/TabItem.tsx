import { useEffect, useCallback } from "react";
import { useLocalStorage } from "react-use";
import { Typography } from "antd";

const { Paragraph } = Typography;

function TabItem({
  index,
  actived,
  onClick,
}: {
  index: number;
  actived: boolean;
  onClick: () => void;
}) {
  const [title = "", setTitle] = useLocalStorage(`_tab_item_${index}_`, "");
  const setOkTitle = useCallback(
    (t?: string) => {
      setTitle((t || "").trim() || `Tab ${index + 1}`);
    },
    [setTitle, index]
  );
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
      className={`tab ${actived ? "actived" : ""}`}
      onClick={onClick}
    >
      {title}
    </Paragraph>
  );
}

export default TabItem;
