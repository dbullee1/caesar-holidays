<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Caesar Feestdagen</title>
<script  type="text/javascript" src="../resources/js/jquery-3.1.1.min.js"></script>
<link rel="stylesheet" href="../resources/css/style.css"></link>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="../resources/css/bootstrap.min.css"
	integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"></link>

<!-- Optional theme -->
<link rel="stylesheet" href="../resources/css/bootstrap-theme.min.css"
	integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"></link>

<!-- Latest compiled and minified JavaScript -->
<script src="../resources/js/bootstrap.min.js"
	integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"></script>
	
<script  type="text/javascript" src="../resources/js/phaser.js"></script>	
</head>
<body>
		<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed"
						data-toggle="collapse" data-target="#navbar" aria-expanded="false"
						aria-controls="navbar">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
					<div class="navbar-brand">
						<a href="./index">Caesar Holidays</a>
					</div>
				</div>
				<div id="navbar" class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li><a href="./index">Home</a></li>
						<li class="active"><a href="#">Game</a></li>
						<li><a href="./about">About</a></li>
					</ul>
				</div>
			</div>
		</nav>
		<div id="game" class="game"></div>
		<audio class="audio" preload="auto">
		  	<source src="../resources/sounds/auw.mp3" type="audio/mpeg">
		</audio>
		<script src="../resources/js/game.js"></script>
</body>
</html>
