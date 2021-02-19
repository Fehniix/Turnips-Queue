package com.fehniix.acnh_turnips.routers;

import java.util.ArrayList;

import com.fehniix.acnh_turnips.FileIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RouterREST {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@GetMapping("/pagesFolderContents")
	public final String[] pagesFolderContents() {
		ArrayList<String> contents = new ArrayList<String>(FileIO.getFileList("./src/main/resources/public/js/pages"));
		return contents.toArray(new String[0]);
	}

	@GetMapping("/test")
	public final void test() {
		this.simpMessagingTemplate.convertAndSend("/topic/queue", "hello from Java!");
	}

}
