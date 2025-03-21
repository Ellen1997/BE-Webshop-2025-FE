const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dbTestRoute = require("./routes/dbTest.js");
const path = require("path");
const mongoproducts = require("../mongoproducts.js");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5500;

app.use(express.json());

mongoose.connect("mongodb+srv://ellenholmgren:Y71UhxXQpLUTf15J@expresscrash.vbreq.mongodb.net/?retryWrites=true&w=majority&appName=expresscrash")
.then(() => {
    console.log("connected to MongoDB ATLAS");
    app.listen(PORT, () => {
        console.log(`Servern är uppe och körs på http://localhost:${PORT}`)
    });
})
.catch ((e) => 
    console.error("MongoDB atlas connection error:", e)
);

// run()
async function run() {

    try {
        const mongoproduct1 = await mongoproducts.create({

            _id: 4,
            name: "Ananas",
            price: 19.99,
            description: "En god exotisk frukt",
            stock: 100,

        })
        console.log(mongoproduct1)
    } catch (error) {
        console.log(error.message)
    }
}

app.post('/products', async (req, res) => {
    try {
        const {name, price, description, stock} = req.body;

        const newProduct = new mongoproducts({
            name, 
            price, 
            description,
            stock,
        });

        await newProduct.save();
        res.status(201).send({ message: "Produkt skapad", product: newProduct });


    } catch (error) {
        res.status(500).send({ message: "Något gick fel, produkt ej inlagd", error: error.message});
    }
})

app.get('/products', async (req, res) => {
    try {
       
        const products = await mongoproducts.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ message: "Något gick fel", error: error.message });
    }
});

app.use("/test-db", dbTestRoute);

app.use(express.static(path.resolve(__dirname, '..')));


app.get("/hej", (req, res) => {
    res.send("express servern/MongoDB är uppe")
});

app.get('/hem', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});




