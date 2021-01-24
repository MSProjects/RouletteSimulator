function playRouletteOnce(bet, double, chosenNumber, bank, concede) {
    var win = false;
    var tries = 0;
    var rouletteNumber;
    var paid = 0;

    
    
    while (!win) {
        
        tries++;
        rouletteNumber = Math.floor((Math.random()*36) + 1); ;
        
        if (tries % double == 0){
            bet *= 2;
        }
        
        console.log("#"+tries+"> Roulette number: " + rouletteNumber + " / Bet: " + bet + " e / Bank: " + bank);
        
        paid -= bet;
        paid = parseFloat(paid.toFixed(2));
        bank -= bet;
        bank = parseFloat(bank.toFixed(2));

        if ((bank - bet) < bet){
            console.log(">>> You lost (no more money to bet, bank = " + bank + ") in " + tries + " tries using " + paid + " e");
            return [0,tries,paid,bank];
        }

        if (tries == concede){
            console.log(">>> You conceded in " + tries + " tries using " + paid + " e / Bank: " + bank);
            return [-1,tries,paid,bank];
        }

        // Check if won
        if (rouletteNumber == chosenNumber){
            win = true;
        }
    }

    bank = parseFloat((bank + bet*36).toFixed(2));
    console.log(">>> You won " + (bet*36) + " e in " + tries + " tries using " + paid + " e / Bank: " + bank);
    
    
    return [bet*36,tries,paid,bank];
}

function playRouletteMultipleTimes() {

    console.clear();
    var result = document.getElementById('result');
    result.classList.remove("text-success");
    result.classList.remove("text-danger");
    
    var inputs = checkInputs();

    if (!inputs) { return; }
    result.innerHTML = "Loading..."

    var times = inputs[1];
    var i = 0;
    var totalTries = 0;
    var totalWon = 0;
    var totalLost = 0;
    var bank = inputs[4];
    var initialBank = bank;
    var win = true;
    var won = 0;
    var concede = false;

    while (i != times) {
        console.log(`------ New Roulette Game (${i+1}/${times}) ------`)
        var res = playRouletteOnce(inputs[0],inputs[2],inputs[3],bank,inputs[5]);
        console.log("-------------------------------");
        totalWon += res[0];
        totalTries += res[1];
        totalLost += res[2];
        bank = res[3];
        if (res[0] == 0) {
            win = false;
            break;
        } else if (res[0] == -1) {
            win = false;
            concede = true;
        } else {
            win = true;
            won++;
        }
        i++;
    }

    if (bank > initialBank){
        var benefit = totalWon - Math.abs(totalLost);
        benefit > 0 ? result.classList.add("text-success") : result.classList.add("text-danger");
    
        result.innerHTML = "After " + times + " win attempt: You won " + (bank - initialBank).toFixed(2) + " &euro; (with " + bank.toFixed(2) + " &euro; in bank) " + totalTries + " turns using " +  Math.abs(totalLost).toFixed(2) + " &euro; &#8594; Benefit = " + benefit.toFixed(2) + " &euro; with an average " + (totalTries/times).toFixed(0) + " turns/win";
    } else {
        var benefit = totalWon - Math.abs(totalLost);
        result.classList.add("text-danger");
        result.innerHTML = "After " + times + " win attempt: You lost " + (initialBank - bank).toFixed(2) + " &euro; (with " + bank.toFixed(2) + " &euro; in bank) " + totalTries + " turns using " +  Math.abs(totalLost).toFixed(2) + " &euro; &#8594; With an average " + (totalTries/times).toFixed(0) + " turns/win";
    }

    var formdata = new FormData();
    formdata.append("query", "SetStatistics");
    formdata.append("bet", inputs[0]);
    formdata.append("wins", inputs[1]);
    formdata.append("double_at", inputs[2]);
    formdata.append("bank", inputs[4]);
    formdata.append("concede", inputs[5]);
    formdata.append("benefit", win ? (bank - initialBank).toFixed(2) : (initialBank - bank).toFixed(2));
    formdata.append("final_bank", bank.toFixed(2));
    formdata.append("won", won);
    formdata.append("played", (i+1));

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://ms-projects.dynu.net:90/RouletteSimulatorWS/statistics.php", requestOptions);

}

