function playRouletteOnce(bet, double, chosenNumber) {
    var win = false;
    var tries = 0;
    var rouletteNumber;
    var bank = 0;

    console.log("------ New Roulette Game ------")
    
    while (!win) {
        
        tries++;
        rouletteNumber = Math.floor((Math.random()*36) + 1); ;
        
        // Start double bet at half probability
        if (tries % double == 0){
            bet *= 2;
        }
        
        console.log("#"+tries+"> Roulette number: " + rouletteNumber + " / Bet: " + bet + " e");
        
        bank -= bet;

        // Check if won
        if (rouletteNumber == chosenNumber){
            win = true;
        }
    }
    
    console.log(">>> You won " + (bet*36) + " e in " + tries + " tries using " + bank.toFixed(2) + " e");
    console.log("-------------------------------");
    
    return [bet*36,tries,bank];
}

function playRouletteMultipleTimes() {

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

    while (i != times) {
        var res = playRouletteOnce(inputs[0],inputs[2],inputs[3]);
        totalWon += res[0];
        totalTries += res[1];
        totalLost += res[2];
        i++;
    }

    var benefit = totalWon - Math.abs(totalLost);
    benefit > 0 ? result.classList.add("text-success") : result.classList.add("text-danger");


    result.innerHTML = "After " + times + " wins: You won " + totalWon.toFixed(2) + " &euro; in " + totalTries + " turns using " +  Math.abs(totalLost).toFixed(2) + " &euro; &#8594; Benefit = " + benefit.toFixed(2) + " &euro; with an average " + (totalTries/times).toFixed(0) + " turns/win";

}

function checkInputs() {
    var bet = parseFloat(document.getElementById('bet').value);
    var wins = parseFloat(document.getElementById('wins').value);
    var double = parseFloat(document.getElementById('double').value);
    var chosenNumber = parseFloat(document.getElementById('chosen-number').value);

    if (bet < 0.1 || bet > 10) { displayAlert("Bet must be between 0.1 and 10"); return; }
    if (wins < 1 || wins > 500) { displayAlert("Wins must be between 1 and 500"); return; }
    if (double < 1 || double > 36) { displayAlert("Double must be between 1 and 36"); return; }
    if (chosenNumber < 1 || chosenNumber > 36) { displayAlert("Chosen number must be between 1 and 36"); return; }

    document.getElementById('inputs-alert').classList.remove("alert-visible");
    
    return [bet, wins, double, chosenNumber];
}

function displayAlert(message) {
    var inputsAlert = document.getElementById('inputs-alert');
    inputsAlert.classList.add("alert-visible");
    inputsAlert.innerHTML = message;
}