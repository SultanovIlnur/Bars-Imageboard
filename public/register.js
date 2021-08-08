document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();
    let regForm = document.forms["regForm"];
    let login = regForm.elements["login"].value;
    let email = regForm.elements["email"].value;
    let password = regForm.elements["password"].value;
    let isAgreeToNewsLetter = regForm.elements["password"].value;
    let isAgreeToConditions = regForm.elements["password"].value;
    let dataToSend = JSON.stringify({
        login: login,
        email: email,
        password: password,
        isAgreeToNewsLetter: isAgreeToNewsLetter,
        isAgreeToConditions: isAgreeToConditions
    });
    let req = new XMLHttpRequest();
    req.open("POST", "/register", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.send(dataToSend);
});
