const url = "/fetchusers";
fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    for (var i = 0; i<data.length; i++) {
        user = data[i];
        $("#table").append("<tr><td>" + user.id +
         "</td><td>"  + user.username + 
         "</td><td>"  + user.age + 
         "</td><td>"  + user.email + 
         "</td><td>" + user.role.role + "</td></tr>");
    }
    console.log(data);
  }).catch(function() {
    $("#table").hide();
    $("#wrapper").append("<p><b>You dont have access to this information, please log in.</b></p>")
  });