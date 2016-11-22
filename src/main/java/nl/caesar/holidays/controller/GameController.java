package nl.caesar.holidays.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import nl.caesar.holidays.game.model.Branch;

@Controller
public class GameController {

	@RequestMapping(value = "/game3", method = RequestMethod.GET)
	public String getGamePage3() {
		return "game3";
	}

	@RequestMapping(value = { "/game" }, method = RequestMethod.GET)
	public String getGamePage(ModelMap model, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		String branchName = null;
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("branch")) {
				branchName = cookie.getValue();
			}
		}

		if (branchName == null) {
			branchName = Branch.DEFAULT.name();
		}
		model.put("theme", branchName);

		return "game5";
	}

}
