
document.getElementById("sendBtn").addEventListener("click", () => {
    event.preventDefault();

    const message = document.getElementById("messageInput").value;
    addUserMessage(message)

    alert("תודה! הודעתך נקלטה בהצלחה")
}); 

document.getElementById("backBtn").addEventListener("click", () => {
    event.preventDefault();
    window.history.go(-1);
}); 