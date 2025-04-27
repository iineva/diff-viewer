import { useEffect, useState } from "react";
import { useSearchParam } from "react-use";

export function useSearchParamInt(
  key: string,
  def?: number
): number | undefined {
  const str = useSearchParam(key);
  const [value, setValue] = useState<number | undefined>(def);
  useEffect(() => {
    try {
      const v = parseInt(str || "");
      setValue(isNaN(v) ? def : v);
    } catch (e) {}
  }, [str]);
  return value;
}

export function useSearchParamBool(
  key: string,
  def?: boolean
): boolean | undefined {
  const str = useSearchParam(key) || "";
  const [value, setValue] = useState<boolean | undefined>(def);
  useEffect(() => {
    try {
      if (str.toLocaleLowerCase() == "true") {
        setValue(true);
        return;
      }
      const v = parseInt(str);
      setValue(isNaN(v) ? def : !!v);
    } catch (e) {}
  }, [str, def]);
  return value;
}

// base64 decode
const base64Decode = (str: string) =>
  decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

export function useSearchParamString(
  key: string,
  def?: string
): string | undefined {
  const str = useSearchParam(key);
  const [value, setValue] = useState<string | undefined>(def);
  useEffect(() => {
    setValue(str === null ? def : str);
  }, [str, def]);
  return value;
}

export function useSearchParamBase64DecodeToString(
  key: string,
  def?: string
): string | undefined {
  const str = useSearchParam(key);
  const [value, setValue] = useState<string | undefined>(def);
  useEffect(() => {
    if (str === null) {
      setValue(def);
      return;
    }
    try {
      setValue(base64Decode(str || ""));
    } catch (e) {}
  }, [str, def]);
  return value;
}
