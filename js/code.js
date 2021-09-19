var urlBase = 'http://contactmaster.xyz/LAMPAPI';

var userId = 0;
var firstName = "";
var lastName = "";
var curRow = null;
var curContact = 0;

function displaySuccess(msg) {
  var x = document.getElementById("greenSnackbar");
  x.innerHTML = msg;
  x.className = "show";
  setTimeout(function() {x.className = x.className.replace("show", "");}, 3000);
}

function displayError(err) {
  var x = document.getElementById("redSnackbar");
  x.innerHTML = err;
  x.className = "show";
  setTimeout(function() {x.className = x.className.replace("show", "");}, 3000);
}

function saveCookie() {
  var minutes = 20;
  var date = new Date();
  date.setTime(date.getTime()+(minutes*60*1000));
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
  userId = 0;
  var data = document.cookie;
  var splits = data.split(",");

  for (var i = 0; i < splits.length; i++) {
    var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");

    if(tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if(tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if(tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if(userId < 1) {
    window.location.href = "index.html";
  } else {
    document.getElementById("resultsTitle").innerHTML = "Contacts of " + firstName + " " + lastName;
  }
}

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;

  var jsonPayload = JSON.stringify({login:login, password:password});
  var url = urlBase + '/Login.php';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if(userId < 1) {
          displayError("Username/Password combination is incorrect")
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();
        window.location.href = "user.html";
      }
    };

    xhr.send(jsonPayload);

  } catch(err) {
    displayError(err.message);
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function addUser() {
  userId = 0;

  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  var login = document.getElementById("newLogin").value;
  var password = document.getElementById("newPassword").value;
  var passwordConfirm = document.getElementById("newPasswordConfirm").value;

  if (!firstName) {
    displayError("Missing first name");
    return;
  } else if (!login){
    displayError("Missing username");
    return;
  } else if (!password) {
    displayError("Missing password");
    return;
  } else if (password != passwordConfirm) {
    displayError("Passwords do not match");
    return;
  }

  var jsonPayload = JSON.stringify({login:login, password:password});
  var url = urlBase + '/Registration.php';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if(userId < 1) {
          displayError("Username not available");
          return;
        }

        saveCookie();
        window.location.href = "user.html";
      }
    };

    xhr.send(jsonPayload);

  } catch(err) {
    displayError(err.message);
  }
}

function addContact() {
  var qFirstName = document.getElementById("qFirstName").value;
  var qLastName = document.getElementById("qLastName").value;
  var qPhonenumber = document.getElementById("qPhonenumber").value;
  var qEmail = document.getElementById("qEmail").value;

  if (!qFirstName && !qLastName) {
    displayError("Missing name for new contact");
    return;
  }

  var jsonPayload = JSON.stringify({firstName:qFirstName,lastName:qLastName,phonenumber:qPhonenumber,email:qEmail,userid:userId});
  var url = urlBase + '/AddContact.php';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        var cid = jsonObject.id;
        var qerr = jsonObject.error;

        if (qerr) {
          displayError(qerr);
          return;
        } else {
          displaySuccess("Successfully added contact");
        }

        var table = document.getElementById("resultsBody");

        var row = table.insertRow(-1);
        var cell = row.insertCell(0);
        cell.innerHTML = qFirstName;
        cell = row.insertCell(1);
        cell.innerHTML = qLastName;
        cell = row.insertCell(2);
        cell.innerHTML = qPhonenumber;
        cell = row.insertCell(3);
        cell.innerHTML = qEmail;
        cell = row.insertCell(4);
        cell.innerHTML = "<button id=\"updateButton\" onclick=\"openEdit(this,"+cid+")\">edit</button>";
        cell = row.insertCell(5);
        cell.innerHTML = "<button id=\"removeButton\" onclick=\"openDelete(this,"+cid+")\">delete</button>";
      }
    };

    xhr.send(jsonPayload);

  } catch(err) {
    displayError(err.message);
  }
}

function searchContact() {
  var qFirstName = document.getElementById("qFirstName").value;
  var qLastName = document.getElementById("qLastName").value;
  var qPhonenumber = document.getElementById("qPhonenumber").value;
  var qEmail = document.getElementById("qEmail").value;

  var jsonPayload = JSON.stringify({firstName:qFirstName,lastName:qLastName,phonenumber:qPhonenumber,email:qEmail,userid:userId});
  var url = urlBase + '/SearchContact.php';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  document.getElementById("resultsBody").innerHTML = "";

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        var results = jsonObject.results;
        var qerr = jsonObject.error;

        if (qerr) {
          displayError(qerr);
          return;
        } else {
          displaySuccess("Successfully retrieved contacts");
        }

        var table = document.getElementById("resultsBody");
        for (var i=0; i<results.length; i++) {
          var row = table.insertRow(i);
          var cell = row.insertCell(0);
          cell.innerHTML = results[i].firstName;
          cell = row.insertCell(1);
          cell.innerHTML = results[i].lastName;
          cell = row.insertCell(2);
          cell.innerHTML = results[i].phonenumber;
          cell = row.insertCell(3);
          cell.innerHTML = results[i].email;
          cell = row.insertCell(4);
          cell.innerHTML = "<button id=\"updateButton\" onclick=\"openEdit(this,"+results[i].id+")\">edit</button>";
          cell = row.insertCell(5);
          cell.innerHTML = "<button id=\"removeButton\" onclick=\"openDelete(this,"+results[i].id+")\">delete</button>";
        }
      }
    };

    xhr.send(jsonPayload);

  } catch(err) {
    displayError(err.message);
  }
}

