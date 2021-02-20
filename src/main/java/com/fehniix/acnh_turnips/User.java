package com.fehniix.acnh_turnips;

import java.time.Instant;
import java.util.UUID;

public class User {
	private String username;
	private String uid;
	private Long timeSinceJoin;

	public User(String username) {
		this.username 		= username;
		this.uid 			= UUID.randomUUID().toString();
		this.timeSinceJoin 	= null;
	}

	public User(String username, String uid) {
		this.username 	= username;
		this.uid 		= uid;
	}

	public String getUsername() {
		return this.username;
	}

	public String getUID() {
		return this.uid;
	}

	public Long getTimeSinceJoin() {
		return this.timeSinceJoin;
	}

	public void setTimeSinceJoin() {
		this.timeSinceJoin = Instant.now().getEpochSecond();
	}

	@Override
	public boolean equals(Object o) {
		if (o == this)
			return true;

		if (!(o instanceof User))
			return false;

		User u = (User) o;

		return u.getUID() == this.uid && u.getUsername() == this.username;
	}
}
