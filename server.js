require('dotenv').config({path:'./.env'});



const express = require("express");
const app = express();
const cors = require("cors");
const DataBase = require("./config/DbConnect.js");
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 5000;

// Middleware Plugins Start

app.use(express.json({limit: '20kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.static('uploads'));
app.use(cookieParser({}))

// Middleware Plugins End

// Routers Start

const QuoteRouter = require("./routes/QuoteRouter");
const TestimonialRouter = require("./routes/TestimonialRoutes");
const FAQRouter = require("./routes/FAQRouter");
const UserRouter = require('./routes/UserRouter.js');
const registerUserRoutes = require('./routes/RegisterUserRoutes.js');
const CategoryRouter = require("./routes/CategoryRouter");
const SubCategoryRouter = require("./routes/SubCategoryRouter");
const CatalogRouter = require("./routes/CatalogRouter");
const SpecificationRouter = require("./routes/SpecificationRouter")
const AdminContactRouter = require('./routes/AdminContactRoute');
const DownloadRouter = require('./routes/DownloadRouter');
const NewRFQRouter = require('./routes/NewRFQRouter');
const AuthRouter = require("./routes/AuthRouter.js");
const BRFQRouter = require("./routes/BRFQRouter.js");
const AssignBRFQRouter = require("./routes/AssignedBRFQRouter.js");
const VRFQRouter = require("./routes/VRFQRouter.js");
const OrderRouter = require("./routes/OrderRouter.js")

// Routers End

// DB Connection Started

DataBase()

//DB Connection End




// Route Middleware Start

app.use('/api/quote', QuoteRouter);
app.use("/api/testimonial", TestimonialRouter);
app.use('/api/faq', FAQRouter);
app.use('/api/user', UserRouter);
app.use('/api/register', registerUserRoutes)
app.use("/api/category", CategoryRouter);
app.use("/api/sub-category", SubCategoryRouter);
app.use("/api/catalog", CatalogRouter);
app.use("/api/specification", SpecificationRouter);
app.use("/api/admin-contact", AdminContactRouter);
app.use("/api/download", DownloadRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/new-rfq", NewRFQRouter);
app.use("/api/brfq", BRFQRouter);
app.use("/api/assigned", AssignBRFQRouter);
app.use("/api/vrfq", VRFQRouter);
app.use("/api/order", OrderRouter)


// Buyer Admin panel route



// Route Middleware End

app.use("/", (req, res)=>{
    res.end('bildkart server started');
});

// Route Middleware End


// Port Listen Start

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
