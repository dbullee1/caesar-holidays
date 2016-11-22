package nl.caesar.holidays.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import nl.caesar.holidays.game.model.Theme;

@Controller
@RequestMapping("/message")
public class MessageController {

	@RequestMapping(method = RequestMethod.GET)
	public String getAboutPage(ModelMap model, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		String branchName = null;
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("branch")) {
				branchName = cookie.getValue();
			}
		}

		if (branchName == null) {
			branchName = Theme.DEFAULT.name();
		}

		switch (Theme.valueOf(branchName)) {
		case TENDERS:
			model.put("branch", "Tenders");
			break;
		case EXPERTS:
			model.put("branch", "Experts");
			break;
		default:
			model.put("branch", "Groep");
			break;
		}
		return "message";
	}
}
