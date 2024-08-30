import {Request, Response} from 'express'
import {format} from 'date-fns'


export default {
  getWelcomeMessage(req:Request,res:Response){
    return res.json({message:"Subscription is working!,", currentTime:format(new Date(), "dd/MM/yyyy HH:mm:SS")});
  },
};