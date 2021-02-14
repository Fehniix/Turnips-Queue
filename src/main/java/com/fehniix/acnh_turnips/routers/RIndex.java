package com.fehniix.acnh_turnips.routers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RIndex {
	
	@GetMapping("/")
	public static final String index() {
		return "index";
	}

}
