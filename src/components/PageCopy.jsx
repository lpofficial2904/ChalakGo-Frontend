import { pageCopyKey } from "../../../shared/pageCopyKey.js";
import { createContext, useContext } from 'react';
export const PageCopyContext = createContext({});
export function PageText({ id, children }) {
  const copy = useContext(PageCopyContext);
  return copy[id || pageCopyKey(children)] ?? children;
}
