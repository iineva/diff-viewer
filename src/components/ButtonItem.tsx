export default function ButtonItem({
  value,
  setValue,
  title,
}: {
  value?: boolean;
  setValue?: (v: boolean) => void;
  title: string;
}) {
  return (
    <span
      className={`button tab ${value ? "actived" : ""}`}
      onClick={() => setValue && setValue(!value)}
    >
      {title}
    </span>
  );
}
