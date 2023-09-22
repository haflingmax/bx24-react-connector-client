import { Method } from "../call-method";

export const taskListForPage = (BX24Call: (props: Method) => Promise<void>) => (
  currentPage: number = 1,
  sizePage: number = 50,
  showFinishTasks: boolean = false,
  select: string[] = [],
  responsibleId?: string | undefined,
  hierarchy?: boolean | undefined,
  parentId?: string | undefined,
  callBackFunction?: Function | undefined
) => {
  let ONLY_ROOT_TASKS = false;

  if (hierarchy) {
    ONLY_ROOT_TASKS = true;
  } else {
    ONLY_ROOT_TASKS = false;
  }

  const key = `tasks.task.list_${currentPage}`;

  BX24Call({
    name: "tasks.task.list",
    params: {
      limit: sizePage,
      start: (currentPage - 1) * sizePage,
      select: select,
      filter: {
        ...(showFinishTasks ? {} : { "!REAL_STATUS": 5 }),
        ...(responsibleId === undefined
          ? {}
          : { RESPONSIBLE_ID: responsibleId }),
        ...(parentId === undefined ? {} : { PARENT_ID: parentId }),
        ...(ONLY_ROOT_TASKS === undefined && parentId === undefined
          ? {}
          : { ONLY_ROOT_TASKS: "Y" }),
      },
      order: { ID: "desc" },
    },
    readAll: false,
    callBackFunction:
      callBackFunction === undefined
        ? () => {}
        : (result: any) => {
            const callMethod = taskListForPage(BX24Call);
            result.result.tasks.forEach((task: any) => {
              callMethod(
                currentPage,
                sizePage,
                showFinishTasks,
                select,
                responsibleId,
                false,
                task.id
              );
            });
            callBackFunction();
          },
    castomSetState: (result: any) => (answer: any) => {
      if (result.key !== undefined) {
        const oldData = answer.find(
          (item: any) => item.id === "tasks.task.list" && item.key === key
        );
        if (oldData === undefined)
          return [
            ...answer.filter((item: any) => item.id !== "tasks.task.list"),
            { ...result },
          ];
        if (
          result.result === undefined ||
          (result.result !== undefined && result.result.tasks.length === 0)
        )
          return [
            ...answer.filter((item: any) => item.id !== "tasks.task.list"),
            { ...oldData },
          ];

        const updataResult = updateData(
          oldData.result.tasks,
          result.result.tasks,
          parentId
        );
        oldData.result.tasks = updataResult;
        if (parentId === undefined) oldData.total = result.total;
        return [
          ...answer.filter(
            (item: any) => item.id !== "tasks.task.list" && item.key === key
          ),
          oldData,
        ];
      } else {
        return [
          ...answer.filter((item: any) => item.id !== "tasks.task.list"),
          result,
        ];
      }
    },
    key: key,
  });
};

export const taskList = (BX24Call: (props: Method) => Promise<void>) => (
  order: {} | undefined = [{ ID: "desc" }],
  filter: {} | undefined = {},
  select: string[] | undefined = [],
  limit: number | undefined = 50,
  start: number | undefined = 1,
  callBackFunction: Function = () => {}
) => {
  BX24Call({
    name: "tasks.task.list",
    params: {
      order,
      filter,
      select,
      limit,
      start,
    },
    readAll: false,
    callBackFunction,
  });
};

const updateData = (
  oldTasks: any,
  newTasks: any,
  parentId: string | undefined
): {} => {
  if (parentId !== undefined) {
    return oldTasks.map((task: any) => {
      if (task.id === parentId) {
        task.children =
          task.children === undefined
            ? newTasks
            : task.children.map((subTask: any) => {
                const newSubTask = newTasks.find(
                  (newSubTask: any) => newSubTask.id === subTask.id
                );
                if (subTask.children !== undefined)
                  newSubTask.children = subTask.children;
                return newSubTask;
              });
        return task;
      } else if (task.children !== undefined && task.children.length > 0) {
        task.children = updateData(task.children, newTasks, parentId);
        return task;
      } else {
        return task;
      }
    });
  } else {
    return newTasks;
  }
};
