import { DATATYPE } from '~/config/type'
const toString = Object.prototype.toString
export default function getType (value) {
  let str = ''
  if (value == null) {
    str = value === undefined ? '[object Undefined]' : '[object Null]'
  }
  str = toString.call(value)
  return str.slice(str.indexOf(' '), str.indexOf(']')).trim()
}
export const isType = {}
Object.keys(DATATYPE).map((item) => {
  isType[`is${firstUpperCase(item)}`] = (val) => {
    return getType(val) === DATATYPE[item]
  }
})

export function firstUpperCase (str) {
  return str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
    return $1.toUpperCase() + $2.toLowerCase()
  })
}
