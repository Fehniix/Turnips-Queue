package com.fehniix.acnh_turnips;

import com.fehniix.acnh_turnips.entities.Logger;
import com.fehniix.acnh_turnips.model.DAOs.QueueDAO;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AcnhTurnipsApplication {

	public static void main(String[] args) {
		Logger.log(AnsiColor.CYAN, "\n\nApplication started.\n\n");
		
		SpringApplication.run(AcnhTurnipsApplication.class, args);

		//	After the application has started, proceed to clean up any private island that was left in an inconsistent state on the DB.
		//	Incosistent state: not paired up with a Queue instance in memory.
		QueueDAO.checkForPrivateInconsistencies();
	}

}