var order = {};
$(function() {	
    order = new Order();
    $("#btnCreateOrder").click(function() {order.createOrder();});	
	$("#btnStoreOrder").click(function() {order.createLogin();});	
});

function Order() {
    var _this = this;
    var GET_ORDER_URL = "https://7671meno1e.execute-api.eu-north-1.amazonaws.com/ygg-om-get-order-fn-api";
    var STORE_ORDER_URL = "https://7y5e9pbk30.execute-api.eu-north-1.amazonaws.com/ygg-om-store-order-fn-api";

    this.createOrder = function() {
        var orderDTO = {orderId: 100, orderItems: []};
        post(STORE_ORDER_URL, newClientLogin, _this.createOrderSuccess, _this.createOrderFailed);
    };
    
    this.createOrderSuccess = function(data) {
        logInfo("create login OK!");
        logInfo(JSON.stringify(data));
        $("#statusMessage").html("");
    };
    
    this.createOrderFailed = function(errorMsg) {
        logInfo(errorMsg);
    };    

    this.storeOrder = function() {
        var orderDTO = {orderId: 100, orderItems: []};
        post(STORE_ORDER_URL, newClientLogin, _this.storeOrderSuccess, _this.storeOrderFailed);
    };
    
    this.storeOrderSuccess = function(data) {
        logInfo("create login OK!");
        logInfo(JSON.stringify(data));
        $("#statusMessage").html("");
    };
    
    this.storeOrderFailed = function(errorMsg) {
        logInfo(errorMsg);
    };
    
}