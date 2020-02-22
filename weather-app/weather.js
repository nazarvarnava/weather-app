window.onload = function() {
	//zmienne
	var ipUrl = "https://ipinfo.io/json";	
	console.log('ipUrl', ipUrl);
	var ipUrl2 = { 
		city: "Rzeszów",
		country: "PL",
		ip: "91.225.202.7",
		loc: "49.8383,24.0232",
		org: "AS49824 PC Astra-net'",
		postal: "35303",
		readme: "https://ipinfo.io/missingauth",
		region: "Rzeszow",
		timezone: "Europe/Warsaw",
	};
	var appid = "appid=8e1880f460a20463565be25bc573bdc6";
	var location = document.getElementById("location");	
	var currentDate = new Date();
	var dayNight = "day";	

	//wstawianie daty
	var dateElem = document.getElementById("date");
	dateElem.innerHTML = currentDate.toDateString();

	//wyzywanie funkcji ipinfo.io/json 
	httpReqIpAsync(ipUrl);							

	//request do ipinfo.io/json
	function httpReqIpAsync(url, callback) {
		var httpReqIp = new XMLHttpRequest();
		httpReqIp.open("GET", url, true)
		httpReqIp.onreadystatechange = function() {
			if(httpReqIp.readyState == 4 && httpReqIp.status == 200) {
				var jsonIp = ipUrl2;
				console.log('jsonIp', jsonIp);
				var ip = jsonIp.ip;
				var city = jsonIp.city;
				var country = jsonIp.country;
				location.innerHTML = `${city}, ${country}`;
				var lat = jsonIp.loc.split(",")[0];
				var lon = jsonIp.loc.split(",")[1];
				console.log(lat+" "+lon)
				var currentWeatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${appid}&lang=pl`;
				//wyzywanie funkcji openweathermap api 
				currentWeather(currentWeatherApi);
				// console.log('test', test);

				var town = 'Rzeszow';
				var forcastWeatherApi = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${town}&units=metric&${appid}&cnt=5`;
				forcastWeather(forcastWeatherApi);
				// console.log('test', test);
			}
		}
		httpReqIp.send();			
	}
	
	//request do openweathermap.com json
	function currentWeather(url, callback) {
		var httpReqWeather = new XMLHttpRequest();
		httpReqWeather.open("GET", url, true);
		httpReqWeather.onreadystatechange = function() {
			if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
				console.log('response test', httpReqWeather);
				var jsonWeather = JSON.parse(httpReqWeather.responseText);
				console.log(jsonWeather)
				var weatherDesc = jsonWeather.weather[0].description;
				var id = jsonWeather.weather[0].id;
				var icon = `<i class="wi wi-owm-${id}"></i>`
				var temperature = jsonWeather.main.temp;
				var tempFaren = Math.round(temperature - 273)
				
				var humidity = jsonWeather.main.humidity;
				var windSpeed = jsonWeather.wind.speed; 
				//Konwertacja Widocnosci
				var visibility = Math.round(jsonWeather.visibility / 1000);
				

				//Wyznacznie czy to jest dzien czy noc
				var sunSet = jsonWeather.sys.sunset;
				
				var timeNow = Math.round(currentDate / 1000);
				console.log(timeNow + "<" + sunSet +" = "+(timeNow < sunSet))
				dayNight = (timeNow < sunSet) ? "day" : "night";
				//Wstawianie do html 
				var description = document.getElementById("description");
				description.innerHTML = `<i id="icon-desc" class="wi wi-owm-${dayNight}-${id}"></i><p>${weatherDesc}</p>`;
				var tempElement = document.getElementById("temperature");
				tempElement.innerHTML = `${tempFaren}<i id="icon-thermometer" class="wi wi-thermometer"></i>`	;
				var humidityElem = document.getElementById("humidity");
				humidityElem.innerHTML = `${humidity}%`;
				var windElem = document.getElementById("wind");
				windElem.innerHTML = `${windSpeed}km/h`;
				var visibilityElem = document.getElementById("visibility");
				visibilityElem.innerHTML = `${visibility} km`;
			}
		}
		httpReqWeather.send();
	}
	
	function forcastWeather(url, callback) {
		var httpReqWeather = new XMLHttpRequest();
		httpReqWeather.open("GET", url, true);
		httpReqWeather.onreadystatechange = function() {
			if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
				console.log('response test', httpReqWeather);
				var jsonWeatherForcast = JSON.parse(httpReqWeather.responseText).list;

				// console.log('moment', moment().format());
				console.log('jsonWeatherForcast', jsonWeatherForcast);

				var ourHtmlGenerated = '';
				for(var i = 1; i <= 5; i++) {
					var responseDate = new Date(jsonWeatherForcast[i-1].dt * 1000).toISOString().slice(0, 19).replace('T', ' ');


					ourHtmlGenerated += `
						<section class="card animate-flip animate-flip-card-${i}">
							<header>
								<h1 class="card-header">${moment(responseDate).format('DD.MM')}</h1>
							</header>
							<p class="card-temp box-highlight">${Math.round(jsonWeatherForcast[i-1].temp.day)}</p>
							<div class="icon">
								<div class="cloud-group">
									<span class="icon-cloud cloud-circle shadow-cloud-clip"></span>
									<span class="icon-cloud cloud-base shadow-cloud-clip"></span>
									<div class="rain-group">
										<span class="icon-cloud ${(jsonWeatherForcast[i-1].weather[0].main).toLowerCase()}"></span>
									</div>
								</div>
							</div>
							<p class="card-info"></p>
						</section>
					`;
					console.log(ourHtmlGenerated);
				}

				var weatherContainer = document.getElementById("weatherContainer");
				weatherContainer.innerHTML = ourHtmlGenerated;
			}
		}
		httpReqWeather.send();
	}				
}