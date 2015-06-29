

var RealtimeGraph = function(){

	var palette = new Rickshaw.Color.Palette( { scheme: [
        "#7f1c7d",
 		"#00b2ef",
		"#00649d",
		"#00a6a0",
		"#ee3e96"
    ] } );

	// function to invoke Rickshaw and plot the graph
	this.drawGraph = function(seriesData)
	{
		
		console.log("Draw Graph");
		// instantiate our graph!
		this.palette = palette;

		this.graph = new Rickshaw.Graph( {
			element: document.getElementById("chart"),
			width: 900,
			height: 300,
			renderer: 'line',
			stroke: true,
			preserve: true,
			series: seriesData	
		} );

		this.graph.render();

		this.hoverDetail = new Rickshaw.Graph.HoverDetail( {
			graph: this.graph,
			xFormatter: function(x) {
				return new Date(x * 1000).toString();
			}
		} );

		this.annotator = new Rickshaw.Graph.Annotate( {
			graph: this.graph,
			element: document.getElementById('timeline')
		} );

		this.legend = new Rickshaw.Graph.Legend( {
			graph: this.graph,
			element: document.getElementById('legend')

		} );

		this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
			graph: this.graph,
			legend: this.legend
		} );

		this.order = new Rickshaw.Graph.Behavior.Series.Order( {
			graph: this.graph,
			legend: this.legend
		} );

		this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
			graph: this.graph,
			legend: this.legend
		} );

		this.smoother = new Rickshaw.Graph.Smoother( {
			graph: this.graph,
			element: document.querySelector('#smoother')
		} );

		this.ticksTreatment = 'glow';

		this.xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: this.graph,
			ticksTreatment: this.ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		this.xAxis.render();

		this.yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: this.graph,
			tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment: this.ticksTreatment
		} );

		this.yAxis.render();


		this.controls = new RenderControls( {
			element: document.querySelector('form'),
			graph: this.graph
		} );

	}

	this.graphData = function(data)
	{
				console.log("call Graph Data");

		var key = 0;
		var seriesData = [];
		var timestamp = Date.now()/1000;
		var maxPoints = 25; 
		for (var j in data.d)
		{
			if (typeof data.d[j] !== 'string') {
			this.graph.series[key].data.push({x:timestamp,y:data.d[j]});
			if (this.graph.series[key].data.length > maxPoints)
			{
				this.graph.series[key].data.splice(0,1);//only display up to maxPoints
			}
			key++;
		}
		}
		
		this.graph.series[key].data.push({x:timestamp,y:data});
		
			if (this.graph.series[key].data.length > maxPoints)
			{
				this.graph.series[key].data.splice(0,1);//only display up to maxPoints
			}
		
		this.graph.render();	
	}

	this.displayChart = function(device,data){
		console.log("call Display CHart");

		var key = 0;
		var seriesData = [];
		var timestamp = Date.now()/1000;
		for (var j in data.d)
		{
			if (typeof data.d[j] !== 'string') {
			seriesData[key]={};
			seriesData[key].name=j;
			seriesData[key].color = palette.color();
			seriesData[key].data=[];

			seriesData[key].data[0]={};
			seriesData[key].data[0].x = timestamp;
			seriesData[key].data[0].y = data.d[j];
			key++;
		}
		}
	       seriesData[key]={};
			seriesData[key].name=key;
			seriesData[key].color = palette.color();
			seriesData[key].data=[];

			seriesData[key].data[0]={};
			seriesData[key].data[0].x = timestamp;
			seriesData[key].data[0].y = data;
			key++;
		this.drawGraph(seriesData);
	}

};
