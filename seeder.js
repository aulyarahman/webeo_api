const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


// load env bar
dotenv.config({ path: './config/config.env' })


// load models
const User = require('./models/User');



// connect to DB
mongoose.connect(`${process.env.MONGO_URI}/app-eo`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// read JSON files
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));



// Import into db
const importData =  async () => {
    try {
        await User.create(users);

        console.log('Data imported'.green.inverse)
        process.exit();
    } catch (err) {
        console.error(err);
    }
}


// Delete data
const deleteData =  async () => {
    try {
        await User.deleteMany();

        console.log('Data destroy'.red.inverse)
        process.exit();
    } catch (err) {
        console.error(err);
    }
}


if(process.argv[2] === '-i') {
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}