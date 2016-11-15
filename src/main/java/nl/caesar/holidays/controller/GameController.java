package nl.caesar.holidays.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class GameController {

	@RequestMapping(value = "/game", method = RequestMethod.GET)
	public String getGamePage(ModelMap model) {
		return "game";
	}

	@RequestMapping(value = "/game2", method = RequestMethod.GET)
	public String getGamePage2(ModelMap model) {
		return "game2";
	}

	@RequestMapping(value = "/game3", method = RequestMethod.GET)
	public String getGamePage3(ModelMap model) {
		return "game3";
	}

	@RequestMapping(value = "/game4", method = RequestMethod.GET)
	public String getGamePage4(ModelMap model) {
		return "game4";
	}

	@RequestMapping(value = "/game5", method = RequestMethod.GET)
	public String getGamePage5(ModelMap model) {
		return "game5";
	}

	@RequestMapping(value = "/game6", method = RequestMethod.GET)
	public String getGamePage6(ModelMap model) {
		return "game6";
	}
}
