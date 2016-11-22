package nl.caesar.holidays.controller;

import static org.junit.Assert.assertEquals;

import javax.servlet.http.Cookie;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.ui.ModelMap;

import nl.caesar.holidays.game.model.Branch;

public class GameControllerTest {

	@Test
	public void getGamePage() {
		ModelMap map = new ModelMap();
		MockHttpServletRequest request = new MockHttpServletRequest();
		GameController controller = new GameController();

		Cookie[] cookies = new Cookie[1];
		request.setCookies(cookies);

		// Tenders
		cookies[0] = new Cookie("branch", Branch.TENDERS.name());
		assertEquals("game5", controller.getGamePage(map, request));
		assertEquals(Branch.TENDERS.name(), map.get("theme"));

		// Experts
		cookies[0] = new Cookie("branch", Branch.EXPERTS.name());
		assertEquals("game5", controller.getGamePage(map, request));
		assertEquals(Branch.EXPERTS.name(), map.get("theme"));

		// anything else
		cookies[0] = new Cookie("branch", Branch.DEFAULT.name());
		assertEquals("game5", controller.getGamePage(map, request));
		assertEquals(Branch.DEFAULT.name(), map.get("theme"));
	}

	@Test
	public void getGame3Page() {
		GameController controller = new GameController();
		assertEquals("game3", controller.getGamePage3());
	}
}
