const mongoose= require('mongoose');

const Schema = mongoose.Schema;

const PorteaitSchema = Schema({
    portraitStyle:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true,
    },

    price:{
        type: Number,
        required: true
    },

    user:{
    type: mongoose.Schema.Types.ObjectId,
    require: false,
    ref:'User'
    }
 
},{
    timestamps: true
})


const Porteait = mongoose.model('Porteait', PorteaitSchema);

module.exports = Porteait;