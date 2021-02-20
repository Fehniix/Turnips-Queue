package com.fehniix.acnh_turnips.model;

public class QueueCreatedResponse {
	public final String turnipCode;
	public final String queueId;

	public QueueCreatedResponse(String turnipCode, String queueId) {
		this.turnipCode = turnipCode;
		this.queueId 	= queueId;
	}
}
