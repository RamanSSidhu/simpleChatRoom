/*
Name: Ramanpreet Sidhu
Assignment: 3 - Simple Chat Room
Student ID: 30011040
Tutorial Section: B02
 */
var socket =  require('socket.io');

let currentUser = "Raman";

function renderUserList (userList) {
    let unorderedUserList = $(`#users-list`);

    $.each(userList, (index, value) => {
        unorderedUserList.append(`<li class="single-user" style="color: ${value.color}">${value.name}</li>`);
    });
}

function renderMessageList (messageList) {
    let unorderedMessageList = $(`#messages-list`);

    $.each(messageList, (index, value) => {
        let alignFormat = (value.username !== currentUser) ? `style= "align-self: flex-end; border-color: ${value.color};"` : null;

        unorderedMessageList.append(`
                <li class="single-message" ${alignFormat}>
                    <div class="message-details-container">
                        <span class="in-message-user-name" style="color: ${value.color}">${value.username}</span>
                        <span class="in-message-date">${value.timestamp}</span>
                    </div>
                    <div class="message-contents-container">
                        <span class="message-contents">${value.message}</span>
                    </div>
                </li>`);
    })
}

$(document).ready(() => {

    socket.connect("http://localhost:3000");

});