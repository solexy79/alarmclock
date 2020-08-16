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

//ALarm clock controller
var alarmClockController = (function() {
  // Creating alarm constructor
  class Alarm {
    constructor(id, description, alarmtime) {
      this.id = id;
      this.description = description;
      this.alarmtime = alarmtime;
    }
  }

  // Creating alarm data structure to store alarms created
  var data = {
    allAlarms: []
  };

  return {
    // Creating Public alarm object
    addAlarm: function(ID, des, alrmtim) {
      var newAlarm, ID;

      //Create new id
      if (data.allAlarms.length > 0) {
        ID = data.allAlarms[data.allAlarms.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new Alarm obj
      newAlarm = new Alarm(ID, des, alrmtim);

      //Push it into our data structureas
      data.allAlarms.push(newAlarm);
      return newAlarm;
    },

    // SetAlarm function
    setAlarm: function(alarmtime) {
      if (isNaN(alarmtime)) {
        alert("Invalid Date");
        return;
      }
      var alarm = new Date(alarmtime);

      var alarmTime = new Date(
        alarm.getUTCFullYear(),
        alarm.getUTCMonth(),
        alarm.getUTCDate(),
        alarm.getUTCHours(),
        alarm.getUTCMinutes(),
        alarm.getUTCSeconds()
      );

      var diff = alarmTime.getTime() - new Date().getTime();

      return diff;
    },

    // delete alarm function
    deleteAlarm: function(id) {
      var ids, index;
      ids = data.allAlarms.map(item => {
        return item.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allAlarms.splice(index, 1);
      }
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
    alarmContainer: ".alarm-container-label",
    openModalbtn: "[data-open-modal]",
    modal: "modal",
    closeModalBtn: "#closeModal",
    timerSound: "[data-timer-sound]",
    alarmSound: "[data-alarm-sound]",
    alarmModal: "[data-alarm-modal]",
    alarmDescription: "[data-alarm-description]",
    snoozeBtn: "[data-snooze-btn]",
    stopBtn: "[data-stop-btn]",
    section: "[data-alarm-section]"
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
          .value.slice(11),
        alarmInput: document.getElementById(DomStrings.inputAlarmTime)
          .valueAsNumber
      };
    },
    addAlarmList: function(obj) {
      var html, newHtml, element;
      // Create html string with placeholder text
      element = DomStrings.alarmContainer;
      html = `<div class="alarms" id="alarm-%id%">
                <div class="alarm-time">
                  <label>%alarmtime%</label>
                  <div class="alarm-desc">
                    <button data-alarm-del-btn><i class="fas fa-trash"></i></button>
                    <span class="desc">%description%</span>
                  </div>
                </div>
                <input type="checkbox" class="toggle-button" checked/>
              </div>`;

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%alarmtime%", obj.alarmtime);

      // Insert HTML to the DOM
      document.querySelector(element).insertAdjacentHTML("afterend", newHtml);
    },
    delAlarmList: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentElement.removeChild(el);
    }
  };
})();

// **************
// GLOBAL APP CONTROLLER
var controller = (function(alarmClockCtrl, UICtrl) {
  var alarmTimer;
  var DOM = UICtrl.getDOMstrings();
  var setupEventListeners = function() {
    var modal = document.getElementById(DOM.modal);

    document
      .querySelector(DOM.openModalbtn)
      .addEventListener("click", openModal);

    document
      .querySelector(DOM.closeModalBtn)
      .addEventListener("click", closeModal);

    window.addEventListener("click", e => {
      if (e.target == modal) {
        closeModal();
      }
    });

    document
      .getElementById(DOM.addAlarmBtn)
      .addEventListener("click", ctrlAddAlarm);
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddAlarm();
      }
    });

    document.querySelector(DOM.stopBtn).addEventListener("click", stopAlarm);

    document
      .querySelector(DOM.snoozeBtn)
      .addEventListener("click", snoozeAlarm);

    document
      .querySelector(DOM.section)
      .addEventListener("click", ctrlDeleteAlarm);
  };

  var openModal = function() {
    modal.style.display = "block";
    modal.style.visibility = "visible";
  };

  var closeModal = function() {
    modal.style.display = "none";
    modal.style.visibility = "hidden";
  };

  var openAlarmModal = function() {
    var alarmModal = document.querySelector(DOM.alarmModal);
    alarmModal.style.display = "block";
    alarmModal.style.visibility = "visible";
  };

  var closeAlarmModal = function() {
    var alarmModal = document.querySelector(DOM.alarmModal);
    alarmModal.style.display = "none";
    alarmModal.style.visibility = "hidden";
  };

  var initAlarm = function() {
    var input;
    var timerSound = document.querySelector(DOM.timerSound);
    var alarmDescription = document.querySelector(DOM.alarmDescription);

    input = UICtrl.getInputs();
    alarmDescription.textContent = `${input.description} ${input.alarmTime}`;
    openAlarmModal();
    timerSound.play();
  };
  var stopAlarm = function() {
    var timerSound = document.querySelector(DOM.timerSound);
    timerSound.pause();
    closeAlarmModal();
  };
  var snoozeAlarm = function() {
    stopAlarm();
    setTimeout(initAlarm, 120000);
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

    // Add the alarm to the alarm controller
    newAlarm = alarmClockCtrl.addAlarm(
      input.id,
      input.description,
      input.alarmTime
    );

    // Sound alarm
    var diff = alarmClockCtrl.setAlarm(input.alarmInput);
    if (diff < 0) {
      alert("time has already passed");
      return;
    }
    alarmTimer = setTimeout(initAlarm, diff);
    // Add the alarm to the UI
    UICtrl.addAlarmList(newAlarm);
    closeModal();
  };

  var ctrlDeleteAlarm = function(e) {
    var itemID, splitID, ID;
    itemID =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    if (itemID) {
      splitID = itemID.split("-");
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      alarmClockCtrl.deleteAlarm(ID);

      // 2. delete the item from the UI
      UICtrl.delAlarmList(itemID);

      // 3. delete alarm
      clearTimeout(alarmTimer);
    }
  };

  return {
    init: function() {
      console.log("app started");
      setupEventListeners();
    }
  };
})(alarmClockController, UIController);

controller.init();
