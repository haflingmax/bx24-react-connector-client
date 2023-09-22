import { useEffect, useState } from "react";
import bx24Context from "./react-bx24-context";
import { BX24Params, IAuth } from "./react-bx24-types";
import sendMessage from "./utilits/send-message";
import { getAuth } from "./actions/get-auth";

type Method = {
  name: string;
  params: {}
} 

const BX24Provider = (props: {
  children?: string | JSX.Element | JSX.Element[];
}) => {
  const { children } = { ...props };

  const [valueProvider, setValueProvider] = useState<IAuth>();
  const [params, setParams] = useState<{_params: BX24Params, _messageSender: any }>();
  const [ methodToDo, setMethodToDo ] = useState<Method>();

  const _init = () => {
    (async () => {
      const _params = init(); 
      setParams(_params);     
    })();
  }

  const auth = () => {
    if(params === undefined || methodToDo !== undefined) return;
    setMethodToDo({ name: 'auth', params});
  };

  const _auth = async (params: any) => {
    const result = await getAuth(params);
    setMethodToDo(undefined);
    setValueProvider(result);
  }

  const value = {
    state: valueProvider,
    actions: {
      auth: auth,
    },
    _params: params
  };

  useEffect(() => {
    if(!isIframe()) return;
    _init();
  }, []);

  useEffect(() => {
    auth();
  }, [params])

  useEffect(() => {
    if(methodToDo !== undefined) {
      _auth(methodToDo.params);
    }
  }, [methodToDo])

  console.log('request BX24Provider')

  return <bx24Context.Provider value={value}>
    {children}
    </bx24Context.Provider>;
};

export const isIframe = () => {

  let isFramed = false;
  try {
    isFramed = window != window.top || document != top?.document || self.location != top?.location;
  } catch (e) {
    isFramed = true;
  }
  
  return isFramed;

}

const init: () => {
  _params: {
    setAuthExpires: Function;
    getAuthExpires: Function;
    getAuth: Function;
  } & BX24Params;
  _messageSender: any;
} = () => {
  const currentWindow: Window = window;
  const parentWindow: Window = parent;

  const _params: {
    setAuthExpires: Function;
    getAuthExpires: Function;
    getAuth: Function;
  } & BX24Params = getParams();
  const _messageSender = sendMessage(_params, currentWindow, parentWindow);

  return {
    _params: _messageSender['_params'],
    _messageSender,
  };
};

const getParams = () => {
  const data: BX24Params = {
    DOMAIN: "",
    PROTOCOL: 1,
    APP_SID: "",
    PATH: "",
    LANG: "",
    AUTH_ID: "",
    REFRESH_ID: null,
    MEMBER_ID: null,
    PLACEMENT: null,
    IS_ADMIN: false,
    AUTH_EXPIRES: "0",
    USER_OPTIONS: null,
    APP_OPTIONS: null,
    PLACEMENT_OPTIONS: null,
    INSTALL: false,
    FIRST_RUN: true,
    _authExpires: 0,
  };

  const setAuthExpires = (value: string): number => {
    const currentTime: number = Date.now();
    return currentTime + parseInt(value, 10) * 1000;
  };

  const getAuthExpires = (data: any): number | undefined => {
    return data.AUTH_EXPIRES;
  };

  const getAuth = (
    _params: {
      setAuthExpires: Function;
      getAuthExpires: Function;
      getAuth: Function;
    } & BX24Params
  ): IAuth => {
    return {
      ACCESS_TOKEN: _params.AUTH_ID,
      DOMAIN: _params.DOMAIN,
      EXPIRES_IN: setAuthExpires(_params.AUTH_EXPIRES),
      MEMBER_ID: _params.MEMBER_ID,
      REFRESH_TOKEN: _params.REFRESH_ID,
      BASE_URL: "http" + (_params?.PROTOCOL ? "s" : "") + "://" + _params?.DOMAIN,
    };
  };

  return {
    ...data,
    setAuthExpires,
    getAuthExpires,
    getAuth,
  };
};

export default BX24Provider;
