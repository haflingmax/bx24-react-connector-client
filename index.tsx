import { AppInfo, AppInfoProps, appInfo } from "./actions/app-info";
import { openPath, resizeWindow } from "./actions/bx24/bx24";
import useBX24Call from "./actions/call-method";
import { departmentGet } from "./actions/department/department-get";
import { DiskFolderAddsubfolder, DiskFolderGet, DiskFolderGetchildren, DiskStorageGetchildren, DiskStorageGetlist, diskFolderAddsubfolder, diskFolderGet, diskFolderGetchildren, diskStorageGetchildren, diskStorageGetlist } from "./actions/disk/disk";
import { EntityAdd, entityAdd } from "./actions/entity/entity";
import { DiskFileGetExternalLink, diskFileGetExternalLink } from "./actions/file/file";
import { workgroupList } from "./actions/socialnetwork/socialnetwork";
import { taskList, taskListForPage } from "./actions/tasks/tasks-list";
import { UserCurrent, userCurrent, userGet } from "./actions/user/user-get";

export type MethodsBX24 = {
    app: {
        info: () => void;
    }
    bx24: {
        resizeWindow: (width: number | string, height:  number | string) => void,
        openPath: (path: string, callBackFunction: () => void) => void
    };
    socialnetwork: {
        api: {
            workgroup: {
                list: (
                    filter?: {
                        ID: string;
                    } | undefined, 
                    start?: number | undefined, 
                    limit?: number | undefined,
                    select?: string[] | undefined, 
                    callBackFunction?: Function | undefined
                    ) => void
            }
        }
    },
    tasks: {
        task: {
            list: (
                order: {} | undefined, 
                filter: {} | undefined, 
                select: string[] | undefined, 
                limit: number | undefined, 
                start: number | undefined, 
                callBackFunction?: Function
                ) => void,
            page: (
                currentPage: number, 
                sizePage: number, 
                showFinishTasks: boolean, 
                select: string[], 
                responsibleId?: string | undefined, 
                hierarchy?: boolean | undefined, 
                parentId?: string | undefined,
                callBackFunction?: Function | undefined
                ) => void,
        }
    };
    departmet: {
        get: (sort?: string | undefined, order?: string | undefined, ID?: string[] | undefined, NAME?: string | undefined, PARENT?: string | undefined, UF_HEAD?: string | undefined, callBackFunction?: Function) => void
    };
    user: {
        get: (
            sort?: string | undefined, 
            order?: string | undefined, 
            ID?: string[] | undefined, 
            NAME?: string | undefined, 
            select?: string[] | undefined,
            callBackFunction?: Function | undefined
            ) => void;
        current: (props: UserCurrent) => void;
    }; 
    entity: {
        add: (props: EntityAdd) => void;
    };
    disk: {
        folder: {
            addsubfolder: (props: DiskFolderAddsubfolder) => void;
            getchildren: (props: DiskFolderGetchildren) => void;
            get: (props: DiskFolderGet) => void;
        },
        storage: {
            getlist: (props: DiskStorageGetlist) => void;
            getchildren: (props: DiskStorageGetchildren) => void;
        },
        file: {
            getExternalLink: (props: DiskFileGetExternalLink) => void;
        }
    }
}

const useBX24 = (): [any[], MethodsBX24] => {

    const [stateBX24Call, BX24Call, _params] = useBX24Call(); 

    const methodsBX24: MethodsBX24 = {
        app: {
            info: appInfo(BX24Call),
        },
        bx24: {
            resizeWindow: resizeWindow(_params),
            openPath: openPath(_params)
        },
        socialnetwork: {
            api: {
                workgroup: {
                    list: workgroupList(BX24Call),
                },
            },
        },
        tasks: {
            task: {
                list: taskList(BX24Call),
                page: taskListForPage(BX24Call),
            }
        },
        departmet: {
            get: departmentGet(BX24Call),
        },
        user: {
            get: userGet(BX24Call),
            current: userCurrent(BX24Call),
        },
        entity: {
            add: entityAdd(BX24Call),
        },
        disk: {
            folder: {
                addsubfolder: diskFolderAddsubfolder(BX24Call),
                getchildren: diskFolderGetchildren(BX24Call),
                get: diskFolderGet(BX24Call),
            },
            storage: {
                getlist: diskStorageGetlist(BX24Call),
                getchildren: diskStorageGetchildren(BX24Call)
            }, 
            file: {
                getExternalLink: diskFileGetExternalLink(BX24Call),
            }           
        }
    }    

    return [stateBX24Call, methodsBX24]

}

export default useBX24;