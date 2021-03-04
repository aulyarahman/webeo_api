const path = require('path');
const express = require('express');
const http = require('http');
const multer = require('multer');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const errorhandler = require('./middleware/error');
const connectDB = require('./config/db');
const {setSocket} = require('./config/socket');
const helpers = require('./config/helpers');


// load env var
dotenv.config({ path: './config/config.env' });

// connect to db
connectDB();

// Route Files
const user = require('./routes/user');
const auth = require('./routes/auth');
const authAdmin = require('./routes/authAdmin');


const app = express();
const server = http.createServer(app);
setSocket(server)

// body parser
app.use(express.json());

// uploads file
app.use(multer({ storage: helpers.fileStorage, fileFilter: helpers.imageFilter }).single('csv'))

// Dev logging middleware
app.use(morgan('dev'))


// Sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());


// rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 1100
});

app.use(limiter);

// prevent http param polution
app.use(hpp());

// enable cors
app.use(cors());


// mount routers
app.use('/api/v1/users', user);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', authAdmin);

app.use(errorhandler);


const PORT = process.env.PORT || 5000;


server.listen(PORT, console.log(`server running at port ${PORT}`.yellow.bold));

// Handle undhandle rejections
process.on('unhandledRejection', (err, promose) => {
    console.log(`Error: ${err.message}`.red);
    // close server exit procces
    server.close(() => process.exit(1));
})
