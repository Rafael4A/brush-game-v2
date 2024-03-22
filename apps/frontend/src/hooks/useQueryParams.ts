import { useLocation } from "react-router-dom";

export function useQueryParams() {
  const { search } = useLocation();
  return Object.fromEntries(new URLSearchParams(search));
}
