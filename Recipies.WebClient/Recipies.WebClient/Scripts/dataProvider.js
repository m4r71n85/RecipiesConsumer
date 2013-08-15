/// <reference path="http-requester.js" />
/// <reference path="class.js" />
/// <reference path="q.js" />
/// <reference path="sha1.js" />

var providers = (function () {
    var nickname = localStorage.getItem("nickname");
    var sessionKey = localStorage.getItem("sessionKey");

    function saveSession(userData) {
        localStorage.setItem("nickname", userData.NickName);
        localStorage.setItem("sessionKey", userData.SessionKey);
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
            this.recipie = new RecipieProvider(this.serviceUrl);

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
            var url = this.serviceUrl + "?login=true";
            var userData = {
                UserName: username,
                AuthCode: CryptoJS.SHA1(username,password).toString()
            };

            return httpRequester.postJSON(url, userData).then(function (result) {
                result.NickName = nickname;
                saveSession(result);
                location.reload();
            }, function (error) {
                console.log(error.responseText);
            });
        },
        register: function (username, nickname, password) {
            var url = this.serviceUrl;
            var userData = {
                UserName: username,
                NickName: nickname,
                AuthCode: CryptoJS.SHA1(username, password).toString()
            };
            return httpRequester.postJSON(url, userData).then(function (result) {
                result.NickName = nickname;
                saveSession(result);
                
                location.reload();
            }, function (error) {
                console.log(error.responseText);
            });
        },
        logout: function (success, error) {
            var url = this.serviceUrl + "?sessionKey=" + sessionKey;
            var userData = {
            };
            return httpRequester.postJSON(url, userData).then(function (result) {
                clearSession(result);
            }, function (error) {
                console.log(error.responseText);
            });
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

        getRecipie: function (recipieId) {
            return httpRequester.getJSON(this.serviceUrl + "/" + recipieId);
        },

        allRecipies: function (recipieId) {
            return httpRequester.getJSON(this.serviceUrl);
        }
    });


    return {
        get: function (url) {
            return new BaseProvider(url);
        }
    };
}());