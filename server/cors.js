const vary = require('vary')

const defaults = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}

function isString (s) {
  return typeof s === 'string' || s instanceof String
}

function isOriginAllowed (origin, allowedOrigin) {
  if (Array.isArray(allowedOrigin)) {
    return allowedOrigin.some((item) => isOriginAllowed(origin, allowedOrigin[i]))
  } else if (isString(allowedOrigin)) {
    return origin === allowedOrigin
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin)
  } else {
    return !!allowedOrigin
  }
}

function configureOrigin (options, req) {
  const requestOrigin = req.headers.origin
  headers = []
  let isAllowed

  if (!options.origin || options.origin === '*') {
    // allow any origin
    headers.push([
      {
        key: 'Access-Control-Allow-Origin',
        value: '*'
      }
    ])
  } else if (isString(options.origin)) {
    // fixed origin
    headers.push([
      {
        key: 'Access-Control-Allow-Origin',
        value: options.origin
      }
    ])
    headers.push([
      {
        key: 'Vary',
        value: 'Origin'
      }
    ])
  } else {
    isAllowed = isOriginAllowed(requestOrigin, options.origin)
    headers.push([
      {
        key: 'Access-Control-Allow-Origin',
        value: isAllowed ? requestOrigin : false
      }
    ])
    headers.push([
      {
        key: 'Vary',
        value: 'Origin'
      }
    ])
  }

  return headers
}

function configureMethods (options) {
  let methods = options.methods
  if (methods.join) {
    methods = options.methods.join(',') // .methods is an array, so turn it into a string
  }
  return {
    key: 'Access-Control-Allow-Methods',
    value: methods
  }
}

function configureCredentials (options) {
  if (options.credentials === true) {
    return {
      key: 'Access-Control-Allow-Credentials',
      value: 'true'
    }
  }
  return null
}

function configureAllowedHeaders (options, req) {
  let allowedHeaders = options.allowedHeaders || options.headers
  const headers = []

  if (!allowedHeaders) {
    allowedHeaders = req.headers['access-control-request-headers'] // .headers wasn't specified, so reflect the request headers
    headers.push([
      {
        key: 'Vary',
        value: 'Access-Control-Request-Headers'
      }
    ])
  } else if (allowedHeaders.join) {
    allowedHeaders = allowedHeaders.join(',') // .headers is an array, so turn it into a string
  }
  if (allowedHeaders && allowedHeaders.length) {
    headers.push([
      {
        key: 'Access-Control-Allow-Headers',
        value: allowedHeaders
      }
    ])
  }

  return headers
}

function configureExposedHeaders (options) {
  let headers = options.exposedHeaders
  if (!headers) {
    return null
  } else if (headers.join) {
    headers = headers.join(',') // .headers is an array, so turn it into a string
  }
  if (headers && headers.length) {
    return {
      key: 'Access-Control-Expose-Headers',
      value: headers
    }
  }
  return null
}

function configureMaxAge (options) {
  const maxAge = (typeof options.maxAge === 'number' || options.maxAge) && options.maxAge.toString()
  if (maxAge && maxAge.length) {
    return {
      key: 'Access-Control-Max-Age',
      value: maxAge
    }
  }
  return null
}

function applyHeaders (headers, res) {
  for (let i = 0, n = headers.length; i < n; i++) {
    const header = headers[i]
    if (header) {
      if (Array.isArray(header)) {
        applyHeaders(header, res)
      } else if (header.key === 'Vary' && header.value) {
        vary(res, header.value)
      } else if (header.value) {
        res.setHeader(header.key, header.value)
      }
    }
  }
}

function cors (options, req, res, next) {
  const headers = [],
    method = req.method && req.method.toUpperCase && req.method.toUpperCase()

  if (method === 'OPTIONS') {
    headers.push(configureOrigin(options, req))
    headers.push(configureCredentials(options, req))
    headers.push(configureMethods(options, req))
    headers.push(configureAllowedHeaders(options, req))
    headers.push(configureMaxAge(options, req))
    headers.push(configureExposedHeaders(options, req))
    applyHeaders(headers, res)

    if (options.preflightContinue) {
      next()
    } else {
      res.statusCode = options.optionsSuccessStatus
      res.setHeader('Content-Length', '0')
      res.end()
    }
  } else {
    headers.push(configureOrigin(options, req))
    headers.push(configureCredentials(options, req))
    headers.push(configureExposedHeaders(options, req))
    applyHeaders(headers, res)
    next()
  }
}

function middlewareWrapper (o) {
  let optionsCallback = null
  if (typeof o === 'function') {
    optionsCallback = o
  } else {
    optionsCallback = function (req, cb) {
      cb(null, o)
    }
  }

  return function corsMiddleware (req, res, next) {
    optionsCallback(req, function (err, options) {
      if (err) {
        next(err)
      } else {
        const corsOptions = { ...defaults, ...options }
        let originCallback = null
        if (corsOptions.origin && typeof corsOptions.origin === 'function') {
          originCallback = corsOptions.origin
        } else if (corsOptions.origin) {
          originCallback = function (origin, cb) {
            cb(null, corsOptions.origin)
          }
        }

        if (originCallback) {
          originCallback(req.headers.origin, function (err2, origin) {
            if (err2 || !origin) {
              next(err2)
            } else {
              corsOptions.origin = origin
              cors(corsOptions, req, res, next)
            }
          })
        } else {
          next()
        }
      }
    })
  }
}

module.exports = middlewareWrapper
