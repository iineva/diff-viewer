import { useMemo } from "react";
import { useSearchParam } from "react-use";

export function useSearchParamInt(
  key: string,
  def?: number
): number | undefined {
  const str = useSearchParam(key);
  return useMemo(() => {
    try {
      const v = parseInt(str || "");
      return isNaN(v) ? def : v;
    } catch (e) {
      return def;
    }
  }, [str]);
}

export function useSearchParamBool(
  key: string,
  def?: boolean
): boolean | undefined {
  const str = useSearchParam(key) || "";
  return useMemo(() => {
    try {
      if (str.toLocaleLowerCase() == "true") {
        return true;
      }
      const v = parseInt(str);
      return isNaN(v) ? def : !!v;
    } catch (e) {
      return def;
    }
  }, [str, def]);
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
  return useMemo(() => {
    return str === null ? def : str;
  }, [str, def]);
}

export function useSearchParamBase64DecodeToString(
  key: string,
  def?: string
): string | undefined {
  const str = useSearchParam(key);
  return useMemo(() => {
    if (str === null) {
      return def;
    }
    try {
      return base64Decode(str || "");
    } catch (e) {
      return def;
    }
  }, [str, def]);
}
