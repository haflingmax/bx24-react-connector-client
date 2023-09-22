import { Method } from "../call-method";

export type EntityAdd = {
  ENTITY: string;
  NAME: string;
  ACCESS?: ("R" | "W" | "X")[];
  callBackFunction?: () => void;
};

export const entityAdd = (BX24Call: (props: Method) => Promise<void>) => (
  props: EntityAdd
) => {
  const { ENTITY, NAME, ACCESS, callBackFunction } = props;

  BX24Call({
    name: "entity.add",
    params: {
      ENTITY: ENTITY,
      NAME: NAME,
      ...(ACCESS === undefined ? ["X"] : ACCESS),
    },
    readAll: true,
    callBackFunction,
  });
};
