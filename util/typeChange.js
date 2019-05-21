import getType, { isType } from '~/util/type'
import { generateUUID } from '~/util/uuid'
import json, { rectWidth, rectHeight, rectTop, rectLeft, circleWidth } from '~/config/json'
const { color, interval, cx } = json
const { isObj, isArr, isStr, isNum, isBool, isNull, isUndefined } = isType

export const changeObjToArray = (data, list = []) => {
  if (isObj(data)) {
    list = Object.keys(data).map((item) => {
      return {
        key: item,
        name: item,
        title: item,
        type: getType(data[item]),
        children: changeObjToArray(data[item])
      }
    })
  }
  if (isArr(data)) {
    return data
      .map((item) => {
        if (isObj(item)) {
          const { __ob__, ...other } = item
          return other
        }
        return item
      })
      .map((item, index) => {
        return {
          key: index,
          name: index,
          title: index,
          type: getType(item),
          children: changeObjToArray(item)
        }
      })
  }
  if (isStr(data) || isNum(data) || isBool(data) || isNull(data) || isUndefined(data)) {
    return isNull(data) || isUndefined(data) ? '' : data
  }
  return list
}

export function nestToArray (source, list = []) {
  source.forEach((item) => {
    let obj = {}
    for (const [ key, value ] of Object.entries(item)) {
      if (keys.findIndex((i) => i === key) !== -1) {
        obj[key] = value
      } else {
        if (isArr(value)) {
          nestToArray(value, list)
        }
      }
    }
    list.push(obj)
  })
  return list
}

export function addTag (list, num = 0, parentId, array = []) {
  list.forEach(({ children, ...item }, index) => {
    item.id = generateUUID()
    item.num = num
    item.parentId = -1
    if (num > 0 && parentId) {
      item.parentId = parentId
    }
    if (isArr(children)) {
      array.push({ val: getType(children), ...item })
      addTag(children, num + 1, item.id, array)
    } else {
      array.push({ val: children, ...item })
    }
  })
  return array
}

export function setHierarchy (list, array = [], id = -1, num = 0) {
  const arr = list.filter((item) => item.parentId === id)
  if (arr.length > 0) {
    if (!array[num]) {
      array[num] = [ ...arr ]
    } else {
      array[num] = array[num].concat(arr)
    }
    arr.forEach((item) => {
      setHierarchy(list, array, item.id, num + 1)
    })
  }
  return array
}

export function onLocal (list) {
  const index = Math.max.apply(null, list.map((item) => item.length))
  // const titalHeight = index * interval
  // const maxLength = Math.max.apply(null, arr.map((item) => item.length))
  let maxTop = index * rectHeight + (index - 1) * rectTop
  console.log(('maxTop', maxTop))
  return list.map((item, index) => {
    const num = maxTop - item.length * rectHeight
    if (num === 0) {
      debugger
    }
    // maxTop-
    // let firstTop = (maxTop - (item.length * rectHeight + (item.length - 1) * rectTop)) / 2
    return item.map((i, ind) => {
      const x = (rectWidth + rectLeft) * index
      const y = num * (ind + 1)
      // console.log('x:', x, 'y:', y)
      // console.log(y)

      // debugger
      return {
        cx: cx,
        transform: `translate(${x},${y})`,
        ...i
      }
    })
  })
}
