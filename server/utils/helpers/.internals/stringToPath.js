import memoizeCapped from './memoizeCapped.js'

const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g');

const stringToPath = memoizeCapped((value ) => {
    const result  = []
    if (value.charCodeAt(0) === charCodeOfDot) {
      result.push('')
    }
    value.replace(rePropName, (match , expression , quote , subString ) => {
      let key = match
      if (quote) {
        key = subString.replace(reEscapeChar, '$1')
      }
      else if (expression) {
        key = expression.trim()
      }
      result.push(key)
    })
    return result
})

 
export default stringToPath;