const mongoose = require('mongoose');
const tshirtf = require('./tshirt');
const imgf = require('./img');
const Tshirt = require('../models/tshirt');



mongoose.connect('mongodb://0.0.0.0:27017/tee-rex',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const tshirtDB = async () => {
    await Tshirt.deleteMany({});

    for( let i=0; i< 40; i++)
    {
        const random6 = Math.floor(Math.random() * 6);
        const random62 = Math.floor(Math.random() * 6);

        const tshirt = new Tshirt({
            author : '6311e271123af3168cdad385',
            title : `${tshirtf[i].Title}`,
            discount : `${tshirtf[i].Discount}`,
            sprice : `${tshirtf[i].sprice}`,
            price : `${tshirtf[i].Price}`,
            colour : `${tshirtf[i].colour}`,
            material : `${tshirtf[i].material}`,
            status : '1' ,
            description : `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro, laudantium earum vero quos officia qui doloremque, nobis accusamus distinctio possimus asperiores consectetur perferendis nisi? Fuga tempora architecto perspiciatis sapiente incidunt quod quo voluptatum! Vitae illum repellendus accusamus aliquid eius eveniet modi nam doloremque incidunt iure neque aspernatur eligendi veritatis ad reiciendis praesentium quas necessitatibus numquam pariatur dolorum, sed provident! Odit laudantium sequi accusantium nihil quia mollitia debitis quis odio adipisci, praesentium dolorum aliquam maxime ut repellendus reiciendis aperiam eligendi, ad quibusdam. Nam quam, eligendi ea fugit neque ratione, error similique hic laboriosam omnis ab animi, dolorem commodi optio dicta non.`,
            images : [
                { url : `${imgf[random6].url}`,
                filename : `${imgf[random6].filename}`    
                },
                { url : `${imgf[random62].url}`,
                filename : `${imgf[random62].filename}`    
                }
            ]
                })
            
        await tshirt.save();
    }
}

tshirtDB().then(()=> {
    mongoose.connection.close();
})