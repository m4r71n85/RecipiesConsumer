/// <reference path="http-requester.js" />
/// <reference path="class.js" />
/// <reference path="q.js" />
/// <reference path="sha1.js" />

var providers = (function () {
    var nickname = "pesho"//localStorage.getItem("nickname");
    var sessionKey = "D743981A9002BAB63E0A229E6C7BAF51EEC5AE10";

    function saveSession(userData) {
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("sessionKey", userData.sessionKey);
        nickname = userData.nickname;
        sessionKey = userData.sessionKey;
    }

    function clearSession() {
        localStorage.removeItem("nickname");
        localStorage.removeItem("sessionKey");
        nickname = "";
        sessionKey = "";
    }

    var BaseProvider = Class.create({
        init: function (serviceUrl) {
            this.serviceUrl = serviceUrl;
            this.user = new UserProvider(this.serviceUrl);
            this.game = new RecipieProvider(this.serviceUrl);

        },
        isUserLoggedIn: function () {
            var isLoggedIn = nickname != null && sessionKey != null;
            return isLoggedIn;
        },
        nickname: function () {
            return nickname;
        }
    });
    var UserProvider = Class.create({
        init: function (serviceUrl) {
            this.serviceUrl = serviceUrl + "users";
        },
        login: function (username, password) {
            var url = this.serviceUrl + "login";
            var userData = {
                username: username,
                authCode: CryptoJS.SHA1(password).toString()
            };

            return httpRequester.postJSON(url, userData).then(function (result) {
                saveSession(result);
            }, function (error) {
                console.log(error.responseText);
            });
        },
        register: function (username, nickname, password) {
            var url = this.serviceUrl + "register";
            var userData = {
                username: username,
                nickname: nickname,
                authCode: CryptoJS.SHA1(password).toString()
            };
            return httpRequester.postJSON(url, userData).then(function (result) {
                saveSession(result);
            }, function (error) {
                console.log(error.responseText);
            });
        },
        logout: function (success, error) {
            var url = this.serviceUrl + "logout/" + sessionKey;
            httpRequester.getJSON(url, function (data) {
                clearSession();
                success(data);
            }, error);
        }
    });

    var RecipieProvider = Class.create({
        init: function (serviceUrl) {
            this.serviceUrl = serviceUrl + "recipies";
        },
        create: function (name, description, steps, ImageUrl) {


            var url = this.serviceUrl + "?sessionKey=" + sessionKey;
            var data = {

                Name: name,
                Description: description,
                Steps: steps,
                ImagesFolderUrl: ImageUrl

            };
            return httpRequester.postJSON(url, data);
        },

        getRecipie: function (gameId) {
            return httpRequester.getJSON(this.serviceUrl + "/" + gameId);
        },

        allRecipies: function (gameId) {
            return httpRequester.getJSON(this.serviceUrl);
        }
    });


    return {
        get: function (url) {
            return new BaseProvider(url);
        }
    };
}());