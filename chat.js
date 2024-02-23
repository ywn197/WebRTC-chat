class Chat {
    constructor(){
    this.chatField = document.getElementById("chat");
    this.tokenField = document.getElementById("myToken")
    this.friendsTokenField = document.getElementById("friendsToken");
    this.reciveMessage("system: test message");
    this.messageField = document.getElementById("chatInput");

    
    document.getElementById("inputTokenButton").onclick = () => {
      this.offer = document.getElementById("inputToken").value;
      this.rc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
});
      this.rc.onicecandidate = e => this.#showMyToken(JSON.stringify(this.rc.localDescription));
      this.rc.ondatachannel = e => {
        this.rc.dc = e.channel;
	      this.rc.dc.onmessage = e => this.reciveMessage(e.data);
	      this.rc.dc.onopen = e => this.reciveMessage("system: Connection Opened");
      }
	    this.rc.setRemoteDescription(JSON.parse(this.offer)).then(e => this.reciveMessage("system: offer seted"));
	    this.rc.createAnswer().then(a => this.rc.setLocalDescription(a)).then(a => this.reciveMessage("system: Answer created"));


      document.getElementById("chatSubmit").onclick = () => {
        this.sendMessage(this.rc.dc,this.messageField.value);
      }
    }

    document.getElementById("makeASesstion").onclick = () => {
      this.lc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
});
      this.dc = this.lc.createDataChannel("channel");
	    this.dc.onmessage = e => this.reciveMessage(e.data);
	    this.dc.onopen = e => this.reciveMessage("system: connection opened")
	    this.lc.onicecandidate = e => this.#showMyToken(JSON.stringify(this.lc.localDescription)); this.lc.createOffer().then(o => this.lc.setLocalDescription(o)).then(a => this.reciveMessage("system: set successfully!"));

      document.getElementById("inputTokenButton").onclick = () => {
        this.answer = document.getElementById("inputToken").value;
	console.log(this.answer);
	this.lc.setRemoteDescription(JSON.parse(this.answer));
	
	document.getElementById("chatSubmit").onclick = () => {
	  this.sendMessage(this.dc,this.messageField.value);
        }
	
      }
    } 

  }

  reciveMessage(message){

    let newELement =  document.createElement('div');
    newELement.textContent = message;
    newELement.className = "recived";
    this.chatField.appendChild(newELement);
  }

  #showMyToken(token){
	  document.getElementById("mine").style = "display: inline-block"
    this.tokenField.value = token;
  }
  
  sendMessage(connection,text){
    connection.send(text);
    let newELement =  document.createElement('div');
    newELement.textContent = text;
    newELement.className = "sent"
    this.chatField.appendChild(newELement);

  }

}

