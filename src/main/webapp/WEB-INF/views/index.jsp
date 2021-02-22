<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/css/index.css">
		<link rel="stylesheet" media="only screen and (max-device-width: 880px)" href="/css/index.mobile.css">
		<script src="/js/index.js" type="module"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="/webjars/sockjs-client/sockjs.min.js"></script>
    	<script src="/webjars/stomp-websocket/stomp.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
		<title>ACNH: Turnips</title>
	</head>
	<body>
		<div class="blackOverlay"></div>

		<div class="rulesAndFaq">
			<a href="#" id="linkRules">Rules</a>
			<p>|</p>
			<a href="#" id="linkFAQ">FAQ</a>
		</div>

		<div class="pages">
			<%@include file="includes/mainPage.jsp" %>

			<%@include file="includes/host.jsp" %>

			<%@include file="includes/island.jsp" %>

			<%@include file="includes/islands.jsp" %>
		</div>
		
		<div class="footer">
			<p>
				Developed with &#x1F496; by <a href="https://www.linkedin.com/in/johnnybueti/"><strong>Johnny Bueti</strong></a> for <strong>Giovanni Grasso & Kristian Reale</strong>, Universita' della Calabria. This website is <strong>not</strong> primarily intended for or directed towards commercial advantage or monetary compensation: it is otherwise intended for academic purposes exclusively.
			</p>
		</div>

		<div class="modal" id="modalRules">
			<h1>Rules &#x2696;</h1>
			<ul>
				<li>Promoting your social media is perfectly fine.</li>
				<li>Just don't ask players to like, follow or subscribe in exchange for skipping the queue. Not cool.</li>
				<li>Be kind and respectful.</li>
				<li>Anything illegal and you're out.</li>
			</ul>
		</div>

		<div class="modal" id="modalFAQ">
			<h1>FAQ &#x2696;</h1>
			<ul>
				<li>
					<p>
						<strong>What the duck is this?</strong>
						ACNH: Turnips! Share you Dodo Code with hundreds of players without having them access all at once. That can be madness and not a very pleasant experience for players.
					</p>
				</li>
				<li>
					<p>
						<strong>Can I... ?</strong>
						Probably yes. Unless it's illegal, like for example trading a spot in queue for a soul. Or a leg. You choose.
					</p>
				</li>
				<li>
					<p>
						<strong>THE ISLAND WAS DELETED, I WAITED 10 HOURS?!</strong>
						Up to the host. They chose to open up their island so that hundreds of players could join. <strong>For free</strong>.
					</p>
				</li>
			</ul>
		</div>

		<div class="modal" id="modalError">
			<h1>Error</h1>
			<p id="errorText"></p>
		</div>

		<div class="modal" id="modalNotice">
			<h1>Notice</h1>
			<p></p>
		</div>

		<div class="modal" id="modalJoin">
			<h1>Let us know your in-game name.</h1>
			<div class="section">
				<input type="text" id="inGameNameInput">
			</div>
			<div class="actions">
				<button class="btn btnCancel">Cancel</button>
				<button class="btn btnJoin">Join</button>
			</div>
		</div>

		<div class="modal" id="modalLeave">
			<h1>Are you sure?</h1>
			<p>Once you leave, your position is irrequivocably lost! Click on the "Leave" button to leave the queue.</p>
			<div class="actions">
				<button class="btn btnCancel">Cancel</button>
				<button class="btn btnLeave">Leave</button>
			</div>
		</div>

		<div class="audio btn">
			<span class="play">&#x23F5;</span>
			<span class="pause">&#x23F8;</span>
		</div>
	</body>
</html>