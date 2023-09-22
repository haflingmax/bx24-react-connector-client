import { Method } from "./call-method";

export type AppInfoProps = {
};

export type AppInfo = {
  ID: string;
  CODE: string;
  VERSION: number;
  STATUS: string;
  INSTALLED: boolean;
  PAYMENT_EXPIRED: string;
  DAYS: number | null;
  LICENSE: string;
};

export const appInfo = (
  BX24Call: (props: Method) => Promise<void>
) => () => {

  BX24Call({
    name: "app.info",
    params: {
    },
    readAll: true,
  });
};
