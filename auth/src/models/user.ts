import mongoose, { mongo } from "mongoose";

// An interface that describes the properties
// that are required to make a New User
interface UserAttributes {
    email: string,
    password: string
}

// An interface that describes the properties
// that an User Document has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

// An interface that describes the properties
// that an user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttributes): UserDoc;
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

// now we can use User.build() to build a new user;

const User = mongoose.model<UserDoc, UserModel>('User',userSchema);
export { User };


// the angle bracket syntax is a generic syntax in typescript
// this gives the all the types we are provinding the function
// Second argument is the type of which the value will be returned
