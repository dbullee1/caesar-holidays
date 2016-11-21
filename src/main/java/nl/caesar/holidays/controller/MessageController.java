package nl.caesar.holidays.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import nl.caesar.holidays.game.model.Theme;

@Controller
@RequestMapping("/message")
public class MessageController {

	@RequestMapping(method = RequestMethod.GET)
	public String getAboutPage(ModelMap model, @RequestParam(value = "branch", required = false) String branch) {
		Theme modelTheme = null;
		if (!StringUtils.isEmpty(branch)) {
			try {
				modelTheme = Theme.valueOf(branch.toUpperCase());
			} catch (IllegalArgumentException e) {
				// falling back to default Theme
			}
		}

		switch(modelTheme){
		case TENDERS: model.put("branch", "Tenders"); break;
		case EXPERTS: model.put("branch", "Experts"); break;
		default: model.put("branch", "Groep"); break;
		}
		return "message";
	}
}
