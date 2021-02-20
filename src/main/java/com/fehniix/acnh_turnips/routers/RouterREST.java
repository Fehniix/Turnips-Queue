package com.fehniix.acnh_turnips.routers;

import java.util.ArrayList;

import com.fehniix.acnh_turnips.FileIO;
import com.fehniix.acnh_turnips.Logger;
import com.fehniix.acnh_turnips.Queue;
import com.fehniix.acnh_turnips.Queues;
import com.fehniix.acnh_turnips.User;
import com.fehniix.acnh_turnips.model.QueueCreatedResponse;
import com.fehniix.acnh_turnips.model.QueueMeta;
import com.fehniix.acnh_turnips.model.DAOs.QueueDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RouterREST {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@GetMapping("/endpoint/pagesFolderContents")
	public final String[] pagesFolderContents() {
		ArrayList<String> contents = new ArrayList<String>(FileIO.getFileList("./src/main/resources/public/js/pages"));
		return contents.toArray(new String[0]);
	}

	@GetMapping("/test")
	public final ArrayList<Queue> test() {
		this.simpMessagingTemplate.convertAndSend("/topic/queue", "hello from Java!");
		Logger.log(AnsiColor.BRIGHT_GREEN, Queues.getInstance().test().size());
		return Queues.getInstance().test();
	}

	@PostMapping("/endpoint/createQueue")
	public final QueueCreatedResponse createQueue(
		@RequestParam String islandName, 
		@RequestParam String nativeFruit,
		@RequestParam Boolean _private,
		@RequestParam Integer turnips,
		@RequestParam String hemisphere,
		@RequestParam Integer maxLength,
		@RequestParam Integer maxVisitors,
		@RequestParam String dodoCode,
		@RequestParam String description) {
			//	We are safely assuming all required parameters have been filled, the request would have otherwise failed.
			QueueCreatedResponse queueCreatedResponse = Queues.getInstance().createQueue(maxLength, maxVisitors);
			
			QueueMeta qm = new QueueMeta();
			qm.islandName	= islandName;
			qm.nativeFruit	= nativeFruit;
			qm._private		= _private;
			qm.turnips		= turnips;
			qm.hemisphere	= hemisphere;
			qm.maxLength 	= maxLength;
			qm.maxVisitors 	= maxVisitors;
			qm.dodoCode		= dodoCode;
			qm.adminId		= queueCreatedResponse.queueId;
			qm.description	= description;
			qm.turnipCode	= queueCreatedResponse.turnipCode;
			QueueDAO.insertQueue(qm);

			return queueCreatedResponse;
	}

	@GetMapping("/endpoint/getQueue")
	public final Queue getQueue(@RequestParam String turnipCode) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

		if (queue == null) {
			Logger.log(AnsiColor.RED, "Queue not found.");
			
			throw new ResponseStatusException(HttpStatus.GONE, "The queue with Turnip Code: " + turnipCode + " was not found.");
		}

		return queue;
	}

	@GetMapping("/endpoint/getQueueMeta")
	public final QueueMeta getQueueMeta(@RequestParam String turnipCode) {
		return QueueDAO.getQueueByTurnipCode(turnipCode);
	}

	@PostMapping("/endpoint/userIsAdmin")
	public final Boolean userIsAdmin(@RequestParam String turnipCode, @RequestParam String admin) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

		return queue.getId().equals(admin);
	}

	@PostMapping("/endpoint/userJoinedQueue")
	public final Boolean userJoinedQueue(@RequestParam String turnipCode, @RequestParam String userId, @RequestParam String username) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

		return queue.position(new User(username, userId)) != -1;
	}

	@PostMapping("/endpoint/userPositionInQueue")
	public final Integer userPositionInQueue(@RequestParam String turnipCode, @RequestParam String userId, @RequestParam String username) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

		return queue.position(new User(username, userId));
	}

	@PostMapping("/endpoint/userJoin")
	public final String userJoin(@RequestParam String turnipCode, @RequestParam String username, @RequestParam(required=false) String userId) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		User user;
		//	User already joined not working. Need to investigate the problem.
		if (userId != null)
			user = new User(username, userId);
		else
			user = new User(username);

		String result = queue.join(user);

		if (result.equals("skip_to_treasury") || result.equals("joined"))
			return user.getUID();
		
		return result;
	}

}
