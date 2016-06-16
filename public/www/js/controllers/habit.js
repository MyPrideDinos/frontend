(function() {
  'use strict';

  angular
    .module('happit')
    .controller('HabitCtrl', HabitCtrl);

  HabitCtrl.$inject = ['HabitsServices', 'ionicTimePicker','$state', '$stateParams'];

  function HabitCtrl(HabitsServices, ionicTimePicker, $state, $stateParams) {
    var ctrl = this;
    this.time;
    this.service = HabitsServices;

    this.service.getHabit($stateParams.id).then(function(data) {
      console.log($stateParams.id)
      ctrl.habit = data;
    }).catch(function(err) {
      console.log(err);
    });

    this.setDayContent = function(date) {
      if (ctrl.habit && ctrl.habit.dates) {
        for (var i = 0; i < ctrl.habit.dates.length; i++) {
          var currentDate = ctrl.habit.dates[i];
          if (currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth() && currentDate.getDate() === date.getDate()) {
            return '<div class="completedDay"></div>';
          }
        }
      }
      return '';
    };

    this.dayClick = function(date) {
      var habit_id = ctrl.habit.id;
      var habitDates = ctrl.habit.dates || [];

      if (habitDates.length) {
        for (var i = 0; i < habitDates.length; i++) {
          var currentDate = habitDates[i];
          if (currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth() && currentDate.getDate() === date.getDate()) {
            habitDates.splice(i, 1);
            ctrl.rerenderCal();
            HabitsServices.undoTask(habit_id, date);
            return;
          }
        }
      }

      habitDates.push(date);
      ctrl.rerenderCal();
      HabitsServices.completeTask(habit_id, date);
    };

    this.rerenderCal = function() {
      angular.element(document.querySelector('calendar-md')).scope().$$childHead._$$bootstrap();
    };

    this.addHabit = function(habit, time) {
      habit.time = time;
      habit.user_id = 2;

      HabitsServices.addHabit(habit).then( () => {
        $state.go('home');
      }).catch( (err) => {
        console.log(err);
      });
    };

    this.editHabit = function(habit, time) {
      habit.time = time;
      habit.user_id = 2;

      HabitsServices.editHabit(habit, time).then( ()=> {
        $state.go();
      }).catch( (err) => {
        console.log(err);
      });
    };

    this.deleteHabit = function(habit, time) {
      HabitsServices.deleteHabit(id).then( () => {
        $state.go('home');
      }).catch( (err) => {
        console.log(err);
      });
    };

    this.completeTask = function(habit) {
      HabitsServices.completeTask(habit).then( (data)=> {
        return data;
      }).catch( (err) => {
        console.log(err);
      });
    };

    this.undoTask = function(id) {
      HabitsServices.undoTask(id).then( () => {
        $state.go('habits');
      }).catch( (err) => {
        console.log(err);
      });
    };

    this.openTimePicker = function() {
      var min;

      var ipObj1 = {
        callback: function (val) {
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            var hour = selectedTime.getUTCHours();

            if(selectedTime.getUTCMinutes() === 0) {
               min = "00";
            } else {
               min = selectedTime.getUTCMinutes()
            }
            ctrl.time = hour + ":" + min;
            this.time = ctrl.time;
          }
        },
        inputTime: 50400,
        format: 12,
        setLabel: 'Set'
      };
      ionicTimePicker.openTimePicker(ipObj1);
    };
  };
})();
