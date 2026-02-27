//https://www.codemag.com/Article/2301041/Mastering-Routing-and-Middleware-in-PHP-Laravel
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const path = require('path');
const dotenv = require('dotenv')
const flash = require('connect-flash');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const helmet = require('helmet');
const {
  ensureAuthenticated,
  ensureGuest,
  ensureStudent,
  ensureLabTech
} = require('./middleware/auth-middleware');

// Load env vars
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// Connect to DB
connectDB();

const app = express();

const viewsPath = path.join(__dirname, '../views');
app.set('views', viewsPath);

// 1. Static files (CSS, JS, Images)
app.use(helmet());
app.use(express.static(path.join(__dirname, '../client')));

// 2. BODY PARSERS (Must be before session-logic/routes)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'dashboard',
  helpers: require('./util/helpers'), // Custom helpers
  layoutsDir: path.join(viewsPath, '../views/layouts'), // Where layouts are
  partialsDir: path.join(viewsPath, '../views/partials') // Where partials are
}));
app.set('view engine', '.hbs');

app.use(session({
  name: 'server.sid', // Custom cookie name
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Don't create session until something is stored
  rolling: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 1,
    autoRemove: 'native'
  }),
  cookie: {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    maxAge: 60000 // Default: 1 day (overridden in login)
  }
}));


//===========================FLASH============================
app.use(flash());

//===========================REMEMBER============================
app.use((req, res, next) => {
  // Only extend if they are logged in AND chose 'Remember Me'
  if (req.session.userId && req.session.rememberMe) {
    req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000;
  }
  next();
});

//===========================LOADUSER============================
app.use(async (req, res, next) => {
  if (req.session.userId) {
    const user = await User.findById(req.session.userId).lean();
    res.locals.user = {
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
  next();
});

//===========================ROUTES============================
app.use('/slots-availability', ensureAuthenticated, require('./routes/slots-routes'));
app.use('/my-reservations', ensureAuthenticated, require('./routes/my-reservations-routes'));
app.use('/search-user', ensureAuthenticated, require('./routes/search-user-routes'));
app.use('/manage-labs', ensureAuthenticated, require('./routes/manage-labs-routes'));
app.use('/my-profile', ensureAuthenticated, require('./routes/my-profile-routes'));
app.use('/', require('./routes/auth-routes'));



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
