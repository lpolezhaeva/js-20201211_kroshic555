/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  /* First version
  const clone = {};
  for (let field of fields) {
    if (field in obj) {
      clone[field] = obj[field];
    }
  }
  return clone;
   */

  // Second version
  const clone = {}
  for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      clone[key] = value;
    }
  }
  return clone;

  /* Third version
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => {
        if (fields.includes(key)) {
          return true;
        }
      })
  );
   */
};
