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
const port = 3604;

// Configuring body parser middleware
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

const whitelist = ["http://localhost:3000","https://delightful-ground-04b5f7f10.azurestaticapps.net","https://movieweb1.wittystone-804c4859.canadacentral.azurecontainerapps.io"]
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

//app.use(cors());

app.get('/order', (req, res) => {
    fetch(`${stateUrl}/order`)
        .then((response) => {
            if (!response.ok) {
                throw "Could not get state.";
            }

            return response.text();
        }).then((orders) => {
            res.send(orders);
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ message: error });
        });
});

app.post('/neworder', (req, res) => {
    //const data = req.body.data;
    //const orderId = data.orderId;
    console.log("Got a new order!: " + req.body);

    const data = req.body;

    console.log("Got a new order! data: " + data);

    const state = [{
        key: "order",
        value: data
    }];
    console.log("Got a new order! state: " + state);
    

    fetch(stateUrl, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
            "Content-Type": "application/json",
            "Acccept": "application/json",
        }
    }).then((response) => {
        if (!response.ok) {
            throw "Failed to persist state.";
        }

        console.log("Successfully persisted state.");
        //res.status(200).send();
        res.status(200).send(JSON.stringify("Successfully Persisted State"));
    }).catch((error) => {
        console.log(error);
        res.status(500).send({ message: error });
    });
});

app.listen(port, () => console.log(`service to publish movies added to the cart to Service bus (listening on port ${port}!) and dapr app is xxx port is ${daprPort}`));