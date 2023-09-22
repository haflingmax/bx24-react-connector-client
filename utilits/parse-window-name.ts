function parseWindowName(
  windowName: string
): {
  DOMAIN: string | undefined;
  PROTOCOL: number | undefined;
  APP_SID: string | undefined;
} {
  const q = windowName.split("|");
  return {
    DOMAIN: q[0].replace(/\:(80|443)$/, ""),
    PROTOCOL: parseInt(q[1], 10) || 0,
    APP_SID: q[2],
  };
}

export default parseWindowName;
