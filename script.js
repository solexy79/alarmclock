// ANALOGCLOCK CONTROLLER
var analogClockController = (function() {
  setInterval(setClock, 1000);

  //Getting DOM elements
  const minuteHand = document.querySelector("[data-minute-hand");
  const secondHand = document.querySelector("[data-second-hand");

  function setClock() {
    const currentDate = new Date();
    const secondsRatio = currentDate.getSeconds() / 60;
    const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60;
    setRotation(secondHand, secondsRatio);
    setRotation(minuteHand, minutesRatio);
  }

  function setRotation(element, rotationRatio) {
    element.style.setProperty("--rotation", rotationRatio * 360);
  }
  setClock();
})();

// DIGITALCLOCK CONTROLLER
var digitalClockController = (function() {
  setInterval(digitalClock, 1000);
  function digitalClock() {
    var digitaltime = document.querySelector("[data-digital-clock]");
    var h = new Date().getHours();
    var m = new Date().getMinutes();

    if (h < 10) {
      h = "0" + h + ":";
    } else {
      h = h + ":";
    }
    if (m < 10) {
      m = "0" + m;
    } else {
      m = m;
    }
    digitaltime.innerHTML = `${h}${m}`;
  }
})();

//OPEN MODAL
const openModalbtn = document.querySelector("[data-open-modal]");
const modal = document.getElementById("modal");
const btnCloseModal = document.querySelector("#closeModal");

openModalbtn.addEventListener("click", () => {
  modal.style.display = "block";
  modal.style.visibility = "visible";
});

btnCloseModal.addEventListener("click", () => {
  modal.style.display = "none";
  modal.style.visibility = "visible";
});

window.addEventListener("click", e => {
  if (e.target == modal) {
    modal.style.display = "none";
    modal.style.visibility = "visible";
  }
});

//ALarm clock controller
var alarmClockController = (function() {
  //some code
})();

// ******************
//UI controller
var UIController = (function() {
  //some other code
})();

// **************
// GLOBAL APP CONTROLLER
var Controller = (function() {
  //some other code
})();
