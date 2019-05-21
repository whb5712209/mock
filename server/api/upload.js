const express = require('express')
const upload = express() // the sub app
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const publicPath = path.join(__dirname, '../../', 'public')

const uploadFile = multer({
  dest: `${publicPath}/`
})

upload.post('/', uploadFile.single('avatar'), (req, res) => {
  // 没有附带文件
  console.log(uploadFile)
  if (!req.file) {
    res.setHeader('content-type', 'text/html')
    res.json({
      ok: false
    })
    return
  }
  console.log('fieldname: ' + req.file.fieldname)
  console.log('originalname: ' + req.file.originalname)
  console.log('encoding: ' + req.file.encoding)
  console.log('mimetype: ' + req.file.mimetype)
  console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB')
  console.log('destination: ' + req.file.destination)
  console.log('filename: ' + req.file.filename)
  console.log('path: ' + req.file.path)
  setTimeout(() => {
    if ((req.file.size / 1024).toFixed(2) > 1024 * 100) {
      res.setHeader('content-type', 'text/html')
      res.json({
        message: '上传失败,文件大于100M',
        code: 500,
        data: ''
      })
    } else {
      // 重命名文件
      let oldPath = req.file.path
      let newPath = path.join(__dirname, '../../', 'public/' + req.file.originalname)
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          res.json({
            ok: false
          })
          console.log(err)
        } else {
          let url = 'http://' + req.headers.host + '/' + req.file.originalname
          res.setHeader('content-type', 'text/html')
          res.json({
            message: '上传成功',
            code: 200,
            data: {
              url: url,
              name: req.file.originalname
            }
          })
        }
      })
    }
  }, 0)
})

module.exports = upload
