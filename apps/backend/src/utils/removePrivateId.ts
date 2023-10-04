// export function removePrivateFields<T = Record<string, unknown>>(obj: T): T {
//   return obj.entries().reduce((acc, [key, value]) => {
//     return key.startsWith("_") ? acc : { ...acc, [key]: value };
//   }, {});

// }

//TODO ARRUMAR
export function removePrivateFields<T = Record<string, unknown>>(obj: T): T {
  return obj;
}
