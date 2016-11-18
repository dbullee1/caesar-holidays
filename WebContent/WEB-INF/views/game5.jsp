<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2.0">
<title>Caesar Feestdagen</title>
<script  type="text/javascript" src="../resources/js/jquery-3.1.1.min.js"></script>
<link rel="stylesheet" href="../resources/css/style.css"></link>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="../resources/css/bootstrap.min.css"></link>

<!-- Optional theme -->
<link rel="stylesheet" href="../resources/css/bootstrap-theme.min.css"></link>
<script type="text/javascript" src="../resources/js/Ball.js"></script>
<script type="text/javascript" src="../resources/js/Platform.js"></script>

<!-- Latest compiled and minified JavaScript -->
<script src="../resources/js/bootstrap.min.js"></script>
	
<script  type="text/javascript" src="../resources/js/phaser.js"></script>	
</head>
<body>
	<script type="text/javascript">
		var theme = "${theme}";
	</script>
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
		<script src="../resources/js/game5.js"></script>
</body>
</html>
