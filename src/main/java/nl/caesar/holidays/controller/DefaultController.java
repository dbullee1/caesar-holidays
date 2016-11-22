package nl.caesar.holidays.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import nl.caesar.holidays.game.model.Theme;

@Controller
@RequestMapping("/index")
public class DefaultController {

	@RequestMapping(method = RequestMethod.GET)
	public String getIndexPage(HttpServletResponse response,
			@RequestParam(value = "branch", required = false) String theme) {

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
		response.addCookie(new Cookie("branch", modelTheme.name()));
		return "index";
	}
}
