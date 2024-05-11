import Joi, { date } from 'joi';
import Controller from '../interfaces/controller.interface';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import { logServerRequest } from '../middlewares/logServerRequest';
import { Request, Response, NextFunction, Router } from 'express';
import DataService from '../modules/services/data.service';
import { Types } from 'mongoose';
import { request } from 'http';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class PostController implements Controller {
   public path = '/api/post';
   public router = Router();
   public dataService = new DataService();

   constructor() {
       this.initializeRoutes();
   }

   private initializeRoutes() {
       this.router.get(`/api/posts`, this.getAll);
       this.router.post(`${this.path}`, this.addData);
       this.router.delete(`/api/posts`, this.deleteAll);
       this.router.get(`${this.path}/:id`, this.getById);
       //this.router.post(`${this.path}/:num`, this.postNum);
       this.router.delete(`${this.path}/:id`, this.deleteById);
       //this.router.post(`${this.path}/:num`, checkPostCount, this.postNum);
       this.router.post(`${this.path}/gpostall`, this.showAllData);
       this.router.post(`${this.path}/gpost`, logServerRequest, this.addData2);
       this.router.post(`${this.path}/vpost`, logServerRequest, this.addData3);
       this.router.post(`${this.path}/gpost/id`, this.getElementById);
       this.router.post(`${this.path}/gdelate/id`, this.removePost);
       this.router.post(`${this.path}/gdelateall`, this.removeAllPosts);
   }

   private addData3 = async (request: Request, response: Response, next: NextFunction)=>{
        const{title, text, image} = request.body;

        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required(),
        });

        try{
            const validateData = await schema.validateAsync({title, text, image});
            await this.dataService.createPost(validateData);
            response.status(200).json(validateData);
        }catch(error){
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Invalid input data'});
        }
   }

   private addData2 = async (request: Request, response: Response, next: NextFunction) => {
    const {title, text, image} = request.body;

    const readingData = {
        title,
        text,
        image
    };

    try {
        await this.dataService.createPost(readingData);
        response.status(200).json(readingData);
    } catch (error) {
        console.log('eeee', error)

        console.error(`Validation Error: ${error.message}`);
        response.status(400).json({error: 'Invalid input data.'});
    }
}

private showAllData = async (request: Request, response: Response, next: NextFunction) => {
    
    try {
        const result = await this.dataService.findAll();
        response.status(200).json(result);
    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error);
        response.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych' });
    }
}

private getElementById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.body;
    try {
        //const allData = await this.dataService.query({ _id: id });
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error);
        response.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych' });
    }
}

private removePost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.body;
    await this.dataService.deleteData({_id:id});
    response.sendStatus(200);
};

private removeAllPosts = async (request: Request, response: Response, next: NextFunction) => {
    try{
    const { id } = request.params;
    await this.dataService.deleteAllData();
    response.sendStatus(200);
} catch (error) {
    console.error('Wystąpił błąd podczas usuwania danych:', error);
    response.status(500).json({ error: 'Wystąpił błąd podczas usuwania danych' });
}
};

   
 
   private getAll = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body;
 
    response.status(200).json(testArr);

    };

   private addData = async(request:Request, response:Response,next:NextFunction)=>{
    const {elem} = request.body;
    const {id} = request.params;

    testArr.push(elem);

    response.status(200).json(testArr);

    next();

   }

   private deleteAll = async(request:Request, response:Response,next:NextFunction)=>{
    const {elem} = request.body;
    const {id} = request.params;

    testArr.length=0;

    response.status(200).json(testArr);

    next();

   }

   private getById = async(request:Request, response:Response,next:NextFunction)=>{
    const {elem} = request.body;
    const {id} = request.params;

   

    response.status(200).json(testArr[Number(elem)]);

    next();

   }

   private deleteById = async(request:Request, response:Response,next:NextFunction)=>{
    const {elem} = request.body;
    const {id} = request.params;

    testArr.splice(Number(elem),1);

    response.status(200).json(testArr);

    next();

   }

   private postNum = async(request:Request, response:Response,next:NextFunction)=>{
    const {elem} = request.body;
    const {num} = request.params;

    

    response.status(200).json(testArr.slice(0,Number(num)));

    next();

   }
    
}

export default PostController;