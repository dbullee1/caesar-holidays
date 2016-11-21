package nl.caesar.holidays.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import nl.caesar.holidays.game.model.Theme;

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

	@RequestMapping(value = { "/game5" }, method = RequestMethod.GET)
	public String getGamePage5(ModelMap model, @RequestParam(value = "branch", required = false) String theme) {
		Theme modelTheme = null;
		if (!StringUtils.isEmpty(theme)) {
			try {
				modelTheme = Theme.valueOf(theme.toUpperCase());
			} catch (IllegalArgumentException e) {
				// falling back to default Theme
			}
		}

		if (modelTheme == null) {
			modelTheme = Theme.DEFAULT;
		}

		model.put("theme", modelTheme.name());

		return "game5";
	}

	@RequestMapping(value = "/game6", method = RequestMethod.GET)
	public String getGamePage6(ModelMap model) {
		return "game6";
	}
}
