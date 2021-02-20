package com.fehniix.acnh_turnips.routers;

import java.util.ArrayList;

import com.fehniix.acnh_turnips.FileIO;
import com.fehniix.acnh_turnips.Logger;
import com.fehniix.acnh_turnips.Queue;
import com.fehniix.acnh_turnips.Queues;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	public final ArrayList<Queue> test() {
		this.simpMessagingTemplate.convertAndSend("/topic/queue", "hello from Java!");
		Logger.log(AnsiColor.BRIGHT_GREEN, Queues.getInstance().test().size());
		return Queues.getInstance().test();
	}

	@PostMapping("/createQueue")
	public final String createQueue(
		@RequestParam String islandName, 
		@RequestParam String nativeFruit,
		@RequestParam Boolean _private,
		@RequestParam Integer turnips,
		@RequestParam String hemisphere,
		@RequestParam Integer maxLength,
		@RequestParam Integer maxVisitors,
		@RequestParam String dodoCode,
		@RequestParam String description) {
			String uuid = Queues.getInstance().createQueue(maxLength, maxVisitors);
			return uuid;
	}

}
