import Koa from 'koa'
const app = new Koa()

// x-response-time
app.use(async (ctx, next) => {
  const start = new Date
  await next()
  const ms = new Date - start
  ctx.set('X-Response-Time', `ms ${ms}`)

})

// logger
app.use(async (ctx, next) => {
  const start = new Date
  await next()
  const ms = new Date - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

app.use(async (ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000, () => console.log('server started 3000'))

export default app
