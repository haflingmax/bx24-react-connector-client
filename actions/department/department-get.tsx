import { Method } from "../call-method";

export const departmentGet = (BX24Call: (props: Method) => Promise<void>) => (
  sort?: string | undefined,
  order?: string | undefined,
  ID?: string[] | undefined,
  NAME?: string | undefined,
  PARENT?: string | undefined,
  UF_HEAD?: string | undefined,
  callBackFunction?: Function
) => {
  BX24Call({
    name: "department.get",
    params: {
      ...(sort === undefined ? {} : { sort }),
      ...(order === undefined ? {} : { order }),
      ...(ID === undefined ? {} : { ID }),
      ...(NAME === undefined ? {} : { NAME }),
      ...(PARENT === undefined ? {} : { PARENT }),
      ...(UF_HEAD === undefined ? {} : { UF_HEAD }),
    },
    readAll: true,
    callBackFunction: callBackFunction,
  });
};
