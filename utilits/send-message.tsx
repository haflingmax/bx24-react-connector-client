import { BX24Params } from "../react-bx24-types";
import parseWindowName from "./parse-window-name";
import uniqueKey from "./unique-key";

type FunctionReturnString = () => string;

const sendMessage = (
  params: { setAuthExpires: Function,
    getAuthExpires: Function,
    getAuth: Function } & BX24Params,
  currentWindow: Window,
  parentWindow: Window
) => {
  const _params: { setAuthExpires: Function,
    getAuthExpires: Function,
    getAuth: Function } & BX24Params = params;
  const _currentWindow = currentWindow;
  const _parentWindow = parentWindow;
  const _resolvers: any = {};
  const _uniqueKey: FunctionReturnString = uniqueKey;

  const _iniData = parseWindowName(currentWindow.name);
  _params.DOMAIN = _iniData.DOMAIN,
  _params.PROTOCOL = _iniData.PROTOCOL,
  _params.APP_SID = _iniData.APP_SID

  const send = (cmd: string, params?: object): Promise<any> => {
    let resolverKey;
    const promise = new Promise<any>((resolve) => {
      resolverKey = _addResolver(resolve);
    });

    cmd += [!!params ? ":" + JSON.stringify(params) : "", resolverKey].join(":");
    if (!!_params?.APP_SID) {
      cmd = [cmd, _params.APP_SID].join(":");
    }
    const url = "http" + (_params?.PROTOCOL ? "s" : "") + "://" + _params?.DOMAIN;
    _parentWindow.postMessage(cmd, url);
    return promise;
  };

  const _addResolver = (resolver: Function): string => {
    const key: string = _uniqueKey();
    _resolvers[key] = resolver;
    return key;
  };

  function _setListener (): void {
    _currentWindow.addEventListener("message", _eventHandler);
  };

  const _eventHandler = (e: MessageEvent): void => {
    const arr = e.data !== undefined && typeof e.data === 'string' ? e.data.match(/(^.*?):(.*$)/) : [];
    if (arr?.length === 3) {
      _resolvers[arr[1]]?.call(null, JSON.parse(arr[2]));
    }
  };

  _setListener();

  return ({
    _params,
    _currentWindow,
    _parentWindow,
    _resolvers,
    _uniqueKey,
    send,
    _addResolver,
    _setListener,
    _eventHandler,
  });
};

export default sendMessage;
