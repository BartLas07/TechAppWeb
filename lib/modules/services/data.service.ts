import { title } from "process";
import { IData, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';
import { ObjectId } from "mongoose";

class DataService {

   public async createPost(postParams: IData) {
       try {
           const dataModel = new PostModel(postParams);
           await dataModel.save();
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async findAll() {
    try {
       const result =  await PostModel.find();
       return result;
    } catch (error) {
        console.error('Wystąpił błąd podczas tworzenia danych:', error);
        throw new Error('Wystąpił błąd podczas tworzenia danych');
    }
}

   public async query(id: ObjectId) {
       try {
           //const result = await PostModel.find(query, { __v: 0, _id: 0 });
           const result = await PostModel.find({_id:id});
           return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }
 
    public async deleteData(query: { _id: ObjectId }) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async deleteAllData() {
        try {
            await PostModel.deleteMany({});
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }
 
    
 }
 
 export default DataService;
 