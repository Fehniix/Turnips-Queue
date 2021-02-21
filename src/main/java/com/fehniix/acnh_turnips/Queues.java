package com.fehniix.acnh_turnips;

import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import com.fehniix.acnh_turnips.model.QueueCreatedResponse;

public final class Queues {
	/**
	 * Singleton instance.
	 */
	private static Queues instance;

	/**
	 * List containing all the created queues.
	 */
	private ArrayList<Queue> queues;

	private Queues() {
		this.queues = new ArrayList<Queue>();
	}

	public static Queues getInstance() {
		if (Queues.instance == null)
			Queues.instance = new Queues();

		return Queues.instance;
	}

	/**
	 * Creates a queue. Returns the generated `turnipCode` associated with the queue.
	 */
	public final QueueCreatedResponse createQueue(Integer maxLength, Integer maxVisitors) {
		String id 				= UUID.randomUUID().toString();
		Integer turnipCodeInt 	= ThreadLocalRandom.current().nextInt(0x1A0000, 0xFFFFFF);
		String turnipCode 		= Integer.toHexString(turnipCodeInt);

		this.queues.add(new Queue(id, turnipCode, maxLength, maxVisitors));

		return new QueueCreatedResponse(turnipCode, id);
	}

	/**
	 * Deletes a queue given its unique identifier. Returns `true` on success, `false` otherwise.
	 */
	public final Boolean deleteQueue(String turnipCode) {
		for (int i = 0; i < this.queues.size(); ++i) {
			if (this.queues.get(i).getTurnipCode() == turnipCode) {
				this.queues.remove(i);
				return true;
			}
		}

		return false;
	}

	/**
	 * Selects queue by its turnip code. Returns `null` if nothing is found.
	 */
	public final Queue selectQueueByTurnipCode(String turnipCode) {
		for (int i = 0; i < this.queues.size(); ++i)
			if (this.queues.get(i).getTurnipCode().equals(turnipCode))
				return this.queues.get(i);
		
		return null;
	}

	public ArrayList<Queue> test() {
		return this.queues;
	}
}
