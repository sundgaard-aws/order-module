var loginView = {};
$(function() {	
    loginView = new LoginView();
    $("#btnShowCreateLogin").click(function() {loginView.drawCreateLoginScreen();});	
	$("#btnCreateLogin").click(function() {loginView.createLogin();});	
    $("#btnLogin").click(function() {loginView.login();});
});

function LoginView() {
    var _this = this;
    var LOGIN_URL = "https://wi03r2ho88.execute-api.eu-north-1.amazonaws.com/ygg-om-login-fn";
    var CREATE_LOGIN_URL = "https://7opcia8fqi.execute-api.eu-north-1.amazonaws.com/ygg-om-create-login-fn";
    var order = new Order();

    this.createLogin = function() {
        var newClientLogin = {userName:$("#newLogin").val(), password:$("#newPassword").val(), passwordRepeated:$("#newRepeatedPassword").val()};
        post(CREATE_LOGIN_URL, newClientLogin, _this.createLoginSuccess, _this.createLoginFailed);
    };
    
    this.createLoginSuccess = function(data) {
        logInfo("create login OK!");
        logInfo(JSON.stringify(data));
        $("#statusMessage").html("");
        _this.drawLoginScreen();
    };
    
    this.createLoginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#statusMessage").html(errorMsg.reason);
    };
    
    this.login = function() {
        var clientLogin = {userName:$("#login").val(), password:$("#password").val()};
        //callMethod("http://" + hostIp + ":" + hostPort, "login", clientLogin, loginSuccess, loginFailed);
        post(LOGIN_URL, clientLogin, loginSuccess, loginFailed);
    };

   
    var loginSuccess = function(serverGameSession) {
        logInfo("login OK!");
        logInfo(JSON.stringify(serverGameSession));
        
        $(".function").hide();
        $(".overlay").hide();
        $("#dashboardContainer").show();
        
        gameSession.publicKey = serverGameSession.publicKey;
    };
    
    var loginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#loginStatus").html(errorMsg.reason);
    };

    this.drawLoginScreen = function() {
        $(".function").hide();
        $(".overlay").hide();
        $("#loginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
    
    this.drawCreateLoginScreen = function() {
        $(".function").hide();
        $(".overlay").hide();
        $("#createLoginContainer").show();
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
}