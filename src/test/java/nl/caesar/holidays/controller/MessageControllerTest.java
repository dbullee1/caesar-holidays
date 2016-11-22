package nl.caesar.holidays.controller;

import static org.junit.Assert.assertEquals;

import javax.servlet.http.Cookie;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.ui.ModelMap;

import nl.caesar.holidays.game.model.Branch;

public class MessageControllerTest {

	@Test
	public void test() {
		ModelMap map = new ModelMap();
		MockHttpServletRequest request = new MockHttpServletRequest();
		MessageController controller = new MessageController();

		Cookie[] cookies = new Cookie[1];
		request.setCookies(cookies);

		// Tenders
		cookies[0] = new Cookie("branch", Branch.TENDERS.name());
		assertEquals("message", controller.getMessagePage(map, request));
		assertEquals("Tenders", map.get("branch"));

		// Experts
		cookies[0] = new Cookie("branch", Branch.EXPERTS.name());
		assertEquals("message", controller.getMessagePage(map, request));
		assertEquals("Experts", map.get("branch"));

		// anything else
		cookies[0] = new Cookie("branch", Branch.DEFAULT.name());
		assertEquals("message", controller.getMessagePage(map, request));
		assertEquals("Groep", map.get("branch"));
	}
}
