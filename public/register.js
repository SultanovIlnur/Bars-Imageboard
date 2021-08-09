$(document).ready(function(){
    $("#isAgreeToNewsLetter").on("change",function(){
        CheckboxesCheck();
    });
    $("#isAgreeToConditions").on("change",function(){
        CheckboxesCheck();
    });

    function CheckboxesCheck(){
        if ($("#isAgreeToNewsLetter").is(":checked") && $("#isAgreeToConditions").is(":checked")){
            $("#submit").removeAttr("disabled");
        }
        else{
            $("#submit").attr("disabled",true);
        };
    }

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
            password: password
        });
        let req = new XMLHttpRequest();
        req.open("POST", "/register", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load", function () {
            let receivedJSON = JSON.parse(req.response);
            if (receivedJSON.status == 201){
                document.location.href = '/signin';
            }
        });
        req.send(dataToSend);
    });
});

