package com.fehniix.acnh_turnips.abc;

import com.fehniix.acnh_turnips.Database;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class Test {

	@GetMapping("/hello")
    @ResponseBody
    public String index() {
        Database.getInstance().testQuery();
        return "greetings!a";
    }

}
