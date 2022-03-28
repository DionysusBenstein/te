export const createInstance = (cls: any, dependency: any) =>
  new cls({
    ...dependency,
  });
