
document.getElementById("sendBtn").addEventListener("click", () => {
    event.preventDefault();

    const message = document.getElementById("messageInput").value;
    const email = getCurrentUserFromLocalStorage() ? getCurrentUserFromLocalStorage().email : "אורח"; 
    fetch(`/api/addcontactusmessage?message=${message}&email=${email}`).then(response=>{
        if(response.ok){
            alert("תודה! הודעתך נקלטה בהצלחה")
        }
        else{
            alert("הודעתך לא נקלטה ")

        }
    })
    // addUserMessage(message)

    // alert("תודה! הודעתך נקלטה בהצלחה")
}); 

document.getElementById("backBtn").addEventListener("click", () => {
    event.preventDefault();
    window.history.go(-1);
}); 