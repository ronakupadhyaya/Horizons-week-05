var Restaurant = require("./models/models").Restaurant

var restaurants = [{"name":"Revolution Taco","category":"Mexican","rating":4,"latitude":39.95083,"longitude":-75.1743,"open":4,"close":13},{"name":"Buena Onda","category":"Mexican","rating":4,"latitude":39.9606589972973,"longitude":-75.170174986124,"open":0,"close":19},{"name":"Cucina Zapata","category":"Food Stands","rating":4.5,"latitude":39.9542694,"longitude":-75.1854935,"open":1,"close":17},{"name":"Dos Tacos","category":"Mexican","rating":3.5,"latitude":39.9505718076738,"longitude":-75.165792960935,"open":3,"close":23},{"name":"El Rey","category":"Mexican","rating":3.5,"latitude":39.952419,"longitude":-75.173996,"open":9,"close":12},{"name":"Quetzally","category":"Mexican","rating":4,"latitude":39.9416084289551,"longitude":-75.1631088256836,"open":10,"close":21},{"name":"Cafe Ynez","category":"Mexican","rating":4.5,"latitude":39.9394117528025,"longitude":-75.177328118915,"open":4,"close":23},{"name":"Rosewood Tex-Mex","category":"Tex-Mex","rating":4,"latitude":39.9488602,"longitude":-75.1623611,"open":10,"close":16},{"name":"Tio Flores","category":"Mexican","rating":3.5,"latitude":39.94392,"longitude":-75.1688999,"open":8,"close":21},{"name":"Lolita","category":"Mexican","rating":4,"latitude":39.950080871582,"longitude":-75.16206354826,"open":10,"close":20},{"name":"Tequilas","category":"Mexican","rating":4,"latitude":39.9483909606934,"longitude":-75.168098449707,"open":7,"close":17},{"name":"El Jarocho","category":"Mexican","rating":4,"latitude":39.936492,"longitude":-75.165011,"open":10,"close":22},{"name":"Jose Pistola's","category":"Mexican","rating":3.5,"latitude":39.9476623535156,"longitude":-75.1661605834961,"open":6,"close":14},{"name":"La Calaca Feliz","category":"Mexican","rating":4,"latitude":39.9675407,"longitude":-75.1760483,"open":4,"close":20},{"name":"Los Camaradas","category":"Mexican","rating":4,"latitude":39.940803527832,"longitude":-75.1797714233398,"open":0,"close":12},{"name":"El Vez","category":"Mexican","rating":4,"latitude":39.94981,"longitude":-75.16176,"open":0,"close":14},{"name":"Tortilleria San Roman","category":"Mexican","rating":5,"latitude":39.9376373291016,"longitude":-75.1579818725586,"open":4,"close":16},{"name":"Tacos Don Memo","category":"Mexican","rating":4.5,"latitude":39.951988,"longitude":-75.199123,"open":4,"close":13},{"name":"Tacos El Rodeo","category":"Food Trucks","rating":4.5,"latitude":39.9368281572815,"longitude":-75.1602197256065,"open":7,"close":20},{"name":"Taqueria La Veracruzana","category":"Mexican","rating":4,"latitude":39.93613,"longitude":-75.15913,"open":3,"close":20}, {"name":"Lazaro's Pizzeria & Grill","category":"Pizza","rating":4,"latitude":39.9444520955819,"longitude":-75.1717805086004,"open":6,"close":18},{"name":"Gusto Pizzeria","category":"Pizza","rating":4,"latitude":39.9492979,"longitude":-75.1778217,"open":9,"close":16},{"name":"Dolce Carini","category":"Pizza","rating":3.5,"latitude":39.95227,"longitude":-75.17291,"open":5,"close":18},{"name":"Pizzeria Vetri","category":"Pizza","rating":4,"latitude":39.9494108300057,"longitude":-75.1686977423011,"open":4,"close":14},{"name":"Pizzeria Vetri","category":"Pizza","rating":4,"latitude":39.9607767,"longitude":-75.1712674,"open":8,"close":22},{"name":"Snap Custom Pizza - Center City","category":"Pizza","rating":4.5,"latitude":39.9502013,"longitude":-75.1660153,"open":2,"close":18},{"name":"Giovani's Bar & Grill","category":"Bars","rating":4.5,"latitude":39.9512544989418,"longitude":-75.1666958385663,"open":5,"close":17},{"name":"Randazzo's Pizzeria","category":"Pizza","rating":4,"latitude":39.9444927907103,"longitude":-75.1726122757187,"open":10,"close":19},{"name":"Zavino","category":"Italian","rating":4,"latitude":39.94994,"longitude":-75.16217,"open":0,"close":18},{"name":"Zavino","category":"Pizza","rating":4.5,"latitude":39.953393,"longitude":-75.1886942,"open":2,"close":22},{"name":"Barbuzzo","category":"Mediterranean","rating":4.5,"latitude":39.9499893,"longitude":-75.1621628,"open":0,"close":22},{"name":"Nomad Roman Pizza","category":"Pizza","rating":4,"latitude":39.9480175237328,"longitude":-75.1626882640886,"open":1,"close":18},{"name":"Rosa's Fresh Pizza","category":"Pizza","rating":4.5,"latitude":39.9508307129145,"longitude":-75.1584262400866,"open":9,"close":22},{"name":"Pietro's Coal Oven Pizzeria","category":"Pizza","rating":3.5,"latitude":39.9497337341309,"longitude":-75.1699676513672,"open":7,"close":21},{"name":"Kosmo Pizza & Grille","category":"Pizza","rating":4.5,"latitude":39.943821,"longitude":-75.1653107,"open":8,"close":12},{"name":"Slice","category":"Pizza","rating":3.5,"latitude":39.950741,"longitude":-75.170166,"open":10,"close":17},{"name":"Pete's Famous Pizza","category":"Pizza","rating":3.5,"latitude":39.956356048584,"longitude":-75.1747589111328,"open":3,"close":13},{"name":"Mix Brick Oven Pizza","category":"Pizza","rating":3.5,"latitude":39.95261,"longitude":-75.1757499,"open":6,"close":20},{"name":"Joe's Pizza","category":"Pizza","rating":3.5,"latitude":39.9503937,"longitude":-75.1675568,"open":8,"close":22},{"name":"Mama Palma's Gourmet Pizza","category":"Pizza","rating":3.5,"latitude":39.94879,"longitude":-75.17814,"open":4,"close":18}, {"name":"IndeBlue","category":"Indian","rating":4.5,"latitude":39.9485246190769,"longitude":-75.162158632466,"open":3,"close":12},{"name":"Spice End","category":"Indian","rating":3.5,"latitude":39.9519004821777,"longitude":-75.1738052368164,"open":5,"close":23},{"name":"Indian Cuisine","category":"Indian","rating":4,"latitude":39.955609432984,"longitude":-75.172937111582,"open":8,"close":23},{"name":"Masala Kitchen Kati Rolls and Platters","category":"Indian","rating":4.5,"latitude":39.9490755,"longitude":-75.1609568,"open":11,"close":21},{"name":"Indian Restaurant","category":"Indian","rating":3.5,"latitude":39.9440308,"longitude":-75.1699524,"open":10,"close":13},{"name":"Philadelphia Chutney Company","category":"Indian","rating":3.5,"latitude":39.950592272055,"longitude":-75.168461936478,"open":10,"close":19},{"name":"Mumbai Bistro","category":"Indian","rating":4,"latitude":39.947182,"longitude":-75.157257,"open":9,"close":16},{"name":"King of Tandoor","category":"Indian","rating":3.5,"latitude":39.96038,"longitude":-75.16935,"open":0,"close":16},{"name":"Cafe Spice Express","category":"Indian","rating":4,"latitude":39.9516337505558,"longitude":-75.1683872219849,"open":8,"close":19},{"name":"Minar Palace","category":"Indian","rating":3.5,"latitude":39.949063080509,"longitude":-75.162440039441,"open":6,"close":23},{"name":"Sitar India","category":"Indian","rating":4,"latitude":39.9556956060509,"longitude":-75.1985801107948,"open":10,"close":22},{"name":"Imli Indian Kitchen","category":"Indian","rating":4.5,"latitude":39.9387742,"longitude":-75.1524094,"open":2,"close":15},{"name":"New Delhi Indian Restaurant","category":"Indian","rating":4,"latitude":39.9553909301758,"longitude":-75.2026138305664,"open":1,"close":20},{"name":"Karma Restaurant & Bar","category":"Indian","rating":4,"latitude":39.9480323791504,"longitude":-75.1431579589844,"open":7,"close":18},{"name":"Spice End: Food Truck","category":"Indian","rating":5,"latitude":39.9574,"longitude":-75.1895399,"open":1,"close":22},{"name":"Tiffin Bistro","category":"Indian","rating":3,"latitude":39.9347011,"longitude":-75.1622226,"open":11,"close":19},{"name":"Cafe India","category":"Indian","rating":4,"latitude":39.9421745538712,"longitude":-75.1507651805878,"open":4,"close":20},{"name":"Tandoor Authentic Indian Restaurant","category":"Indian","rating":3.5,"latitude":39.9551144,"longitude":-75.202451,"open":2,"close":22},{"name":"Nanee's Kitchen","category":"Indian","rating":3,"latitude":39.9531334,"longitude":-75.1594228,"open":2,"close":13},{"name":"Dana Mandi","category":"Grocery","rating":4,"latitude":39.956478,"longitude":-75.206931,"open":5,"close":22}]

restaurants.forEach(function(restaurant){

/*
	EDIT CODE BELOW TO MATCH THE FIELD NAMES IN YOUR RESTAURANT MODEL 
*/ 

	var restaurant = new Restaurant({
		"name": restaurant.name,
		// MAKE SURE TO UPDATE YOUR ENUMS TO 
		// ["Mexican", "Food Stands", "Tex-Mex", "Food Trucks", "Pizza", "Bars", "Italian", "Mediterranean", "Indian", "Grocery"]
		"category" : restaurant.category,
		"rating" : restaurant.rating,
		"latitude" : restaurant.latitude,
		"longitude" : restaurant.longitude,
		"open" : restaurant.open,
		"close" : restaurant.close,
		"totalScore": restaurant.rating,
		"reviewsCount": 1,
		"price" : Math.floor(Math.random() * 4 )+1,
	})

	restaurant.save(function(err){
		if(err){
			console.log(err)
		} else {
			console.log("saved restaurant");	
		}
		
	})

})