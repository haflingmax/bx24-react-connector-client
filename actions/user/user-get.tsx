import { Method } from "../call-method";

export const userGet = (BX24Call: (props: Method) => Promise<void>) => (
  sort?: string | undefined,
  order?: string | undefined,
  ID?: string[] | undefined,
  NAME?: string | undefined,
  select?: string[] | undefined,
  callBackFunction?: Function
) => {
  BX24Call({
    name: "user.get",
    params: {
      ...(sort === undefined ? {} : { sort }),
      ...(order === undefined ? {} : { order }),
      ...(ID === undefined ? {} : { ID }),
      ...(NAME === undefined ? {} : { NAME }),
      ...(select === undefined
        ? [
            "ID",
            "ACTIVE",
            "NAME",
            "LAST_NAME",
            "SECOND_NAME",
            "PERSONAL_PAGER",
            "PERSONAL_PHOTO",
            "WORK_POSITION",
          ]
        : [...select]),
    },
    readAll: true,
    callBackFunction,
  });
};

export type UserCurrent = {
  callBackFunction?: () => void;
};

export const userCurrent = (BX24Call: (props: Method) => Promise<void>) => (
  props: UserCurrent
) => {
  const { callBackFunction } = props;

  BX24Call({
    name: "user.current",
    params: {},
    readAll: true,
    callBackFunction,
  });
};
