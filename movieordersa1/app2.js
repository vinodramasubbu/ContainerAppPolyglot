const express = require('express');
const bodyParser = require('body-parser');
require('isomorphic-fetch');
const cors = require('cors')

const app = express();
app.use(bodyParser.json());

// These ports are injected automatically into the container.
const daprPort = 3500;

const stateStoreName = `statestore`;
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
const pubsubUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
const port = 3000;

// Configuring body parser middleware
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

const whitelist = ["http://localhost:3000", "https://delightful-ground-04b5f7f10.azurestaticapps.net", "https://movieweb1.wittystone-804c4859.canadacentral.azurecontainerapps.io"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))


app.post('/neworder', (req, res) => {
    //const data = req.body.data;
    //const orderId = data.orderId;
    console.log("Got a new order!: " + JSON.stringify(req.body.data));

    const data = JSON.stringify(req.body.data);

    console.log("Got a new order! data: " + JSON.parse(data));

    const state = [{
        key: "order",
        value: data
    }];
    console.log("Got a new order! state: " + state);

    res.send(JSON.stringify(req.body.data))

});

app.listen(port, () => console.log(`service to publish movies added to the cart to Service bus (listening on port ${port}!) and dapr app is xxx port is ${daprPort}`));