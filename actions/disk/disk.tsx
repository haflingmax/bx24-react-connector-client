import { Method } from "../call-method";

export type DiskFolderAddsubfolder = {
  id: string;
  data: {
    NAME: string;
  };
  PARENT_ID?: string | undefined;
  callBackFunction?: () => void;
};

export const diskFolderAddsubfolder = (
  BX24Call: (props: Method) => Promise<void>
) => (props: DiskFolderAddsubfolder) => {
  const { id, data, PARENT_ID, callBackFunction } = props;

  BX24Call({
    name: "disk.folder.addsubfolder",
    params: {
      id: id,
      data: data,
      ...(PARENT_ID === undefined ? {} : { PARENT_ID: PARENT_ID }),
    },
    readAll: true,
    callBackFunction: callBackFunction,
  });
};

export type DiskStorageGetlist = {
  filter?: {};
  callBackFunction?: () => void;
};

export const diskStorageGetlist = (
  BX24Call: (props: Method) => Promise<void>
) => (props: DiskStorageGetlist) => {
  const { filter, callBackFunction } = props;

  BX24Call({
    name: "disk.storage.getlist",
    params: {
      ...(filter === undefined ? {} : { filter: filter }),
    },
    readAll: true,
    callBackFunction,
  });
};

export type DiskStorageGetchildren = {
  id: string;
  filter?: {};
  callBackFunction?: () => void;
};

export type StorageChildren = {
  ID: string;
  NAME: string;
  STORAGE_ID: string;
  DETAIL_URL: string;
  PARENT_ID: string;
  TYPE: "file" | "folder" | "storage";
  REAL_OBJECT_ID: string;
  CREATED_BY: string;
};

export const diskStorageGetchildren = (
  BX24Call: (props: Method) => Promise<void>
) => (props: DiskStorageGetchildren) => {
  const { id, filter, callBackFunction } = props;

  BX24Call({
    name: "disk.storage.getchildren",
    params: {
      id,
      ...(filter === undefined ? {} : { filter: filter }),
    },
    readAll: true,
    callBackFunction,
  });
};

export type DiskFolderGetchildren = {
  id: string;
  filter?: {};
  callBackFunction?: () => void;
};

export type FolderChildren = {
  ID: string;
  NAME: string;
  STORAGE_ID: string;
  DETAIL_URL: string;
  PARENT_ID: string;
  TYPE: "file" | "folder";
  REAL_OBJECT_ID: string;
  CREATED_BY: string;
  DOWNLOAD_URL: string;
};

export const diskFolderGetchildren = (
  BX24Call: (props: Method) => Promise<void>
) => (props: DiskFolderGetchildren) => {
  const { id, filter, callBackFunction } = props;

  BX24Call({
    name: "disk.folder.getchildren",
    params: {
      id,
      ...(filter === undefined ? {} : { filter: filter }),
    },
    readAll: true,
    callBackFunction,
  });
};

export type DiskFolderGet = {
  id: string;
  filter?: {};
  callBackFunction?: () => void;
};

export const diskFolderGet = (BX24Call: (props: Method) => Promise<void>) => (
  props: DiskFolderGet
) => {
  const { id, filter, callBackFunction } = props;

  BX24Call({
    name: "disk.folder.get",
    params: {
      id,
      ...(filter === undefined ? {} : { filter: filter }),
    },
    readAll: true,
    callBackFunction,
  });
};
