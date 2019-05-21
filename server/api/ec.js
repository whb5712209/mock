const express = require('express')
const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname, '../../', 'data')
const xml2js = require('xml2js');
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
      console.dir(result);
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
  let value = null
  let defaultConfig = null
  query.forEach(item => {
    if (!item.property) {
      defaultConfig = item.$
    } else {
      const list = item.property.map(i => i.$)
      const _val = list.every(i => i.value == params[i.name] || i.value == '*')
      if (_val) {
        value = item.$
      }
    }
  })
  return value ? value : defaultConfig
}
