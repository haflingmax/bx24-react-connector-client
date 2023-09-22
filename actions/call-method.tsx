import { useEffect, useState } from "react";
import use24BX from "../get-bx24-context";
import { getQueryString } from "../utilits/get-query-string";
import { BX24Params } from "../react-bx24-types";

export type Method = {
    name: methodId;
    params: {
        [key: string]: string | number | object;
    },
    readAll?: boolean;
    callBackFunction?: Function;
    castomSetState?: Function;
    key?: string;
} 

type methodId = "department.get" 
| "user.get"
| "user.current" 
| "tasks.task.list" 
| "task.item.getdata" 
| "socialnetwork.api.workgroup.list" 
| "CSocNetGroupSubject.GetList"
| "disk.folder.addsubfolder"
| "disk.folder.getchildren"
| "disk.folder.get"
| "disk.storage.getlist"  
| "disk.storage.getchildren"
| "disk.file.getExternalLink"
| "entity.add"
| "app.info"
|"undefined-method-id";

export type AnswerMethod = {
    id: methodId,
    next?: number;
    result: any[];
    time: {
        date_finish: string;
        date_start: string;
        duration: number;
        finish: number;
        processing: number;
        start: number;
    };
    total: number;
    error?: 'expired_token' | "";
    key?: string;
} 

const getMethodId = (name: string): methodId => {
    switch (name) {
        case "department.get":
            return "department.get"; 
        case "user.get":
            return "user.get";
        case "user.current":
            return "user.current"; 
        case "tasks.task.list":
            return "tasks.task.list";     
        case "task.item.getdata":
            return "task.item.getdata"; 
        case "socialnetwork.api.workgroup.list":
            return "socialnetwork.api.workgroup.list"; 
        case "CSocNetGroupSubject.GetList": 
            return "CSocNetGroupSubject.GetList"; 
        case "disk.folder.addsubfolder":
            return "disk.folder.addsubfolder";
        case "disk.folder.getchildren":
            return "disk.folder.getchildren";
        case "disk.storage.getlist": 
            return "disk.storage.getlist";  
        case "disk.storage.getchildren": 
            return "disk.storage.getchildren";
        case "disk.folder.get":
            return "disk.folder.get";
        case "disk.file.getExternalLink": 
            return "disk.file.getExternalLink";
        case "entity.add":
            return "entity.add";
        case "app.info": 
            return "app.info";
        default:
            return "undefined-method-id";
    }
}

const collapseResult = (prevResult: any, nextResult: any):any[] => {

    if(Array.isArray(prevResult) && Array.isArray(nextResult)) {
        return [...prevResult, ...nextResult];        
    } else if(Array.isArray(prevResult) && !Array.isArray(nextResult)) {
        return [...prevResult, nextResult];
    } else if(!Array.isArray(prevResult) && Array.isArray(nextResult)) {
        return [prevResult, ...nextResult];
    } else {
        return [prevResult, nextResult];
    }

  }
  
export const useBX24Call = (): [answer: any, callMethod: (props: Method) => Promise<void>, _params: {_params: BX24Params, _messageSender: any } | undefined] => {

    const { state, actions, _params } = use24BX();
    const [ answer, setAnswer ] = useState<any[]>([]);
    const [ methodToDo, setMethodToDo ] = useState<Method[]>([]);

    const setCallMethod: (props: Method) => Promise<void> = async ({
        name, 
        params = { start: 0 }, 
        readAll = false,
        callBackFunction = () => {},
        castomSetState = undefined,
        key = undefined,
    }) => {
        setMethodToDo((methodToDo: Method[]) => {
            const findMethod = key === undefined ? methodToDo.find((item: Method) => item.name === name) : undefined;
            if(findMethod !== undefined) {
                return methodToDo;
            } else {
                return [...methodToDo, { name, params, readAll, callBackFunction, castomSetState, key }]
            }
        }); 
    }

    const toDoMethod = async (methods: Method[]) => {

        if (state === undefined || state?.ACCESS_TOKEN === undefined || (state?.EXPIRES_IN !== undefined && new Date(state.EXPIRES_IN).getTime() < new Date().getTime())) {
            await actions.auth();            
            return;
        } 

        let skip = false;

        methods.forEach( async ({ name, params, readAll, callBackFunction, castomSetState, key }: Method) => {           

            if(skip) return;
            const result = await callMethod({name, params, readAll}, undefined, key);

            if(result?.error !== undefined && result.error === 'expired_token') {
                await actions.auth();
                skip = true;
                return;
            } else {
                setMethodToDo(( methodToDo ) => ([...methodToDo.filter((item: Method) => !(item.name === name && JSON.stringify(item.params) === JSON.stringify(params)))]));
            }

            try {
                callBackFunction !== undefined ? callBackFunction(result) : undefined;
            } catch (error) {
                console.error(`${name}: ${error}`);
            }

            if(castomSetState === undefined) {
                setAnswer((answer) => ([...answer.filter((item: AnswerMethod) => item.id !== name), result ]));
            } else {
                const _castomSetState = castomSetState(result);
                setAnswer(_castomSetState);
            }           
        })        
    }

    const callMethod = async ({ name, params, readAll }: Method, next: number | undefined = undefined, key?: string): Promise<AnswerMethod | undefined> => {

        const _params = { ...params, auth: state?.ACCESS_TOKEN, start: (next !== undefined ? next : params.start) };    

        const queryString = getQueryString(_params);
    
        let result: any = {};
    
        try {
            result = await fetch(state?.BASE_URL + `/rest/${name}?`, {
                method: 'POST',
                body: queryString,
            });
        } catch (error) {
            result.status = 0;
        }  
    
        const finishResult: AnswerMethod = await result.json();

        if(readAll && finishResult.next !== undefined && finishResult?.next > 0) {
            const nextResult = await callMethod({ name, params, readAll }, finishResult.next);
            const reduceResult: AnswerMethod = {
                id: getMethodId(name),
                total: finishResult.total,
                result: nextResult?.result === undefined ? finishResult.result : collapseResult(finishResult.result, nextResult?.result !== undefined ? nextResult?.result : []),
                time: {
                    start: finishResult.time.start,
                    date_start: finishResult.time.date_start,
                    date_finish: nextResult?.time.date_finish === undefined ? finishResult.time.date_finish : nextResult?.time.date_finish, 
                    finish: nextResult?.time.finish === undefined ? finishResult.time.finish : nextResult?.time.finish,
                    duration: nextResult?.time.duration === undefined ? finishResult.time.duration : nextResult?.time.duration + finishResult.time.duration,
                    processing: nextResult?.time.processing === undefined ? finishResult.time.processing : nextResult?.time.processing + finishResult.time.processing,
                },
                ...( key !== undefined ? { key } : {})
            }
            return reduceResult;
        } else {     
            return { ...finishResult, id: getMethodId(name), ...( key !== undefined ? { key } : {}) };
        }        
    }

    useEffect(() => {
        if(methodToDo === undefined) return;
        toDoMethod(methodToDo);
    }, [ methodToDo.length, JSON.stringify(state) ]);

    return [ answer, setCallMethod, _params ];

  }

  export default useBX24Call;