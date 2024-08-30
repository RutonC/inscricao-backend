import { PrismaClient, Role } from "@prisma/client";
import bcrypt from 'bcrypt'
import {z} from "zod"

const prisma = new PrismaClient();

export const createEventUserSchema = z.object({
  name:z.string(),
  email:z.string(),
  role:z.string(),
  username:z.string().min(6),
  password:z.string().min(6)
})



export default {
  async create(req,res){
    const data = createEventUserSchema.parse(req.body);
    try {
      const saltRounds = 12;
      const encrytedPassword = bcrypt.hashSync(data.password,saltRounds);
     const createUser = await prisma.user.create({
      data:{
        username:data.name,
        email: data.email,
        password:encrytedPassword,
        role:Role.USER
      }
     });

     return res.status(201).json({
      user:createUser
     });

    } catch (error) {
      console.log(error)
      return res.status(500).json({error:"Error Server!"})
    }
  },
  async listAll (req,res){   
    const limit: number = Number(req.query.limit) || 10;
    const page:number = Number(req.query.page) || 1;

    const total = await prisma.user.count();
    try {
      const getAll =  await prisma.user.findMany({
        take:limit,
        skip:(page-1)*limit
      });
      return res.status(200).json({
        users:getAll,
        total,
        pageSize:limit,
        totalPage: Math.ceil(total/limit),
        currentPage: page
      }); 
    } catch (error) {
      console.log(error);
    }
  },
  async update(req,res){
    const {username, password} = createEventUserSchema.parse(req.body);
    const {id} = req.params;
    
    try {
      const updateUser = await prisma.user.update({
        where:{id},
        data:{
          username,
          password
        }
      });

      return res.status(200).json({
        user:updateUser
      })
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:"Failed to update user!"})
    }

  },
  async delete(req,res){
    const {id} = req.params;

    try {
      await prisma.user.delete({
        where:{id}
      });

      return res.status(200).json("User deleted successfully!")
    } catch (error) {
      console.log(error); 
      return res.status(400).json({error:"Failed to delete user!"})
    }
  }
}