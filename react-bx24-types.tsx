export type BX24Params =
  | {
      DOMAIN: string | undefined;
      PROTOCOL: number | undefined;
      APP_SID: string | undefined;
      PATH: string;
      LANG: string;
      AUTH_ID: string;
      REFRESH_ID: null | string;
      MEMBER_ID: null | string;
      PLACEMENT: null | string;
      IS_ADMIN: boolean;
      AUTH_EXPIRES: string;
      USER_OPTIONS: null | string;
      APP_OPTIONS: null | string;
      PLACEMENT_OPTIONS: null | string;
      INSTALL: boolean;
      FIRST_RUN: boolean;
      _authExpires?: number;
    }
  | undefined;

export type IAuth =
  | {
      ACCESS_TOKEN?: string;
      REFRESH_TOKEN?: string | null;
      EXPIRES_IN?: number;
      DOMAIN?: string;
      MEMBER_ID?: string | null;
      BASE_URL: string
    }
  | undefined;

export type BX24Context = {
  state: IAuth;
  actions: {
    auth: Function
  };
  _params: {_params: BX24Params, _messageSender: any } | undefined;
};
