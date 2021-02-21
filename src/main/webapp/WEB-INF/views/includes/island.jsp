<div class="islandPage page" pagename="island">
	<div class="wrapper">
		<div class="boxContainer">
			<div class="back">
				<button class="btn btnBack">Back</button>
			</div>

			<div class="header">
				<div class="title">
					<span class="islandName">Island name here</span>
					<span class="locked">&#x1F512;</span>
				</div>
				<div class="islandInfo">
					<div class="fruitImage icon" fruit="apple"></div>
					<span class="separator">|</span>
					<div class="turnipsImage icon"></div>
					<span class="price">123 Bells</span>
					<span class="separator">|</span>
					<span class="hemisphere">North</span>
				</div>
			</div>

			<div class="description">
<p>Hello, and Welcome to Weyard!
- Tips are NOT Required but any tips is appreciated
- Don't run into the flowers and don't steal
- You can shop, but ask me before
- If you want any fruit, ask me on Discord or Twitter
- To make other trip, quit the queue and come again
- Please, leave the island by the Airport!
/!\ For any question, ask me on Discord or Twitter /!\</p>
			</div>

			<div class="border-separator"></div>

			<div class="header visitorQueue">
				<div class="title">
					<span>Visitor Queue <small class="currentVisitors">3 / 3</small></span>
				</div>
				<div class="actions nonAdminActions">
					<button id="btnJoinQueue" class="btn">Join Queue</button>
					<button id="btnLeaveQueue" class="btn btnRed">Leave Queue</button>
				</div>
				<div class="actions adminActions">
					<button id="btnEditQueue" class="btn">Edit</button>
				</div>
			</div>

			<p class="visitorsDescription">This island allows for <span class="maxVisitors">0</span> visitor(s) at a time with a max queue size of <span class="maxLength">0</span>. Currently there are <span class="queuedUsers">0</span> visitor(s) in line.</p>

			<div class="visitors">
				<ul>
					<li>
						<span class="kick">X</span>
						<span class="position">1:</span>
						<span class="username">Username</span>
						<span class="timeSinceJoin">(35 minutes)</span>
					</li>
					<li>
						<span class="position">2:</span>
						<span class="username">Username</span>
						<span class="timeSinceJoin">(35 minutes)</span>
					</li>
					<li>
						<span class="position">3:</span>
						<span class="username">Username</span>
						<span class="timeSinceJoin">(35 minutes)</span>
					</li>
				</ul>
			</div>

			<li id="visitorTemplate">
				<span class="kick">X</span>
				<span class="position">1:</span>
				<span class="username">Username</span>
				<span class="timeSinceJoin">(35 minutes)</span>
			</li>

			<div class="border-separator separatorDodoCode"></div>
			<div class="dodoCodeSection">
				<h3>Here is your Dodo Code!</h3>
				<h1 id="dodoCode">12345</h1>
			</div>

			<div class="border-separator separator2"></div>

			<div class="currentPosition">
				<span>You are <strong class="position">#45</strong> of <span class="maxSize">50</span> in the queue.</span>
			</div>

			<div class="adminControls">
				<div class="actions">
					<button id="btnLockQueue" class="btn">Lock Queue</button>
					<button id="btnDestroyQueue" class="btn btnRed">Destroy Queue</button>
				</div>
			</div>
		</div>
	</div>
</div>