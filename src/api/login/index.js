const AWS = require("aws-sdk");
const UUID = require('uuid');
const LOGIN_TABLE_NAME = "ygg-om-login";
const ORDER_TABLE_NAME = "ygg-om-order"
const ALLOWED_ORIGINS = ["http://localhost", "http://localhost:8080", "http://localhost:8081", "http://aws..."]

// Callback is (error, response)
exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event));
    //AWS.config.update({region: 'eu-central-1'});
    var method = event.requestContext.http.method;
    var origin = event.headers.origin;
    var referer = event.headers.referer;
    if(method == "OPTIONS") {
        preFlightResponse(origin, referer, callback);
        return;
    }
    console.log("method="+method);

    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var login = JSON.parse(event.body);
    
    var params = {
      TableName: LOGIN_TABLE_NAME,
      Key: {
        'userName': {S: login.userName}
      },
      //ProjectionExpression: 'ATTRIBUTE_NAME'
    };
    
    ddb.getItem(params, function(err, userData) {
       if (err) { console.log(err); respondError(origin, 500, err, callback); }
       else {
            console.log(JSON.stringify(userData));
            if(userData == null || userData.Item == null || userData.Item.password == null) {
                console.error("User [" + login.userName + "] not found");
                respondError(origin, 401, "Invalid login", callback);
            }
            else {
                if(userData.Item.password.S == login.password) {
                    console.log("Password accepted");
                    updateToken(login, userData.Item.userGuid.S, ddb, function(err, tokenData) {
                        if (err) { console.log(err); respondError(origin, 500, err, callback); }
                        else {
                            getHeroInfo(userData.Item.userGuid.S, function(scoreData) {
                                scoreData.maxTurns = MAX_TURNS;
                                scoreData.accessToken = tokenData.accessToken;
                                scoreData.userGuid = tokenData.userGuid;
                                respondOK(origin, scoreData, callback);
                            });
                        }
                    });
                }
                else {
                    console.error("Wrong password, was [" + login.password + "] exptected [" + userData.Item.password.S + "]");
                    respondError(origin, 401, "Invalid login", callback);
                }
            }
       }
    });
};

function updateToken(login, userGuid, ddb, callback) {
    var newToken = UUID.v4();
    var params = {
        TableName: LOGIN_TABLE_NAME,
        Item: {
          'userName': {S: login.userName},
          'userGuid': {S: userGuid},
          'password': {S: login.password},
          'accessToken': {S: newToken}
        },
        ReturnConsumedCapacity: "TOTAL", 
        //ProjectionExpression: 'ATTRIBUTE_NAME'
    };    
    ddb.putItem(params, function(err, userData) {
        if (err) { console.log(err); callback(err, null); }        
        console.log("New token generated");
        callback(null, { "accessToken": newToken, "userGuid": userGuid });
    });    
}

function getHeroInfo(userGuid, callback) {
    //AWS.config.update({region: 'eu-central-1'});
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
    var params = {
      TableName: ORDER_TABLE_NAME,
      Key: {
        'userGuid': {S: userGuid}
      },
      //ProjectionExpression: 'ATTRIBUTE_NAME'
    };
    
    ddb.getItem(params, function(err, userData) {
       if (err) { console.error(err); throw err; }
       else {
            if(userData == null || userData.Item == null || userData.Item.score == null)
                callback({}); // First round no data yet
            else
                callback(userData.Item);
       }
    });
}

function tweakOrigin(origin) {
    var tweakedOrigin = "-";
    ALLOWED_ORIGINS.forEach(allowedOrigin => {
        if(allowedOrigin == origin) tweakedOrigin = allowedOrigin;
    });
    return tweakedOrigin;
}

function preFlightResponse(origin, referer, callback) {
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' :   tweakOrigin(origin),
            'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HT
            'Access-Control-Allow-Headers' : "content-type"
        },
    };
    callback(null, response);
}

function respondOK(origin, data, callback) {
    const response = {
        statusCode: 200,
        body: JSON.stringify({ response: 'Login completed', data: data }),
        headers: {
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin' : "*", // Required for CORS support to work
            'Access-Control-Allow-Origin' : tweakOrigin(origin),
            'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HT
            'Access-Control-Allow-Headers' : "content-type"
        },
    };
    callback(null, response);
}

function respondError(origin, errorCode, errorMessage, callback) {
    const response = {
        statusCode: errorCode,
        body: JSON.stringify({ response: errorMessage }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : tweakOrigin(origin),
            'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HT
            'Access-Control-Allow-Headers' : "content-type"
        },
    };
    callback(null, response);
}
