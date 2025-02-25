import { j } from "./jstack"
import { userRouter } from "./routers/user-router"
import { loanRouter } from "./routers/loan-router"
import { chatRouter } from "./routers/chat-router"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 */
const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler)

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = api
  .route("/chat", chatRouter)
  .route("/user", userRouter)
  .route("/loan", loanRouter)

export type AppRouter = typeof appRouter
export default appRouter