function checkInputs() {
    var bet = parseFloat(document.getElementById('bet').value);
    var wins = parseFloat(document.getElementById('wins').value);
    var double = parseFloat(document.getElementById('double').value);
    var chosenNumber = parseFloat(document.getElementById('chosen-number').value);
    var bank = parseFloat(document.getElementById('bank').value);
    var concede = parseFloat(document.getElementById('concede').value);

    if (bet < 0.1 || bet > 10) { displayAlert("Bet must be between 0.1 and 10"); return; }
    if (wins < 1 || wins > 5000) { displayAlert("Wins must be between 1 and 5000"); return; }
    if (double < 1 || double > 36) { displayAlert("Double must be between 1 and 36"); return; }
    if (chosenNumber < 1 || chosenNumber > 36) { displayAlert("Chosen number must be between 1 and 36"); return; }
    if (bank < 0.1 || bank > 20000) { displayAlert("Bank must be between 0.1 and 20000"); return; }
    if (concede < 1 || concede > 500) { displayAlert("Condede must be between 1 and 500"); return; }

    setCookie("bet",bet,30);
    setCookie("wins",wins,30);
    setCookie("double",double,30);
    setCookie("chosenNumber",chosenNumber,30);
    setCookie("bank",bank,30);
    setCookie("concede",concede,30);

    document.getElementById('inputs-alert').classList.remove("alert-visible");
    
    return [bet, wins, double, chosenNumber, bank, concede];
}

function displayAlert(message) {
    var inputsAlert = document.getElementById('inputs-alert');
    inputsAlert.classList.add("alert-visible");
    inputsAlert.innerHTML = message;
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function loadCookies() {
    if (window.location.href.indexOf("C:/Users/Sacha/Documents/Work/Perso/Web/RouletteSimulator/") > -1) {
        document.getElementById('bet').value = 0.1;
        document.getElementById('wins').value = 10;
        document.getElementById('double').value = 26;
        document.getElementById('chosen-number').value = 14;
        document.getElementById('bank').value = 30;
        document.getElementById('concede').value = 52;
    } else {
        document.getElementById('bet').value = getCookie("bet");
        document.getElementById('wins').value = getCookie("wins");
        document.getElementById('double').value = getCookie("double");
        document.getElementById('chosen-number').value = getCookie("chosenNumber");
        document.getElementById('bank').value = getCookie("bank");
        document.getElementById('concede').value = getCookie("concede");
    }

}

function listStatistics() {

    var formdata = new FormData();
    formdata.append("query", "ListStatistics");

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://ms-projects.dynu.net:90/RouletteSimulatorWS/statistics.php", requestOptions)
    .then(response => response.text())
    .then(result => {
        let statistics = JSON.parse(result);
        var table = document.querySelector("#table .tbody");
        table.innerHTML = "";

        for (var i = 0; i < statistics.length; i++) {
            var row = `<tr>
                            <td data-th="Bank">${statistics[i].bank} &euro;</td>
                            <td data-th="Bet">${statistics[i].bet} &euro;</td>
                            <td data-th="Wins">${statistics[i].wins}</td>
                            <td data-th="Double at">${statistics[i].double_at}</td>
                            <td data-th="Concede at">${statistics[i].concede}</td>
                            <td data-th="Final bank">${statistics[i].final_bank}</td>
                            <td data-th="Benefit">${statistics[i].benefit}</td>
                            <td data-th="Winrate">${statistics[i].winrate}</td>
                        </tr>`
            table.innerHTML += row;
        }
    })

  }
  
listStatistics();