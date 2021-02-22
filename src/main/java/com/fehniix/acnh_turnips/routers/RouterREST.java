package com.fehniix.acnh_turnips.routers;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import com.fehniix.acnh_turnips.entities.FileIO;
import com.fehniix.acnh_turnips.entities.Logger;
import com.fehniix.acnh_turnips.model.Queue;
import com.fehniix.acnh_turnips.model.Queues;
import com.fehniix.acnh_turnips.model.User;
import com.fehniix.acnh_turnips.model.QueueCreatedResponse;
import com.fehniix.acnh_turnips.model.QueueMeta;
import com.fehniix.acnh_turnips.model.QueueTuple;
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

	@PostMapping("/endpoint/updateQueue")
	public final void updateQueue(
		@RequestParam String islandName, 
		@RequestParam String nativeFruit,
		@RequestParam Boolean _private,
		@RequestParam Integer turnips,
		@RequestParam String hemisphere,
		@RequestParam Integer maxLength,
		@RequestParam Integer maxVisitors,
		@RequestParam String dodoCode,
		@RequestParam String description,
		@RequestParam String turnipCode,
		@RequestParam String adminId) {
			//	We are safely assuming all required parameters have been filled, the request would have otherwise failed.
			Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
			
			if (queue == null) {
				Logger.log(AnsiColor.RED, "Queue not found.");
				
				throw new ResponseStatusException(HttpStatus.GONE, "The queue with Turnip Code: " + turnipCode + " was not found.");
			}
			
			QueueMeta qm = new QueueMeta();
			qm.islandName	= islandName;
			qm.nativeFruit	= nativeFruit;
			qm._private		= _private;
			qm.turnips		= turnips;
			qm.hemisphere	= hemisphere;
			qm.maxLength 	= maxLength;
			qm.maxVisitors 	= maxVisitors;
			qm.dodoCode		= dodoCode;
			qm.adminId		= queue.getId();
			qm.description	= description;
			qm.turnipCode	= queue.getTurnipCode();
			QueueDAO.updateQueueByTurnipCode(qm);

			queue.update(maxLength, maxVisitors);

			this.simpMessagingTemplate.convertAndSend("/topic/queue", "update");
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

	@GetMapping("/endpoint/getQueueMetaAdmin")
	public final QueueMeta getQueueMetaAdmin(@RequestParam String turnipCode, @RequestParam String adminId) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		QueueMeta qm = QueueDAO.getQueueByTurnipCodePrivileged(turnipCode);

		if (qm == null) {
			Logger.log(AnsiColor.RED, "Queue not found.");
			
			throw new ResponseStatusException(HttpStatus.GONE, "The queue with Turnip Code: " + turnipCode + " was not found.");
		}

		if (!queue.getId().equals(adminId))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not the queue host.");

		return qm;
	}

	@GetMapping("/endpoint/getDodoCode")
	public final String getDodoCode(@RequestParam String turnipCode, @RequestParam String userId, @RequestParam String username) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		QueueMeta qm = QueueDAO.getQueueByTurnipCodePrivileged(turnipCode);

		if (qm == null) {
			Logger.log(AnsiColor.RED, "Queue not found.");
			
			throw new ResponseStatusException(HttpStatus.GONE, "The queue with Turnip Code: " + turnipCode + " was not found.");
		}

		if (!queue.userIsVisiting(new User(username, userId)))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You cannot receive the Dodo Code yet.");
		
		return qm.dodoCode;
	}

	@PostMapping("/endpoint/userIsAdmin")
	public final Boolean userIsAdmin(@RequestParam String turnipCode, @RequestParam String admin) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		
		if (queue == null)
			return false;

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
	public final String userJoin(@RequestParam String turnipCode, @RequestParam String username, @RequestParam(required=false) String userId, HttpServletRequest request) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		User user;

		//	User already joined not working. Need to investigate the problem.
		if (userId == null)
			user = new User(username);
		else 
			if (!userId.isEmpty())
				user = new User(username, userId);
			else
				user = new User(username);

		user.setIPAddress(request.getRemoteAddr());

		int numberOfIPAddresses = 0;
		for (User _user: queue.getTreasury()) {
			if (_user.getIPAddress() == null)
				continue;

			if (_user.getIPAddress().equals(user.getIPAddress()))
				numberOfIPAddresses++;
		}
		for (User _user: queue.getQueuedUsers()) {
			if (_user.getIPAddress() == null)
				continue;

			if (_user.getIPAddress().equals(user.getIPAddress()))
				numberOfIPAddresses++;
		}

		if (numberOfIPAddresses > 10)
			throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests!");

		String result = queue.join(user);

		if (result.equals("skip_to_treasury") || result.equals("joined")) {
			this.simpMessagingTemplate.convertAndSend("/topic/queue", "update");
			return user.getUID();
		}
		
		return result;
	}

	@PostMapping("/endpoint/userCanReceiveDodoCode")
	public final Boolean userCanReceiveDodoCode(@RequestParam String turnipCode, @RequestParam String userId, @RequestParam String username) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		
		return queue.userIsVisiting(new User(username, userId));
	}

	@PostMapping("/endpoint/userLeave")
	public final String userLeave(@RequestParam String turnipCode, @RequestParam String username, @RequestParam String userId) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

		String result = queue.leave(new User(username, userId));

		if (!result.equals("not_joined"))
			this.simpMessagingTemplate.convertAndSend("/topic/queue", "update");

		return result;
	}

	@PostMapping("/endpoint/createTestUsers")
	public final void createTestUsers(@RequestParam String turnipCode, @RequestParam Integer numberOfUsers) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		
		for (int i = 0; i < numberOfUsers; ++i)
			System.out.println(queue.join(new User("abcdefg")));

		this.simpMessagingTemplate.convertAndSend("/topic/queue", "update");
	}

	@PostMapping("/endpoint/setLockedQueue")
	public final void lockQueue(@RequestParam String turnipCode, @RequestParam String adminId, @RequestParam Boolean locked) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

		if (!queue.getId().equals(adminId))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not the queue host.");

		queue.setLocked(locked);

		this.simpMessagingTemplate.convertAndSend("/topic/queue", "update");
	}

	@PostMapping("/endpoint/destroyQueue")
	public final void destroyQueue(@RequestParam String turnipCode, @RequestParam String adminId) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		
		if (!queue.getId().equals(adminId))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not the queue host.");

		Queues.getInstance().deleteQueue(turnipCode);
		QueueDAO.deleteQueueByTurnipCode(turnipCode);

		this.simpMessagingTemplate.convertAndSend("/topic/queue", "queue_destroyed");
	}

	@PostMapping("/endpoint/kickUser")
	public final void kickUser(@RequestParam String turnipCode, @RequestParam String adminId, @RequestParam Integer position) {
		Queue queue = Queues.getInstance().selectQueueByTurnipCode(turnipCode);
		
		if (!queue.getId().equals(adminId))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not the queue host.");

		if (queue.getTreasury().size() == 0) {
			System.out.println("size: 0");
			throw new ResponseStatusException(HttpStatus.GONE, "No users in treasury to kick.");
		}

		User user = queue.getTreasury().get(position - 1);
		queue.kick(position);

		//this.simpMessagingTemplate.convertAndSend("/topic/queue", "update");
		this.simpMessagingTemplate.convertAndSend("/topic/user/" + user.getUID(), "kick");
	}

	@GetMapping("/endpoint/filterQueues")
	public final ArrayList<QueueTuple> filterQueues(@RequestParam String hemisphere, @RequestParam String turnipsOrder) {
		ArrayList<QueueTuple> tuples = QueueDAO.getQueuesWithFilters(turnipsOrder, hemisphere);

		return tuples;
	}
}
