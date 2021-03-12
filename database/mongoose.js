const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/livequiz', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useCreateIndex : true
}).then(conn => {
    console.log('mongo db connection started');
})