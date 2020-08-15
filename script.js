// ANALOGCLOCK CONTROLLER
var analogClockController = (function() {
  setInterval(setClock, 1000);

  //Getting DOM elements
  const hourHand = document.querySelector("[data-hour-hand");
  const minuteHand = document.querySelector("[data-minute-hand");
  const secondHand = document.querySelector("[data-second-hand");

  function setClock() {
    const currentDate = new Date();
    const secondsRatio = currentDate.getSeconds() / 60;
    const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60;
    const hoursRatio = (minutesRatio + currentDate.getHours()) / 12;
    setRotation(secondHand, secondsRatio);
    setRotation(minuteHand, minutesRatio);
    setRotation(hourHand, hoursRatio);
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
// MODAL END

//ALarm clock controller
var alarmClockController = (function() {
  class Alarm {
    constructor(id, description, alarmtime) {
      this.id = id;
      this.description = description;
      this.alarmtime = alarmtime;
    }
  }

  var data = {
    allAlarms: []
  };

  return {
    addAlarm: function(ID, des, alrmtim) {
      var newAlarm, ID;

      //Create new id
      if (data.allAlarms.length > 0) {
        ID = data.allAlarms[data.allAlarms.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new Alarm
      newAlarm = new Alarm(ID, des, alrmtim);

      //Push it into ourb data structureas
      data.allAlarms.push(newAlarm);
      return newAlarm;
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// ******************
//UI controller
var UIController = (function() {
  var DomStrings = {
    inputDescription: "description",
    inputAlarmTime: "set-alarm",
    addAlarmBtn: "alarm-btn",
    toggleBtn: "toggle-1",
    alarmContainer: ".alarm-container-label"
  };

  return {
    getDOMstrings: function() {
      return DomStrings;
    },
    getInputs: function() {
      return {
        description: document.getElementById(DomStrings.inputDescription).value,
        alarmTime: document
          .getElementById(DomStrings.inputAlarmTime)
          .value.slice(11)
      };
    },
    addAlarmList: function(obj) {
      var html, newHtml, element;
      // Create html string with placeholder text
      element = DomStrings.alarmContainer;
      html = `<div class="alarms id=alarm-%id%">
                <div class="alarm-time">
                  <label>%alarmtime%</label>
                  <div class="alarm-desc">
                    <button><i class="fas fa-trash"></i></button>
                    <span class="desc">%description%</span>
                  </div>
                </div>
                <input type="checkbox" class="toggle-button"/>
              </div>`;

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%alarmtime%", obj.alarmtime);

      // Insert HTML to the DOM
      document.querySelector(element).insertAdjacentHTML("afterend", newHtml);
    }
  };
})();

// **************
// GLOBAL APP CONTROLLER
var controller = (function(alarmClockCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document
      .getElementById(DOM.addAlarmBtn)
      .addEventListener("click", ctrlAddAlarm);
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddAlarm();
      }
    });
  };

  var ctrlAddAlarm = function() {
    var input, newAlarm;

    // Get the field input data
    input = UICtrl.getInputs();
    if (input.alarmTime === "") {
      alert("E be things, abeg add time");
      return;
    }
    if (input.description === "") {
      input.description = " ";
    }
    console.log(input);

    // Add the alarm to the alarm controller
    newAlarm = alarmClockCtrl.addAlarm(
      input.id,
      input.description,
      input.alarmTime
    );

    // Add the alarm to the UI
    UICtrl.addAlarmList(newAlarm);
  };

  return {
    init: function() {
      console.log("app started");
      setupEventListeners();
    }
  };
})(alarmClockController, UIController);

controller.init();
