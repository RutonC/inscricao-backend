import rateLimit from "express-rate-limit";


export const Limit = (limit:number, message:string) =>{

  return rateLimit({
    windowMs:15*60*1000,
    limit: limit,
    standardHeaders:"draft-7",
    message:message
  })
}