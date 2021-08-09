$(document).ready(function(){
    document.getElementById("submit").addEventListener("click", function (e) {
        e.preventDefault();
        let logForm = document.forms["regForm"];
        let login = logForm.elements["login"].value;
        let password = logForm.elements["password"].value;
        let dataToSend = JSON.stringify({
            login: login,
            password: password
        });
        let req = new XMLHttpRequest();
        req.open("POST", "/signin", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(dataToSend);
    });
});