export default function stringInject(str: string, data: string[] | Record<string, string>) {
  if (data instanceof Array) {
    return str.replace(/({\d})/g, (i) => {
      return data[+i.replace(/{/, "").replace(/}/, "")];
    });
  }

  if (Object.keys(data).length === 0) {
    return str;
  }

  return str.replace(/({([^}]+)})/g, (i) => {
    const key = i.replace(/{/, "").replace(/}/, "");
    if (!data[key]) {
      return i;
    }

    return data[key];
  });
}
