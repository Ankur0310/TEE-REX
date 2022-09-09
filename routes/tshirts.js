const express = require('express');
const router = express.Router();
const Joi = require('joi');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const flash = require('connect-flash');
const Tshirt = require('../models/tshirt');
const Order = require('../models/order');
const User = require('../models/user');
const Successpay = require('../models/successpay');

var multer = require('multer');
const { storage } = require('../cloudinary');
var upload = multer({storage});
const razorpay = require('razorpay');
const crypto = require("crypto");
const hmac = crypto.createHmac('sha256', '3UjwcuosRCcCmkw8ckWigoK1' );
const {isLoggedIn , isAuthor, validatetshirt} = require('../middleware');




let instance = new razorpay({
    key_id : 'rzp_test_FR4vLNWM4fcblG',
    key_secret : '3UjwcuosRCcCmkw8ckWigoK1'
});


router.get('/', catchAsync( async (req, res) => {
    const tshirts = await Tshirt.find({});
    res.render('tshirt/index' , {tshirts} );
}));

router.get('/new', isLoggedIn,  (req, res) => {
    res.render('tshirt/new');
})

router.get('/about',  (req, res) => {
    res.render('tshirt/about');
})


router.post('/', isLoggedIn, upload.array('image'), validatetshirt ,catchAsync( async(req, res) => {
    const tshirt = new Tshirt(req.body.tshirt);
    tshirt.author = req.user._id;
    tshirt.images = req.files.map( f => ({ url: f.path, filename: f.filename }));
    await tshirt.save();
    console.log(tshirt);
    req.flash('success', 'Successfully a new Tshirt Design');
    res.redirect(`tshirts/${tshirt._id}`);
}));

router.get('/orderp', isLoggedIn, catchAsync(async (req, res ) => {
    const authdid = req.user._id;
    const user = await User.findById(authdid);
    const orders = await Successpay.find({name : user.username});
    res.render('tshirt/orderp', {orders});
}))

router.get('/admin/orders', isLoggedIn, catchAsync(async (req, res )=> {
    const orders = await Successpay.find();
    res.render('tshirt/allorders', {orders});
}))

router.get('/:id', catchAsync( async (req, res) => {
    const tshirt = await Tshirt.findById(req.params.id);
    if(!tshirt) {
        req.flash('error', 'Cannot find that Tshirt');
        res.redirect('/tshirts');
    }
    res.render('tshirt/show' , {tshirt});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const tshirt = await Tshirt.findById(req.params.id);
    if(!tshirt) {
        req.flash('error', 'Cannot find that Tshirt');
        res.redirect('/tshirts');
    }
    res.render('tshirt/edit' , {tshirt});
}));

router.post('/:id/api/payment/order', isLoggedIn, catchAsync( async (req, res) => {
    const {id } = req.params;
    const authdid = req.user._id;
    const tshirt = await Tshirt.findById(req.params.id);
    const order =  new Order(req.body.order);
    order.product = tshirt.title;
    order.img_url = tshirt.images[0].url;
    order.productid = id;
    order.buyerid = authdid;
    order.size = req.body.size;
    order.price = tshirt.sprice;
    order.quantity = req.body.quantity;
    const user = await User.findById(authdid);
    order.name = user.username;
    order.email = user.email;
    order.totalprice = order.quantity * order.price;
    const money = order.totalprice * 100;
    await order.save();
    console.log(order);
    const order1 = await Order.findOne({productid : id});
    // console.log(order1); 
    var options = {   
        amount : money,
        currency : 'INR'
    };
    instance.orders.create( options, function(err, order) {
        if(err) {
            console.log(err);
        } else {
            console.log(order);
            console.log(order.id);
            req.flash('success', 'Successfully Order is Created');
            res.render(`tshirt/details`, { tshirt , order1, amount: order.amount , order_id: order.id})
        }
    }) 
}));


router.post('/:id/api/payment/checkout/success', isLoggedIn, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const authdid = req.user._id;
    const user = await User.findById(authdid);
    const tshirt = await Tshirt.findById(req.params.id);
    const order1 = await Order.findOne({productid : id});
    const successpay = new Successpay(req.body);
    successpay.title = tshirt.title;
    successpay.buyerid = authdid;
    successpay.price = tshirt.sprice;
    successpay.name = user.username;
    successpay.email = user.email;
    successpay.img_url = tshirt.images[0].url;
    successpay.quantity = order1.quantity;
    successpay.totalprice = order1.totalprice;
    successpay.size = order1.size;
    await successpay.save();
    console.log(successpay);

    // verification of signature need to be done;
//     hmac.update(successpay.razorpay_order_id + "|" + successpay.razorpay_payment_id);
//     let generated_signature = hmac.digest('hex');

//   if (generated_signature == successpay.razorpay_signature) {
//     res.render('tshirt/success');
//   }
//   else
//   {
//     res.send('error');
//   }

req.flash('success', 'Successfully Payment is done :)');
res.redirect('/tshirts/orderp');
    
}));



router.put('/:id', isLoggedIn,isAuthor, upload.array('image'), catchAsync(async (req, res) => {
    const {id} = req.params;
    const tshirt = await Tshirt.findByIdAndUpdate(id, {...req.body.tshirt});
    const imgs = req.files.map( f => ({ url: f.path, filename: f.filename }));
    tshirt.images.push(...imgs);
    await tshirt.save();
    req.flash('success', 'Successfully updated this Tshirt Design');
    res.redirect(`/tshirts/${tshirt._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor,  catchAsync(async(req, res) => {
    const {id} = req.params;
    await Tshirt.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted that Tshirt Design');
    res.redirect('/tshirts');
}));



module.exports = router;