const mongoose= require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },

    portraitName:{
        type:String
    },

    portraitStyle:{
        type: String,
        required: true
    },

    portraitSize:{
        type: String,
        require: true
    },

    artWorkStatus:{
        type: String,
        required: true,
        default: 'In progress'
    },

    fullBody:{
        type: Boolean,
        required: true,
        default: false
    },

    price:{
        type: Number,
        required: true,
        default: 0
    },

    imageUrl:{
        type: String,
        required: true,
    },

    imageToDeliver:{
        type: String,
        required: true,
        default: 'no image yet'
    },

    commentsToArtist:{
        type: String,
        required: false,
        default: 'no comments'
    },

    paymentMethod:{
        type: String,
        required: true,
        default: 'card'
    },

    paymentResult:{
        id:{type: String},
        status:{type: String, default:'unpaid'},
        
    },
},{
    timestamps: true
})


const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;