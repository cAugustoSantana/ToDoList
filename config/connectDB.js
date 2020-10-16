const mongoose = require('mongoose');

class Connection{
    connectOptionsDefault ={
        useUnifiedTopology: true,
        useNewUrlParser :true,
    }
    construtor(collName, schema, connectionString = "mongodb://127.0.0.1:2701/",connectOptions = this.connectOptionsDefault, dbName = 'todoDB'){
        this.connectionString = connectionString;
        this.connectOptions = connectOptions;
        this.dbName = dbName;
        this.collName = collName;
        this.schema = schema

    }
    Connect = async () => {
        try{
            await mongoose.connect(`${this.connectionString}${this.dbName}`,this.connectOptions);
            const Model = await mongoose.model(this.collName, this.schema);
            return Model;
        }
        catch(err){
            return err;
        }
    }
}
module.exports = {Connection}