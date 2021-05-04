const mongoose= require('mongoose');

const Schema = mongoose.Schema;

const PreviousWorktSchema = Schema({
    name:{
        type: String,
        required: true
    },

    category:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        
    },

    imageUrl:{
        require: true,
        type:String
    },

    madeBy:{
        type: String,
        required: true
    },

 
},{
    timestamps: true
})


const PreviousWork = mongoose.model('PreviousWork', PreviousWorktSchema);

module.exports = PreviousWork;