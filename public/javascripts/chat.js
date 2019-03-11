/*
Name: Ramanpreet Sidhu
Assignment: 3 - Simple Chat Room
Student ID: 30011040
Tutorial Section: B02
 */

let root = document.documentElement;
let currentUser = "User#";

function renderUserList (userList) {
    let userListMap = new Map(JSON.parse(userList));
    console.log(`Received User List (Map): ${userList}`);
    let unorderedUserList = $(`#users-list`);

    userListMap.forEach((value, key, map) => {
        unorderedUserList.append(`<li id="${key}" class="single-user" style="color: ${value}">${key}</li>`);
    });
}

function renderMessageList (messageList) {
    console.log(`Received Message List: ${messageList}`);
    let unorderedMessageList = $(`#messages-list`);

    $.each(messageList, (index, value) => {
        let alignFormat = (value.username !== currentUser) ? `style= "align-self: flex-end; border-color: ${value.color};"` : "";

        unorderedMessageList.append(`
                <li class="single-message user-message-${value.username}" ${alignFormat}>
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

function deleteFromUserList(userObject) {
    $(`#${userObject.username}`).remove();
}

function updateMessageColors(userObject) {
    $(`.user-message-${userObject.username}`).css("border-color", userObject.color);
    $(`.user-message-${userObject.username} .in-message-user-name`).css("color", userObject.color);
}

function updateUserName (user) {
    $(`.user-message-${user.oldUserName}`).removeClass(`user-message-${user.oldUserName}`).addClass(`user-message-${user.newUserName}`);
    $(`.user-message-${user.newUserName} .in-message-user-name`).text(`${user.newUserName}`);
    if (currentUser == user.oldUserName) {
        currentUser = user.newUserName;
    }
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

        socket.emit('newMessage', {
            messageContent: inputBoxContents,
            username: currentUser
        });

        $(`#input-box`).val('');
    });

    $(document).keypress((keyPressed) => {
        if(keyPressed.which == 13) {
            $(`#btn-send`).click();
        }
    });

    socket.on('updateUserColor', (userObject) => {
        root.style.setProperty('--user-color', userObject.color);
    });

    socket.on('addMessages', renderMessageList);

    socket.on('addUsers', renderUserList);

    socket.on('deleteUser', deleteFromUserList);

    socket.on('updateMessageColors', updateMessageColors);

    socket.on('updateUserNameInMessages', updateUserName);

});
