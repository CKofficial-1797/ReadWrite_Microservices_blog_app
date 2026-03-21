import mongoose ,{Document, Schema}  from 'mongoose';

export interface IUser extends Document{
      name: string;
        email: string;
       image: string;
       instagram: string;   
       facebook: string;
       linkedin: string;
       bio: string; 
}
 const schema: Schema<IUser> = new Schema({
    name: { 
        type: String,
        required: true
    },      
    email: { 
        type: String,
        required: true,
        unique: true
    },
    image:
    { 
        type: String,
        required: true
    },  
    instagram: { 
        type: String,
        // required: true
    },
    facebook: { 
        type: String,
        // required: true
    },
    linkedin: { 
        type: String,
        // required: true
    },
    bio: { 
        type: String,
        // required: true
    },
    },
    {
        timestamps: true
    }
);
const User = mongoose.model<IUser>('User', schema);
export default User;
