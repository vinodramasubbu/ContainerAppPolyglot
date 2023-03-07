const express = require('express');
const bodyParser = require('body-parser');
require('isomorphic-fetch');
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(bodyParser.json());
const { ServiceBusClient } = require("@azure/service-bus");

// connection string to your Service Bus namespace
const connectionString = "Endpoint=sb://xxxxxxxx.servicebus.windows.net/;SharedAccessKeyName=orders;SharedAccessKey=xxxxxxxx;EntityPath=orders"

// name of the queue
const queueName = "orders"

// create a Service Bus client using the connection string to the Service Bus namespace
const sbClient = new ServiceBusClient(connectionString);

// createSender() can also be used to create a sender for a topic.
const sender = sbClient.createSender(queueName);

// These ports are injected automatically into the container.
const daprPort = 3500; 

const stateStoreName = `statestore`;
//onst pubsubName = `servicebusqueue`;
//const pubsubqueueName = `orders`;
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
//const pubsubUrl = `http://localhost:${daprPort}/v1.0/publish/${pubsubName}/${pubsubqueueName}`;

//const pubsubUrl = `http://localhost:${daprPort}/v1.0/bindings/statestore`;

const port = 3605;

// Configuring body parser middleware
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
const appInsights = require("applicationinsights");
appInsights.setup("InstrumentationKey=xxxxx-xxxx-xxxx-9f52-xxxxx;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/").start();
//appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'MovieOrders';
//appInsights.setup("6ebe604b-77f3-4ce1-9f52-3fc569da2146")
//    .setAutoDependencyCorrelation(true)
//    .setAutoCollectRequests(true)
//    .setAutoCollectPerformance(true, true)
//    .setAutoCollectExceptions(true)
//    .setAutoCollectDependencies(true)
//    .setAutoCollectConsole(true)
//    .setUseDiskRetryCaching(true)
//    .setSendLiveMetrics(false)
//    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
//    .start();

const whitelist = ["http://localhost:3000", "https://delightful-ground-04b5f7f10.azurestaticapps.net", "https://moviewebreactjsapp.ashystone-08e1cbf2.eastus.azurecontainerapps.io"]
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
//app.use(cors(corsOptions))

//app.use(cors());

app.use(cors({
    origin: '*'
}));

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
/*
app.post('/sendtostorageacc', (req, res) => {
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
*/
app.post('/neworder', (req, res) => {
    //const data = req.body.data;
    //const orderId = data.orderId;
    console.log("Got a new order!: " + JSON.stringify(req.body.data));

    const data = req.body;

    console.log("Got a new order! data: " + data);

    //const state = [{
    //    key: "order",
    //    value: data
    //}];
    const state = [{
        key: uuidv4(),
        value: data
    }];

    const payload = {
        "data": {
            "message": data
            },
            "metadata": {
                "ttlInSeconds": "60"
            },
            "operation": "create"
    }
    const payload1 = {
        "data": {
            "message": data
        },
        "operation": "create"
    }
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
            throw "Failed to send data to Storage Account.";
        }

        res.status(200).send(JSON.stringify("Successfully sent data to Storage Account."));
    }).catch((error) => {
        console.log(error);
        res.status(500).send({ message: error });
    });

    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(connectionString);

    // createSender() can also be used to create a sender for a topic.
    const sender = sbClient.createSender(queueName);


    // Send the last created batch of messages to the queue
    sender.sendMessages({ body: data });


});

app.listen(port, () => console.log(`service to publish movies added to the cart to Service bus (listening on port ${port}!) and dapr app is xxx port is ${daprPort}`));