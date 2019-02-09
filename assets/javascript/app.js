// Initialize Firebase
var config = {
    apiKey: 'AIzaSyAx_bQtcarBKiu4yioiI6WDoZ_yI68VH0w',
    authDomain: 'train-scheduler-assignme-9a17c.firebaseapp.com',
    databaseURL: 'https://train-scheduler-assignme-9a17c.firebaseio.com',
    projectId: 'train-scheduler-assignme-9a17c',
    storageBucket: 'train-scheduler-assignme-9a17c.appspot.com',
    messagingSenderId: '696160025242'
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // Button for adding trains
  $('#form').on('submit', function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $('#trainName')
      .val()
      .trim();
    var destination = $('#destination')
      .val()
      .trim();
    var firstTrain = $('#firstTrain')
      .val()
      .trim();
    var frequency = $('#frequency')
      .val()
      .trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: destination,
      time: firstTrain,
      frequency: frequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Clears all of the text-boxes
    $('#train-name-input').val('');
    $('#destination-input').val('');
    $('#time-input').val('');
    $('#frequency-input').val('');
  });
  // Create Firebase event for adding a train to the database
  database.ref().on('child_added', function(childSnapshot) {
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var startTime = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;
  
    //Create train start converted time
    var convertedStartTime = moment(startTime, 'HH:mm').subtract(1, 'years');
  
    // Calculate the difference between current time and train start time
    var timeDifference = moment().diff(moment(convertedStartTime), 'minutes');
  
    // Time between trains
    var timeApart = timeDifference % childSnapshot.val().frequency;
  
    // Minutes until arrival
    var minutesUntilTrain = childSnapshot.val().frequency - timeApart;
    // Adding minutes until the next train to the current time and formatting the appearance of the time
    var nextArrival = moment()
      .add(minutesUntilTrain, 'm')
      .format('LT');
  
    var newRow = $('<tr>').append(
      $('<td>').text(trainName),
      $('<td>').text(destination),
      $('<td>').text(frequency),
      $('<td>').text(nextArrival),
      $('<td>').text(minutesUntilTrain)
    );
  
    // Append the new row to the table
    $('#trainTable > tbody').append(newRow);
  });
  