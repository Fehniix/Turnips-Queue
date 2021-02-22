package com.fehniix.acnh_turnips.routers;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fehniix.acnh_turnips.entities.Logger;

import org.springframework.boot.ansi.AnsiColor;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RouterError implements ErrorController  {

	@RequestMapping("/error")
    public void error(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		
		if (status != null) {
			Integer statusCode = Integer.valueOf(status.toString());

			if (statusCode != 404) {
				System.out.println("Generated error, code " + statusCode + " " + request.getQueryString());
				return;
			}

			Logger.log(AnsiColor.RED, "404 Not Found, " + request.getPathInfo());
			response.sendRedirect("/");
		}
		
    }

    @Override
    public String getErrorPath() {
        return null;
    }
}