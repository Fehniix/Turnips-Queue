package com.fehniix.acnh_turnips;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AcnhTurnipsApplication {

	public static void main(String[] args) {
		Logger.log(AnsiColor.CYAN, "\n\nApplication started.\n\n");
		SpringApplication.run(AcnhTurnipsApplication.class, args);
	}

}