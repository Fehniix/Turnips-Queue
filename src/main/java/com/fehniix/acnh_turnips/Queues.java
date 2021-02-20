package com.fehniix.acnh_turnips;

import java.util.ArrayList;
import java.util.UUID;

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
	 * Creates a queue. Returns the generated UUID associated with the queue.
	 */
	public String createQueue(Integer maxLength, Integer maxVisitors) {
		String uuid = UUID.randomUUID().toString();
		this.queues.add(new Queue(uuid, maxLength, maxVisitors));

		return uuid;
	}

	/**
	 * Deletes a queue given its unique identifier. Returns `true` on success, `false` otherwise.
	 */
	public Boolean deleteQueue(String id) {
		for (int i = 0; i < this.queues.size(); ++i) {
			if (this.queues.get(i).getId() == id) {
				this.queues.remove(i);
				return true;
			}
		}

		return false;
	}

	public ArrayList<Queue> test() {
		return this.queues;
	}
}
