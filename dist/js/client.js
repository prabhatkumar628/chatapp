const socket = io("http://localhost:8000")
const user = prompt("Enter Name For Joined this Group")

socket.emit("joined", user)
const app = document.querySelector(".app")

const generateMSG = (message, side)=>{
    const msgBox = document.createElement("p")
    if(side ==  "left"){
        msgBox.classList.add("left")
    }else if(side == "right"){
        msgBox.classList.add("right")
    }else{
        msgBox.classList.add("center")
    }
    msgBox.innerText = message
    app.append(msgBox)
}

socket.on("new-user-joined", (user)=>{
    generateMSG(`${user} Joined this group`, "center")
})

socket.on("left", (user)=>{
    generateMSG(`${user} Left this group`, "center")
})

const sendMSG = ()=>{
    const input = document.getElementById("message")
    generateMSG(`${input.value}`, "right")
    socket.emit("send", input.value)
    input.value = ""
}

socket.on("receive", ({name, message})=>{
    generateMSG(`${name}: ${message}`, "left")

})