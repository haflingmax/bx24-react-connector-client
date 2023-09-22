import { BX24Params, IAuth } from "../react-bx24-types";

export const _checkAuth = (
  _params: {
    setAuthExpires: Function;
    getAuthExpires: Function;
    getAuth: Function;
  } & BX24Params
): boolean => {
  const authExpires = _params.getAuthExpires(_params);
  const check =
    typeof _params.APP_SID !== "undefined" &&
    typeof authExpires === "number" &&
    authExpires > Date.now();
  return check;
};

export const getAuth = ({
  _params,
  _messageSender,
}: {
  _params: {
    setAuthExpires: Function;
    getAuthExpires: Function;
    getAuth: Function;
  } & BX24Params;
  _messageSender: any;
}): Promise<IAuth> => {
  if (_params === undefined)
    return new Promise<IAuth>((resolve, reject) => {
      resolve(undefined);
    });

  let resultPromise: Promise<IAuth>;
  if (!_checkAuth(_params) && Number(_params.AUTH_EXPIRES) > 0) {
    resultPromise = new Promise<IAuth>((resolve, reject) => {
        _messageSender
          .send("refreshAuth", null)
          .then((params: any) => {
            _params = Object.assign(_params, params);
            resolve(_params.getAuth(_params));
          })
          .catch((err: any) => {
            reject(err);
          });
      });
  } else {

    resultPromise = new Promise<IAuth>((resolve, reject) => {
      _messageSender
        .send("getInitData")
        .then((params: any) => {
          _params = Object.assign(_params, params);
          resolve(_params.getAuth(_params));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  return resultPromise;
};
