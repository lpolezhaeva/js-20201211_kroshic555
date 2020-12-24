/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '' || size === 0) {
    return '';
  }

  let newString = string[0];
  let counter = 1;

  for (let i = 1; i < string.length; i++) {
    if (counter >= size && string[i] === string[i - 1]) {
      counter++;
    } else if (string[i] !== string[i - 1]) {
      newString += string[i];
      counter = 1;
    } else {
      newString += string[i];
      counter++;
    }
  }

  return newString;
}
