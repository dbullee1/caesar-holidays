package nl.caesar.holidays.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import javax.servlet.http.Cookie;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import nl.caesar.holidays.game.model.Branch;

public class DefaultControllerTest {

	@Test
	public void testNoCookieSet() {
		DefaultController controller = new DefaultController();
		// Tenders
		MockHttpServletResponse tenderResponse = new MockHttpServletResponse();
		MockHttpServletRequest tenderRequest = new MockHttpServletRequest();
		controller.getIndexPage(tenderRequest, tenderResponse, "Tenders");
		assertEquals(Branch.TENDERS.name(), tenderResponse.getCookie("branch").getValue());

		// Experts
		MockHttpServletResponse expertsResponse = new MockHttpServletResponse();
		MockHttpServletRequest expertsRequest = new MockHttpServletRequest();
		controller.getIndexPage(expertsRequest, expertsResponse, "Experts");
		assertEquals(Branch.EXPERTS.name(), expertsResponse.getCookie("branch").getValue());

		// Anything else
		MockHttpServletResponse defaultResponse = new MockHttpServletResponse();
		MockHttpServletRequest defaultRequest = new MockHttpServletRequest();
		assertEquals("index", controller.getIndexPage(defaultRequest, defaultResponse, "asdas"));
		assertEquals(Branch.DEFAULT.name(), defaultResponse.getCookie("branch").getValue());
	}

	@Test
	public void testPreviousCookieSet() {
		DefaultController controller = new DefaultController();
		Cookie[] cookies = new Cookie[1];
		cookies[0] = new Cookie("branch", Branch.EXPERTS.name());

		// Tenders
		MockHttpServletResponse tenderResponse = new MockHttpServletResponse();
		MockHttpServletRequest tenderRequest = new MockHttpServletRequest();
		tenderRequest.setCookies(cookies);
		controller.getIndexPage(tenderRequest, tenderResponse, "Tenders");
		// not setting cookie because there was already a cookie set on the
		// request
		assertTrue(tenderResponse.getCookie("branch") == null);

		// Experts
		MockHttpServletResponse expertsResponse = new MockHttpServletResponse();
		MockHttpServletRequest expertsRequest = new MockHttpServletRequest();
		expertsRequest.setCookies(cookies);
		controller.getIndexPage(expertsRequest, expertsResponse, "Experts");
		// not setting cookie because there was already a cookie set on the
		// request
		assertTrue(expertsResponse.getCookie("branch") == null);

		// Anything else
		MockHttpServletResponse defaultResponse = new MockHttpServletResponse();
		MockHttpServletRequest defaultRequest = new MockHttpServletRequest();
		defaultRequest.setCookies(cookies);
		assertEquals("index", controller.getIndexPage(defaultRequest, defaultResponse, "asdas"));
		// not setting cookie because there was already a cookie set on the
		// request
		assertTrue(defaultResponse.getCookie("branch") == null);
	}
}
