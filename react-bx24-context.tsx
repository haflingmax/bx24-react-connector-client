import { createContext } from "react";
import { BX24Context } from "./react-bx24-types";

const bx24Context = createContext<BX24Context>({
  state: {
    ACCESS_TOKEN: "",
    REFRESH_TOKEN: "",
    EXPIRES_IN: 0,
    DOMAIN: "",
    MEMBER_ID: "",
    BASE_URL: "",
  },
  actions: {
    auth: Function
  },
  _params: undefined
});

export default bx24Context;
