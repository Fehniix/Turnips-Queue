package com.fehniix.acnh_turnips;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnore;

public final class Queue {
	/**
	 * The ID is used to uniquely identify the Queue admin, the user that created the queue and is hosting is island.
	 */
	@JsonIgnore
	private String id;

	/**
	 * Unique queue identifier associated with the DB queue instance.
	 */
	private String turnipCode;

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
	public Queue(String id, String turnipCode, Integer maxLength, Integer maxVisitors) {
		this.id					= id;
		this.turnipCode 		= turnipCode;
		this.maxQueueLength 	= maxLength;
		this.maxVisitorsLength 	= maxVisitors;

		this.queuedUsers 		= new ArrayList<User>();
		this.treasury 			= new ArrayList<User>();
	}

	/**
	 * Allows the supplied user to join the queue. On error, string error codes are returned.
	 */
	public final String join(User user) {
		if (this.locked)
			return "locked";

		if (this.has(user))
			return "already_joined";

		if (this.isFull())
			return "full";
		
		this.queuedUsers.add(user);

		if (this.treasury.size() < this.maxVisitorsLength) {
			this.cycleNext();
			return "skip_to_treasury";
		}

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
			this.cycleNext();
			return "left_treasury";
		}

		this.queuedUsers.remove(user);
		this.cycleNext();
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

		this.cycleNext();
	}

	/**
	 * Clears internal buffers preparing the object for garbage collection.
	 */
	public final void destroyQueue() {
		this.queuedUsers.clear();
		this.treasury.clear();
		this.turnipCode = null;

		this.queuedUsers 	= null;
		this.treasury 		= null;
	}

	/**
	 * Returns `true` if the user is contained in the treasury, false otherwise.
	 */
	public final Boolean userIsVisiting(User user) {
		if (this.treasury.contains(user))
			return true;
		return false;
	}

	/**
	 * Updates the maximum queue length and treasury length.
	 */
	public final void update(Integer maxQueueLength, Integer maxVisitorsLength) {
		if (maxVisitorsLength > this.maxVisitorsLength)
			this.cycleNext();

		this.maxVisitorsLength = maxVisitorsLength;
		this.maxQueueLength = maxQueueLength;
	}

	/**
	 * This method handles popping a user from the queuedUsers and pushing to the treasury.
	 */
	synchronized private final void cycleNext() {
		//	Second condition happens when the user has updated the queue shrinking the maxVisitorsLength, more than the current number of visitors.
		if (this.queuedUsers.size() == 0 || this.treasury.size() > this.maxVisitorsLength)
			return;

		User user = this.queuedUsers.remove(0);
		user.setTimeSinceJoin();

		this.treasury.add(user);
	}

	/**
	 * Returns true if the sum of the number of users currently waiting to get the code and users that have is greater than the maximum queue length; false otherwise.
	 */
	private final Boolean isFull() {
		return this.queuedUsers.size() + this.treasury.size() >= this.maxQueueLength;
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

		return queue.getTurnipCode() == this.turnipCode;
	}

	//	Getters and setters.
	public final String getTurnipCode() {
		return this.turnipCode;
	}

	public final void setTurnipCode(String id) {
		this.turnipCode = id;
	}

	public final Boolean getLocked() {
		return this.locked;
	}

	public final void setLocked(Boolean locked) {
		this.locked = locked;
	}

	public final Integer getMaxVisitorsLength() {
		return this.maxVisitorsLength;
	}

	public final Integer getMaxQueueLength() {
		return this.maxQueueLength;
	}

	public final ArrayList<User> getQueuedUsers() {
		return this.queuedUsers;
	}

	public final ArrayList<User> getTreasury() {
		return this.treasury;
	}

	public final String getId() {
		return this.id;
	}
}
