import mongoose, { mongo } from "mongoose";
import { OrderStatus } from "@djticketing7/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to make a New order
interface PaymentAttributes {
    orderId: string;
    stripeId: string;
}

// An interface that describes the properties
// that an Order Document has
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
    version: number;
}

// An interface that describes the properties
// that an order model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attributes: PaymentAttributes): PaymentDoc;
}


const paymentSchema = new mongoose.Schema({
    orderId : {
        type : String,
        required : true
    },
    stripeId: {
        type : String,
        required : true
    }
}, {
    // all this here helps to edit the output data of user we will get from mongoDB
    // it is not the best approach and not used in model here
    // but we are using
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id;
            
            delete ret._id;
            delete ret.__v;
        }
    }
});

// this is to set the version as a field
paymentSchema.set('versionKey','version');
// this is plugin to control updates with version
paymentSchema.plugin(updateIfCurrentPlugin);

// we will call this function to make use of typescript interface
paymentSchema.statics.build = (attributes : PaymentAttributes) => {
    return new Payment(attributes);
};

// now we can use User.build() to build a new user;

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment',paymentSchema);
export { Payment };


// the angle bracket syntax is a generic syntax in typescript
// this gives the all the types we are provinding the function
// Second argument is the type of which the value will be returned
