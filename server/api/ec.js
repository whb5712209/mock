const express = require('express')
const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname, '../../', 'data')
const parseString = require('xml2js').parseString;
const ec = express()
ec.post('/*', (req, res) => {
  const url = `${dataPath}${req.path}`
  const hasXMl = fs.existsSync(`${url}.xml`);
  if (hasXMl) {
    const data = fs.readFileSync(`${url}.xml`, {
      encoding: 'utf8'
    })
    parseString(data, (err, result) => {
      if (err) {
        res.send(err)
      }
      const { type, value } = onFormat(result, req.body)
      if (type === 'json') {
        try {
          const data = fs.readFileSync(`${dataPath}/${value}`, {
            encoding: 'utf8'
          })
          res.send(data)
        } catch (e) {
          res.send(e)
        }
      } else {
        res.send({ message: '找不到任何配置啊......' })
      }
    });
  } else {
    const hasJSON = fs.existsSync(`${url}.json`);
    if (hasJSON) {
      const data = fs.readFileSync(`${url}.json`, {
        encoding: 'utf8'
      })
      res.send(data)
    } else {
      const hasConfig = fs.existsSync(`${url}.js`);
      if (hasConfig) {
        const data = require(`${url}.js`)
        res.send(data)
      } else {
        res.send({ message: '找不到任何配置啊......' })
      }
    }
  }
})
module.exports = ec

function onFormat(result, params) {
  const query = result.param.query
  const config = {}
  let defaultConfig = {}
  let sort = 0
  query.forEach(item => {
    sort = 0
    if (!item.property) {
      defaultConfig = item.$
      config[0] = item.$
      return true
    } else {
      const list = item.property.map(i => i.$)
      sort = list.length
      const _val = list.every(i => {
        i.value = onFormatByJS(i.value, i.type)
        if (i.type === 'Object') {
          Object.keys(i.value).forEach(j => {
            if (i.value[j] == params[i.name][j]) {
              sort += 2;
            }
            if (i.value[j] == '*') {
              sort++;
            }
          })
          return Object.keys(i.value).some(j => (i.value[j] == '*' || i.value[j] == params[i.name][j]))
        }
        if (i.value == params[i.name]) {
          sort += 2;
        }
        if (i.value == '*') {
          sort++;
        }
        return i.value == params[i.name] || i.value == '*'
      })
      if (_val) {
        value = item.$
        config[sort] = item.$
        return true
      }
    }
    return false
  })
  const sortList = Object.keys(config).map(item => item * 1)
  const maxSort = Math.max.apply(null, sortList)

  if (maxSort) {
    return config[maxSort]
  }
  return defaultConfig
}
function onFormatByJS(source, format = 'String') {
  if (format === 'String') {
    return source + ''
  }
  if (format === 'Number') {
    return source * 1
  }
  if (format === 'Boolean') {
    return source === 'true' || source === 'True' || source === 'TRUE'
  }
  if (format === 'Object') {
    return JSON.parse(source)
  }
  if (format === 'Array') {
    return JSON.parse(source)
  }
}