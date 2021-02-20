package com.fehniix.acnh_turnips;

import java.util.UUID;

public class User {
	private String username;
	private String uid;

	public User(String username) {
		this.username 	= username;
		this.uid 		= UUID.randomUUID().toString();
	}

	public String getUsername() {
		return this.username;
	}

	public String getUID() {
		return this.uid;
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
