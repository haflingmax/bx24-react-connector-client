import { BX24Params } from "../../react-bx24-types";
import { _checkAuth } from "../get-auth";

export const callMethod = async (cmd: string, _params: any, _messageSender: any, params: any): Promise<any> => {

    if (_params === undefined) return new Promise((resolve) => undefined);
  
    let resultPromise: Promise<any>;
    
    resultPromise = new Promise<any>((resolve, reject) => {
      _messageSender
        .send(cmd, params)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });

    return resultPromise;

  };

export const resizeWindow = (params: {_params: BX24Params, _messageSender: any } | undefined) => async (width: number | string, height:  number | string): Promise<void> => {
    
    const { _params, _messageSender } = { ...params};

    const result = await callMethod("resizeWindow", _params, _messageSender,  { width: String(width), height: String(height) });

}
  
export const openPath = (params: {_params: BX24Params, _messageSender: any } | undefined) => async (path: string): Promise<void> => {
    
    const { _params, _messageSender } = { ...params};

    const result = await callMethod("openPath", _params, _messageSender,  {
        path: path
      });

} 