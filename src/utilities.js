/**
 * Make a deep copy
 * @param {*} inObject
 * @returns
 */
export const copyObject = (inObject: any) => {
  let outObject: Record<string, any>;
  let value: string;
  let key: string;

  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = copyObject(value);
  }

  return outObject;
};
