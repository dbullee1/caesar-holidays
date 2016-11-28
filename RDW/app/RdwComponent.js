(function(app) {
  app.RdwComponent =
    ng.core.Component({
      selector: 'rdw-search',
      template: `Kenteken <input class="license-search" type="text" #search (keyup.enter)="getResult(search.value)" name="license-plate"> 
	  <div class="license-result"></div>`
    })
    .Class({
		constructor: function() {
			this.licenseUrl = "https://opendata.rdw.nl/resource/m9d7-ebf2.json";
		},
	  
		getResult(searchValue) {
			let resultContainer = document.getElementsByClassName("license-result")[0];
			let cleanedLicenseValue =  searchValue.replace(new RegExp("-", 'g'), "").toUpperCase();
			var data = $.ajax({
				url: this.addRequestParameter(this.licenseUrl, "kenteken", cleanedLicenseValue),
				dataType: "json",
			});
			data.done(function(data) {
				if(data.length > 0) {
					let carData = data[0];
					let resultData = document.createElement("div");
					let dataString = "";
					for (var property in carData) {
						if (carData.hasOwnProperty(property)) {
							dataString += property +":"+ carData[property] + "<br />";
						}
					}
					resultContainer.innerHTML = dataString;
				}
				
			});
		},
		
		addRequestParameter(url, key, value) {
			if(url.indexOf("?") > -1) {
				url += "&" ;
			} else {
				url += "?";
			}
			return url + key + "=" + value;
		}
	  
    });
})(window.app || (window.app = {}));
