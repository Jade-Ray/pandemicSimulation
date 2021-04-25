window.onload = function() {
    var intor_simulator = simulator('simulator-intro', 5, 100);

    var para = document.getElementById('para');
    var para_button = para.getElementsByTagName('button')[0];

    para_button.onclick = function(){
        config.ballCount = parseInt(document.getElementById('countInput').value);
        config.speedMax = parseInt(document.getElementById('velocityInput').value);
        config.speedMin = -parseInt(document.getElementById('velocityInput').value);
        config.restoredTime = parseInt(document.getElementById('healInput').value);
        config.infectedRat = parseFloat(document.getElementById('infectedInput').value);
        config.iteration = parseInt(document.getElementById('iterationInput').value);

        var control_simulator = simulator('simulator-para', config.ballCount, 600);
    }
}