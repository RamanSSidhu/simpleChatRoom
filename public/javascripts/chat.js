/*
Name: Ramanpreet Sidhu
Assignment: 3 - Simple Chat Room
Student ID: 30011040
Tutorial Section: B02
 */

let root = document.documentElement;
let currentUser = "User#";

function renderUserList (userList) {
    let unorderedUserList = $(`#users-list`);

    $.each(userList, (index, value) => {
        unorderedUserList.append(`<li class="single-user" style="color: ${value.color}">${value.name}</li>`);
    });
}

function renderMessageList (messageList) {
    console.log(`Received Message List: ${messageList}`);
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
                        <span class="message-contents">${value.messageContent}</span>
                    </div>
                </li>`);
    })
}

$(document).ready(() => {
    let socket = io.connect("http://localhost:3000");

    socket.on('setUser', (userObject) => {
        console.log(`Received Username: ${userObject.username}`);
        console.log(`Received Color: ${userObject.color}`);
        currentUser = userObject.username;
        root.style.setProperty('--user-color', userObject.color);
    });

    $(`#btn-send`).on('click', () => {
        let inputBoxContents = $(`#input-box`).val();
        if (inputBoxContents !== "")  {
            let messageObject = {
                messageContent: inputBoxContents,
                username: currentUser
            }
            socket.emit('newMessage', messageObject);
            console.log(`Message Sent: ${messageObject.messageContent} User: ${messageObject.username}`);
            $(`#input-box`).val('');
        }
    });

    $(document).keypress((keyPressed) => {
        if(keyPressed.which == 13) {
            $(`#btn-send`).click();
        }
    });

    socket.on('addMessages', renderMessageList);
});