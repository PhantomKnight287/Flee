import { readCookie } from "@helpers/cookies";
import axios from "axios";
import { useEffect } from "react";
import { useUserDispatch } from "./user";

export function useRefetchProfile() {
  const dispatch = useUserDispatch();
  useEffect(() => {
    const cookie = readCookie("token");
    if (!cookie) return;
    const controller = new AbortController();
    axios
      .get("/api/auth/profile", {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((d) => d.data)
      .then((data) => {
        dispatch({
          type: "SetUser",
          payload: data,
        });
      })
      .catch((err) => {});
    return () => controller.abort();
  }, []);
}
