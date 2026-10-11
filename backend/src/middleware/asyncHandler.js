// ---------------------------------------------------------------------------
// asyncHandler — forward rejected promises to Express' error handler.
// ---------------------------------------------------------------------------
// Express 4 does not catch rejections from async route handlers; without this
// wrapper a failed query would hang the request instead of returning a 500.
// ---------------------------------------------------------------------------

export function asyncHandler(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

export default asyncHandler
