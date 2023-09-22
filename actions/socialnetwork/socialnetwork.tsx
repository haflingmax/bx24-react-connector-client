import { AnswerMethod, Method } from "../call-method";

export const workgroupList = (BX24Call: (props: Method) => Promise<void>) => (
  filter?: { ID: string } | undefined,
  start?: number | undefined,
  limit?: number | undefined,
  select?: string[] | undefined,
  callBackFunction?: Function
) => {
  const name = "socialnetwork.api.workgroup.list";
  BX24Call({
    name: name,
    params: {
      filter: {
        ...(filter === undefined
          ? { FILTER_ID: "SONET_GROUP_LIST_SCRUM" }
          : { FILTER_ID: "SONET_GROUP_LIST_SCRUM" }),
      },
      start: start === undefined ? 0 : start,
      limit: limit === undefined ? 50 : limit,
      select:
        select === undefined
          ? [
              "ID",
              "SITE_ID",
              "NAME",
              "DESCRIPTION",
              "DATE_CREATE",
              "DATE_UPDATE",
              "DATE_ACTIVITY",
              "ACTIVE",
              "VISIBLE",
              "OPENED",
              "CLOSED",
              "SUBJECT_ID",
              "OWNER_ID",
              "KEYWORDS",
              "IMAGE_ID",
              "NUMBER_OF_MEMBERS",
              "INITIATE_PERMS",
              "SPAM_PERMS",
              "SUBJECT_NAME",
            ]
          : { select },
      order: { ID: "desc" },
    },
    readAll: true,
    callBackFunction,
    castomSetState: (result: any) => (answer: any) => {
      const newResult = result.result.reduce((result: any[], item: any) => {
        return [...result, ...item.workgroups];
      }, []);
      return [
        ...answer.filter((item: AnswerMethod) => item.id !== name),
        { ...result, result: { workgroups: newResult } },
      ];
    },
  });
};
