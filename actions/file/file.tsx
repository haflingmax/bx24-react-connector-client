import { Method } from "../call-method";

export type DiskFileGetExternalLink = {
  id: string;
  callBackFunction?: () => void;
};

export const diskFileGetExternalLink = (
  BX24Call: (props: Method) => Promise<void>
) => (props: DiskFileGetExternalLink) => {
  const { id, callBackFunction } = props;

  BX24Call({
    name: "disk.file.getExternalLink",
    params: {
      id,
    },
    readAll: true,
    callBackFunction: callBackFunction,
  });
};
