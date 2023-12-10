import mongoose, { mongo } from "mongoose";

// An interface that describes the properties
// that are required to make a New User
interface UserAttributes {
    email: string,
    password: string
}

// An interface that describes the properties
// that an user model has
interface UserModel extends mongoose.Model<any> {
    build(attributes: UserAttributes): any;
}

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});
// we will call this function to make use of typescript interface
userSchema.statics.build = (attributes : UserAttributes) => {
    return new User(attributes);
};

const User = mongoose.model<any, UserModel>('User',userSchema);
export {User };