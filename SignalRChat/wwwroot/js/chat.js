"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Maximum number of messages to display in the LIFO stack
const maxMessages = 10;

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    //var li = document.createElement("li");
    //document.getElementById("messagesList").appendChild(li);
    //// We can assign user-supplied strings to an element's textContent because it
    //// is not interpreted as markup. If you're assigning in any other way, you
    //// should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;

    var li = document.createElement("li");

    // Add the new message to the top of the list (LIFO)
    var messagesList = document.getElementById("messagesList");
    messagesList.insertBefore(li, messagesList.firstChild);

    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user}: ${message}`;

    // Check if the maximum number of messages has been reached and remove the oldest message from the bottom if necessary
    if (messagesList.children.length > maxMessages) {
        messagesList.removeChild(messagesList.lastChild);
    }
});



connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;

    document.getElementById("messageInput").value = "";

    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

function clearText() {
    document.getElementById("userInput").value = "";
    document.getElementById("messageInput").value = "";
}