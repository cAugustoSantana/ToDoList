const {Schema} = require ('mongoose');

class Item {
    constructor(Id,Description,State,dueDate,Version){
        this._id = Id;
        this.Description = Description;
        this.State = State;
        this.dueDate = dueDate;
        this.Version = Version;
    }
}
const itemSchema = new Schema({
    _id : {
        type : 'string',
    },
    Description: {
        type: 'string',
        required: [true, 'Description is required field']
    },
    State : {
        type: 'string',
        enum: ['Pending', 'Complete'],
        default: 'Pending'
    },
    dueDate: {
        type: 'Date',
        required : [true,'Date is a required field']

    },
    Version: {
        type : 'Number'
    }

})

module.exports = {Item,itemSchema};