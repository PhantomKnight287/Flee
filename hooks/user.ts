import { useContext } from "react";
import { UserContext } from "../context/user";

export function useUser() {
  const user = useContext(UserContext);
  if (user === null)
    throw new Error("Application Not wrapped in `UserProvider`");
  return user.user;
}

export function useUserDispatch() {
  const data = useContext(UserContext);
  if (data === null) throw new Error("Wrap Your Application in `UserProvider`");
  return data.setUser;
}
