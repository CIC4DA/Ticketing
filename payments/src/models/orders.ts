import mongoose, { mongo } from "mongoose";
import { OrderStatus } from "@djticketing7/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to make a New order
interface OrderAttributes {
    id: string;
    version: number;
    userId: string;
    price: number
    status: OrderStatus;
}

// An interface that describes the properties
// that an Order Document has
interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number
    status: OrderStatus;
}

// An interface that describes the properties
// that an order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attributes: OrderAttributes): OrderDoc;
}



const orderSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    price : {
        type : Number,
        required: true
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
orderSchema.set('versionKey','version');
// this is plugin to control updates with version
orderSchema.plugin(updateIfCurrentPlugin);

// we will call this function to make use of typescript interface
orderSchema.statics.build = (attributes : OrderAttributes) => {
    return new Order({
        _id: attributes.id,
        version: attributes.version,
        price: attributes.price,
        userId : attributes.userId,
        status : attributes.status
    });
};

// now we can use User.build() to build a new user;

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema);
export { Order };


// the angle bracket syntax is a generic syntax in typescript
// this gives the all the types we are provinding the function
// Second argument is the type of which the value will be returned