function openEdit(button, cid) {
  curRow = button.parentNode.parentNode;
  curContact = cid;

  var cells = curRow.getElementsByTagName("td");
  document.getElementById("eFirstName").value = cells[0].innerHTML;
  document.getElementById("eLastName").value = cells[1].innerHTML;
  document.getElementById("ePhonenumber").value = cells[2].innerHTML;
  document.getElementById("eEmail").value = cells[3].innerHTML;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("editForm").style.display = "block";
}

function closeEdit() {
  curRow = null;
  curContact = 0;

  document.getElementById("eFirstName").value = "";
  document.getElementById("eLastName").value = "";
  document.getElementById("ePhonenumber").value = "";
  document.getElementById("eEmail").value = "";

  document.getElementById("editForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function editContact() {
  var eFirstName = document.getElementById("eFirstName").value;
  var eLastName = document.getElementById("eLastName").value;
  var ePhonenumber = document.getElementById("ePhonenumber").value;
  var eEmail = document.getElementById("eEmail").value;

  var jsonPayload = JSON.stringify({firstName:eFirstName,lastName:eLastName,phonenumber:ePhonenumber,email:eEmail,contactid:curContact,userid:userId});
  var url = urlBase + '/EditContact.php';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        var qerr = jsonObject.error;

        if (qerr) {
          displayError(qerr);
          return;
        } else {
          displaySuccess("Successfully updated contact");
        }

        var cells = curRow.getElementsByTagName("td");
        cells[0].innerHTML = eFirstName;
        cells[1].innerHTML = eLastName;
        cells[2].innerHTML = ePhonenumber;
        cells[3].innerHTML = eEmail;

        closeEdit();
      }
    };

    xhr.send(jsonPayload);

  } catch(err) {
    displayError(err.message);
  }
}

function openDelete(button, cid) {
  curRow = button.parentNode.parentNode;
  curContact = cid;

  var cells = curRow.getElementsByTagName("td");
  var delCells = document.getElementById("deleteBody").getElementsByTagName("td")
  delCells[0].innerHTML = cells[0].innerHTML;
  delCells[1].innerHTML = cells[1].innerHTML;
  delCells[2].innerHTML = cells[2].innerHTML;
  delCells[3].innerHTML = cells[3].innerHTML;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("deleteForm").style.display = "block";
}

function closeDelete() {
  curRow = null;
  curContact = 0;

  var delCells = document.getElementById("deleteBody").getElementsByTagName("td")
  delCells[0].innerHTML = "";
  delCells[1].innerHTML = "";
  delCells[2].innerHTML = "";
  delCells[3].innerHTML = "";

  document.getElementById("deleteForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function deleteContact() {
  var jsonPayload = JSON.stringify({contactid:curContact,userid:userId});
  var url = urlBase + '/DeleteContact.php';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        var qerr = jsonObject.error;

        if (qerr) {
          displayError(qerr);
          return;
        } else {
          displaySuccess("Successfully deleted contact");
        }

        document.getElementById("resultsTable").deleteRow(curRow.rowIndex);
        closeDelete();
      }
    };

    xhr.send(jsonPayload);

  } catch(err) {
    displayError(err.message);
  }
}

// Dynamic Background---------------------------------------------

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 240, // Frames per second
    x = 200, // Number of stars
    mouse = {
      x: 0,
      y: 0
    };  // mouse location

// Push stars to array

for (var i = 0; i < x; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1 + 1,
    vx: Math.floor(Math.random() * 50) - 25,
    vy: Math.floor(Math.random() * 50) - 25
  });
}

// Draw the scene

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.globalCompositeOperation = "lighter";

  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];

    ctx.fillStyle = "#399AC0";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.stroke();
  }

  ctx.beginPath();
  for (var i = 0, x = stars.length; i < x; i++) {
    var starI = stars[i];
    ctx.moveTo(starI.x,starI.y);
    if(distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
    for (var j = 0, x = stars.length; j < x; j++) {
      var starII = stars[j];
      if(distance(starI, starII) < 150) {
        //ctx.globalAlpha = (1 / 150 * distance(starI, starII).toFixed(1));
        ctx.lineTo(starII.x,starII.y);
      }
    }
  }
  ctx.lineWidth = 0.05;
  ctx.strokeStyle = '#399AC0';
  ctx.stroke();
}

function distance( point1, point2 ){
  var xs = 0;
  var ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;

  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt( xs + ys );
}

// Update star locations

function update() {
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];

    s.x += s.vx / FPS;
    s.y += s.vy / FPS;

    if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
    if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
  }
}

canvas.addEventListener('mousemove', function(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Update and draw

function tick() {
  draw();
  update();
  requestAnimationFrame(tick);
}

tick();
