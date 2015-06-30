
var subscribeTopic = "";

var Realtime = function(orgId, api_key, auth_token ,sensorTopic) {

	var firstMessage = true;

	//var clientId="a:"+orgId+":" +Date.now();
	var clientId="a:"+"EGYIOT"+":" +Date.now();

	console.log("clientId: " + clientId);
	//var hostname = orgId+".messaging.internetofthings.ibmcloud.com";
	var hostname="broker.mqtt-dashboard.com";
		//var hostname="localhost";

	var client;

	this.initialize = function(){
console.log("Initialize realtime chart");
		client = new Messaging.Client(hostname, 8000,clientId);

		// Initialize the Realtime Graph
		var rtGraph = new RealtimeGraph();
		client.onMessageArrived = function(msg) {
			console.log("Hit Real time data 12");

			var topic = msg.destinationName;
			
			var payload = JSON.parse(msg.payloadString);
			 var minThreshold,maxThreshold;
			 console.log("Min Threshold "+window.minThreshold + " Max Threshold "+window.maxThreshold);
			 if(parseFloat(payload) < parseFloat(window.minThreshold) ||parseFloat(payload) > parseFloat(window.maxThreshold)) {
				  var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'js/realtime/audio.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        //audioElement.load()

        $.get();

            audioElement.play();
     
				 
				 
				 
		 }
			
			
			
			
			
			//payload=10;
			console.log("Message Arrived "+msg.payloadString);
			//First message, instantiate the graph  
		    if (firstMessage) {
		    	$('#chart').empty();
		    	firstMessage=false;
		    	rtGraph.displayChart(null,payload);
				console.log("Display chart for first time")
		    } else {
		    	rtGraph.graphData(payload);
								console.log("Display chart for second time")

		    }
		};

		client.onConnectionLost = function(e){
			console.log("Connection Lost at " + Date.now() + " : " + e.errorCode + " : " + e.errorMessage);
			this.connect(connectOptions);
		}

		var connectOptions = new Object();
		connectOptions.keepAliveInterval = 3600;
		connectOptions.useSSL=false;
		//connectOptions.userName=api_key;
		//connectOptions.password=auth_token;

		connectOptions.onSuccess = function() {
			console.log("MQTT connected to host: "+client.host+" port : "+client.port+" at " + Date.now());
		}

		connectOptions.onFailure = function(e) {
			console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
		}

		console.log("about to connect to " + client.host);
		client.connect(connectOptions);
	}

	// Subscribe to the device when the device ID is selected.
	this.plotRealtimeGraph = function(){
		console.log("plot realtime chart");

		var subscribeOptions = {
			qos : 0,
			onSuccess : function() {
								console.log("subscribed  before error ");

				console.log("subscribed to " + subscribeTopic);
			},
			onFailure : function(){
				console.log("Failed to subscribe to " + subscribeTopic);
				console.log("As messages are not available, visualization is not possible");
			}
		};
										console.log("subscribed  before error 222");

	   var itemSelected = $("#deviceslist option:selected").last();
		var item = itemSelected.val();
		if(itemSelected.index() != 0){
			var sensorData=item.split("|");
			item=sensorData[0];
					console.log(" Item Index "+itemSelected.index() + "item "+item);

			
		}
		

		
		var tokens = item.split(':');
		if(subscribeTopic != "") {
											console.log("subscribed  before error 555 ");

			console.log("Unsubscribing to " + subscribeTopic);
			client.unsubscribe(subscribeTopic);
		}

		//clear prev graphs
		$('#chart').hide(function(){ 
										console.log("subscribed  before error 666 ");

			$('#chart').empty(); 
			$('#chart').show();
			$('#chart').append(imageHTML);
		});
		
		$('#timeline').empty();
		$('#legend').empty();
		firstMessage = true;

		//subscribeTopic = "iot-2/type/" + tokens[2] + "/id/" + tokens[3] + "/evt/+/fmt/json";
	//subscribeTopic="project4fun/temp";


	subscribeTopic=item;
	

		
		client.subscribe(subscribeTopic,subscribeOptions);
	}

	this.initialize();

	var imageHTML = '<div class="iotdashboardtext">The selected device is not currently sending events to the Internet of Things Plateform</div><br><div class="iotdashboardtext">Select to view historical data or select a different device.</div> <img class="iotimagesMiddle" align="middle" alt="Chart" src="images/IOT_Icons_Thing02.svg">';
}
