import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default {
  async create(req,res){
    const {name,address, phone, email} = req.body;

    try {
      const createMember = await prisma.participants.create({
        data:{
          name,
          address,
          phoneNumber:phone,
          email
        }
      });

      return res.status(201).json({member:createMember});
    } catch (error) {
      console.log(error);
      return res.status(500).json({error:"Server Error"})
    }
  },
  async listAll(req, res){
    const limit:number = Number(req.params.limit) || 10;
    const page:number = Number(req.params.page) || 1;


    const total = await prisma.participants.count();

    try {
      const getAll =  await prisma.participants.findMany({
        take:limit,
        skip:(page-1)*limit
      });

      return res.status(200).json({
        participants:getAll,
        total,
        pageSize:limit,
        totalPage:Math.ceil(total/limit),
        currentPage:page
      });

    } catch (error) {
      console.log(error);
      return res.status(400).json({error:"Something went wrong with server!"})
    }
  },
  async update(req,res){
    const {id} = req.params;
    const {name,address, phone, email} = req.body;

    try {
      const updateMember = await prisma.participants.update({
        where:{id},
        data:{
          name,
          address,
          phoneNumber:phone,
          email
        }
      });

      return res.status(200).json({member:updateMember});
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:"Error during update department!"})
    }
  },

  async delete(req, res){
    const {id} = req.params;

    try {
      await prisma.participants.delete({
        where:{id}
      });

      return res.status(200).json({sucess:"Member deleted successfully!"});
    } catch (error) {
      console.log(error);
      return res.status(400).json({error:"Error during delete member!"});
    }
  }
}