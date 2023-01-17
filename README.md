# node-framework

## Installation
Installation is very simple. Follow the instruction below.

    npm install
    
    npm run tscw
    
    npm run start
    
    npm run startn    //if you have nodemon installed previously
    
## Configuration
Update the database configuration on path __*database/mongoose.js*__

    mongoose.connect('mongodb://localhost:27017/{your_database_name}', {
        useUnifiedTopology : true,
        useNewUrlParser : true,
        useCreateIndex : true
    }).then(conn => {
        console.log('mongo db connection started');
    })
