const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/node-auction', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useCreateIndex : true
}).then(conn => {
    console.log('mongo db connection started');
})