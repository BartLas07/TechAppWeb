import { Schema, model } from 'mongoose';
import { IData } from "../models/data.model";
import { number, required } from 'joi';



export const PostModel: Schema = new Schema({
   title: { type: String, required: true },
   text: { type: String, required: true },
   image: { type: String, required: true },
});




export default model<IData>('Post-BLZ', PostModel);