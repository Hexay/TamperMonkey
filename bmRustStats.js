// ==Rust Hour Summary==
// @name         Rust Hour Summary
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Find all the information about your enemies!
// @author       Hexay
// @match        https://www.battlemetrics.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=battlemetrics.com
// @grant        none
// ==/UserScript==

(function() {
    function getData(id) {
    var top = [];
    var hours= 0;
    var URL = "https://api.battlemetrics.com/players/" + id +"?include=server&fields[server]=name";
    fetch("https://api.battlemetrics.com/players/"+id+"?include=server&fields[server]=name", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7,hr;q=0.6,ga;q=0.5",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://www.battlemetrics.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    })
        .then(response => response.json())
        .then(json => manage(json))
    }

    function manage(data) {
        var servers = [];
        var hours = 0;
        var timePlayed = 0;
        for (var key in data["included"]) {
            if (data["included"][key]["relationships"]["game"]["data"]["id"] == "rust") {
                timePlayed = data["included"][key]["meta"]["timePlayed"]/3600;
                hours += timePlayed;
                servers.push({0:data["included"][key]["attributes"]["name"], 1:timePlayed});
            }
        }
        var msg = "Total of "+hours.toFixed(2).toString()+" hours<br>";
        servers = sort(servers);
        for (var i=servers.length-1; i > servers.length-6; i = i - 1) {
            msg = msg + servers[i][0] + " " + servers[i][1].toFixed(2).toString() + "<br>";
        }
        console.log(servers)
        document.getElementsByClassName("col-md-4")[2].remove();
        document.getElementsByClassName("css-1217rdu")[0].innerText = "Player Stats:";
        var statsClass = document.getElementsByClassName("collapse in")[0];
        statsClass.innerHTML = msg;
        statsClass.style.fontSize = "20px";
        statsClass.style.width = "720px";
        statsClass.style.height = "250px";
    }

    function sort(servers) {
        if (servers.length <= 1) {
            return servers;
        }
        let x = servers.pop();
        let low = [];
        let high = [];
        for (var i = 0; i < servers.length; i++) {
            if (servers[i][1] > x[1]) {
                high.push(servers[i])
            }
            else {
                low.push(servers[i])
            }
        }
        let a = []
        return a.concat(sort(low), x, sort(high));
    }



    let userID = document.URL.split("/")[4].split("?")[0];
    getData(userID);

    var arr = []

    document.addEventListener('mousemove', function () {
        if (document.URL.includes("https://www.battlemetrics.com/players/")) {
            let userID = document.URL.split("/")[4].split("?")[0];
            if (!arr.includes(userID)) {
                getData(userID);
                arr.push(userID);
            }
        }
    });

    document.addEventListener("click", function () {
        arr = []
        if (document.URL.includes("https://www.battlemetrics.com/players/")) {
            let userID = document.URL.split("/")[4].split("?")[0];
            if (!arr.includes(userID)) {
                getData(userID);
                arr.push(userID);
            }
        }

    });

})();
