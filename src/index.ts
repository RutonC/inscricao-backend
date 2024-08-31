import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import routes from './routes'

const app = express();
const port = process.env.PORT || 3333;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(helmet({crossOriginResourcePolicy:false}));
app.use(routes);



app.listen(()=>{
  console.log("Http server running")
})