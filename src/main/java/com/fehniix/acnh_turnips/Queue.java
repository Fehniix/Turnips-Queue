package com.fehniix.acnh_turnips;

import java.util.ArrayList;

public final class Queue {
	/**
	 * Unique queue identifier associated with the DB queue instance.
	 */
	private String id;

	/**
	 * Whether the queue is locked or not.
	 */
	private Boolean locked = false;

	/**
	 * Maximum queue length.
	 */
	private Integer maxQueueLength;

	/**
	 * Maximum treasury length, a.k.a. concurrent visitors that reiceved the Dodo code.
	 */
	private Integer maxVisitorsLength;

	/**
	 * Internal list of queued users
	 */
	private ArrayList<User> queuedUsers;

	/**
	 * Internal list of users that received the Dodo code
	 */
	private ArrayList<User> treasury;

	/**
	 * Initializes a queue using a UUID, maxLength and maxVisitors.
	 */
	public Queue(String id, Integer maxLength, Integer maxVisitors) {
		this.id 				= id;
		this.maxQueueLength 	= maxLength;
		this.maxVisitorsLength 	= maxVisitors;

		this.queuedUsers 		= new ArrayList<User>();
		this.treasury 			= new ArrayList<User>();
	}

	/**
	 * Allows the supplied user to join the queue. On error, string error codes are returned.
	 */
	synchronized public final String join(User user) {
		if (this.locked)
			return "locked";

		if (this.has(user))
			return "already_joined";

		if (this.isFull())
			return "full";

		if (this.treasury.size() < this.maxVisitorsLength) {
			this.treasury.add(user);
			return "skip_to_treasury";
		}
		
		this.queuedUsers.add(user);

		return "joined";
	}

	/**
	 * Allows the supplied user to leave the queue.
	 */
	public final String leave(User user) {
		if (!this.has(user))
			return "not_joined";

		if (this.treasury.contains(user)) {
			this.treasury.remove(user);
			return "left_treasury";
		}

		this.queuedUsers.remove(user);
		return "left";
	}

	/**
	 * Returns the position in queue of the supplied user. If the user has yet to join, `-1` is returned.
	 */
	public final Integer position(User user) {
		for (int i = 0; i < this.treasury.size(); ++i)
			if (this.treasury.get(i).equals(user))
				return i + 1;

		for (int i = 0; i < this.queuedUsers.size(); ++i) 
			if (this.queuedUsers.get(i).equals(user))
				return i + 1 + this.treasury.size();

		return -1;
	}

	/**
	 * Kicks a user in a specific position in treasury.
	 */
	public final void kick(Integer position) {
		this.treasury.remove(position - 1);
	}

	/**
	 * Clears internal buffers preparing the object for garbage collection.
	 */
	public final void destroyQueue() {
		this.queuedUsers.clear();
		this.treasury.clear();

		this.queuedUsers 	= null;
		this.treasury 		= null;
	}

	/**
	 * Returns true if the sum of the number of users currently waiting to get the code and users that have is greater than the maximum queue length; false otherwise.
	 */
	private final Boolean isFull() {
		return this.queuedUsers.size() + this.treasury.size() > this.maxQueueLength;
	}

	/**
	 * Returns true if either the queue or treasury contain the supplied user.
	 */
	private final Boolean has(User user) {
		return this.queuedUsers.contains(user) || this.treasury.contains(user);
	}

	@Override
	public final boolean equals(Object q) {
		if (q == this)
			return true;

		if (!(q instanceof Queue))
			return false;

		Queue queue = (Queue) q;

		return queue.getId() == this.id;
	}

	//	Getters and setters.
	public final String getId() {
		return this.id;
	}

	public final void setId(String id) {
		this.id = id;
	}
}
