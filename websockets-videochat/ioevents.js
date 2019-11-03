const users = {}
let Clients = []
let UserSet = new Set();
let User = require("./db/user.js")

module.exports = function(io){

    const sendTo = (ws, message) => {
        console.log("SENDING MSG: " + JSON.stringify(message));
        ws.send(JSON.stringify(message))
    }
      
    io.on('connection', function(ws){
        console.log('NEW CLIENT CONNECTED ');

        ws.on('message', message => {

            console.log(JSON.stringify(message));

            let data = null
        
            try {
              data = JSON.parse(message)
            } catch (error) {
              console.error('Invalid JSON', error)
              data = {}
            }
        
            switch (data.type) {
              case 'register':
                let userData = {
                  "username" : data.username,
                  "password" : data.password,
                  "confirmPassword" : data.confirmPassword
                }
        
                User
                  .registerUser(userData)
                  .then(result => {
                    result.type = 'register'
                    sendTo(ws, result)
                  })
                  .catch(err => {
                    console.log(err)
                    err.type = "register"
                    sendTo(ws, err)
                  })
                break
              case 'login':
                let userLoginData = {
                  "username" : data.username,
                  "password" : data.password
                }
        
                User
                  .loginUser(userLoginData)
                  .then(result => {
                    if(result.success) {
                      console.log('User logged', data.username)
                      users[data.username] = ws
                      ws.username = data.username
                      sendTo(ws, { type: 'login', success: true, user : data.username })
                      Clients.push(ws)
                      
                      if(data.username) {
                        UserSet.add(data.username)
                        console.log(UserSet)
                        Clients.map(el => {
                          sendTo(el, { updatedUserList : Array.from(UserSet) })
                        })
                      }
                    }
                  }).catch(err => {
                    if(err.message) {
                      err.type = "login"
                      sendTo(ws, err)  
                    }
                  })
                break
              case 'offer':
                console.log('Sending offer to: ', data.otherUsername)
                if (users[data.otherUsername] != null) {
                  ws.otherUsername = data.otherUsername
                  sendTo(users[data.otherUsername], {
                    type: 'offer',
                    offer: data.offer,
                    username: ws.username
                  })
                }
                break
              case 'answer':
                console.log('Sending answer to: ', data.otherUsername)
                if (users[data.otherUsername] != null) {
                  ws.otherUsername = data.otherUsername
                  sendTo(users[data.otherUsername], {
                    type: 'answer',
                    answer: data.answer
                  })
                }
                break
              case 'candidate':
                console.log('Sending candidate to:', data.otherUsername)
                if (users[data.otherUsername] != null) {
                  sendTo(users[data.otherUsername], {
                    type: 'candidate',
                    candidate: data.candidate
                  })
                }
                break
              case 'close':
                if(users[data.otherUsername]) {
                  console.log('Disconnecting from', data.otherUsername)
                  users[data.otherUsername].otherUsername = null
                }
        
                if (users[data.otherUsername] != null) {
                  sendTo(users[data.otherUsername], { type: 'close' })
                }
        
                break
        
              default:
                sendTo(ws, {
                  type: 'error',
                  message: 'Command not found: ' + data.type
                })
        
                break
            }
          })
        
          ws.on('close', () => {
            if (ws.username) {
              console.log('Disconnecting from',ws.username)
              Clients = Clients.filter(item => item.username !== ws.username)
              UserList = Array.from(UserSet)
              UserList = UserList.filter(item => item !== ws.username)
              delete users[ws.username]
        
              Clients.map(el => {
                sendTo(el, { updatedUserList : UserList })
              })
            }
        
            if (ws.otherUsername) {
              console.log('Disconnecting from',ws.otherUsername)
        
              Clients = Clients.filter(item => item.username !== ws.username)
              UserList = Array.from(UserSet)
              UserList = UserList.filter(item => item !== ws.username)
              delete users[ws.username]
        
              if(users[ws.otherUsername]){
                users[ws.otherUsername].otherUsername = null
              }
        
              Clients.map(el => {
                sendTo(el, { updatedUserList : UserList })
              })
        
              if (users[ws.otherUsername] != null) {
                sendTo(users[ws.otherUsername], { type: 'close' })
                Clients.map(el => {
                  sendTo(el, { updatedUserList : UserList })
                })
              }
            }
          })
    });
}