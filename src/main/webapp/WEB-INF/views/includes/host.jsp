<div class="hostPage page" pagename="host">
	<div class="wrapper">
		<div class="boxContainer">
			<div class="title">
				<span>Host Your Island: <strong>Step 1</strong></span>
			</div>

			<div class="description">
				<p>You are about to share your island with the whole world! Before starting, a little tip: if your NAT type is "A", there will be less chances for communication errors to take place!<br><br><strong>Let's get started with your Dodo Code!</strong></p>
			</div>

			<div class="section">
				<label for="dodoCodeInput">Dodo Code:</label><input type="text" id="dodoCodeInput" placeholder="ABCDE" maxlength="5">
			</div>

			<div class="actions">
				<button class="btn btnCancel">Cancel</button>
				<button class="btn btnNext">Next</button>
			</div>
		</div>
	</div>
</div>

<div class="hostPageStep2 page" pagename="hostStep2">
	<div class="wrapper">
		<div class="boxContainer">
			<div class="title">
				<span>Host Your Island: <strong>Step 2</strong></span>
			</div>

			<div class="islandName section">
				<label for="islandNameInput">Your Island Name:</label><input type="text" id="islandNameInput" placeholder="Island name">
			</div>

			<div class="maxVisitors section">
				<label for="maxVisitorsInput">Visitors <small>(number of concurrent visitors)</small>:</label><input type="number" id="maxVisitorsInput" value="3">
			</div>

			<div class="queueSize section">
				<label for="queueSizeInput">Size <small>(max. number of visitors)</small>:</label><input type="number" id="queueSizeInput" value="10">
			</div>

			<div class="turnips section">
				<label for="turnipsInput">Your Turnips Price:</label><input type="number" id="turnipsInput">
			</div>

			<div class="hemisphere section">
				<label for="hemisphere">Your Island Emisphere:</label>
				<select id="hemisphereSelect">
					<option value="northern">Northern</option>
					<option value="southern">Southern</option>
				</select>
			</div>

			<div class="fruit section">
				<label>Your Native Fruit:</label>
				<select id="nativeFruitSelect">
					<option value="apple">Apples</option>
					<option value="pear">Pears</option>
					<option value="cherry">Cherries</option>
					<option value="peach">Peaches</option>
					<option value="orange">Oranges</option>
				</select>
			</div>

			<div class="islandDescription section">
				<label for="islandDescriptionInput">Description:</label><textarea type="checkbox" id="islandDescriptionInput"></textarea>
			</div>

			<div class="privateListing section">
				<label for="privateListingCheckbox">Private Listing?</label><input type="checkbox" id="privateListingCheckbox">
			</div>

			<div class="actions">
				<button class="btn btnBack">Back</button>
				<button class="btn btnNext">Next</button>
			</div>
		</div>
	</div>
</div>