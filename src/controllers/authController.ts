import { PrismaClient, Role } from "@prisma/client";
import bcrypt from 'bcrypt'
import * as jwt from "jsonwebtoken"
import config from "../config/config";
import {validate} from 'class-validator'

const prisma = new PrismaClient();


function checkIfUnencryptedPasswordIsValid(unencryptedPassword: string,password:string) {
  return bcrypt.compareSync(unencryptedPassword, password)
}

export default {
  async sign(req,res){
    const {username, email, password} = req.body;

    try {
      const saltRounds = 12;
      const encrytedPassword = bcrypt.hashSync(password, saltRounds);

      const signup = await prisma.user.create({
        data:{
          username,
          role:Role.USER,
          email,
          password:encrytedPassword
        }
      });

      return res.status(201).json({user:signup});
    } catch (error) {
      console.log(error);
      return res.status(500).json({error})
    }
  },

  async login(req, res){
    const {username, password} = req.body;

    if(!(username && password)){
      return res.status(400).json({message:'Por favor insira username e palavra-passe válidos,'})
    }

    let user

    try {
      user = await prisma.user.findFirstOrThrow({
        where:{OR:[{email:username}, {username:username}]}
      });

      if(!checkIfUnencryptedPasswordIsValid(password, user.password)){
        return res.status(401).json({message:{error:"Credenciais inválidas. Verifique seu e-mail, nome de usuário ou senha."}})
      }

      const token = jwt.sign(
        {userId:user.id, username:username, role:user.role},
        config.jwtSecret,
        {expiresIn:'8h'}
      );
      return res.status(200).json({token,user:user})

    } catch (error) {
      return res.status(500).json({error})
    }
    
  },

  async changePassword(req,res){
    const {id} = res.locals.jwtPayload.userId;
    const {oldPassword, newPassword} = req.body;

    if(!(oldPassword && newPassword)){
      return res.status(400).json({message:'Insira palavra-passe válida'})
    }

    let user;
    try {
      user = await prisma.user.findUniqueOrThrow({
        where:{id}
      })
    } catch (error) {
      return res.status(401).json({error});
    }

    const error = await validate(user);
    if(error.length > 0){
      return res.status(400).json({error})
    }

    try {
      const saltRounds = 12;
      const encrytedPassword = bcrypt.hashSync(newPassword, saltRounds);
      await prisma.user.update({
        where:{id},
        data:{password:encrytedPassword}
      });

      return res.status(201).json({message:'Palavra-passe actualizada'})
    } catch (error) {
      console.log(error);
    }
  }
}