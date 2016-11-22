package nl.caesar.holidays.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletResponse;

import nl.caesar.holidays.game.model.Branch;

public class DefaultControllerTest {

	@Test
	public void test() {
		DefaultController controller = new DefaultController();
		// Tenders
		MockHttpServletResponse tenderResponse = new MockHttpServletResponse();
		controller.getIndexPage(tenderResponse, "Tenders");
		assertEquals(Branch.TENDERS.name(), tenderResponse.getCookie("branch").getValue());

		// Experts
		MockHttpServletResponse expertsResponse = new MockHttpServletResponse();
		controller.getIndexPage(expertsResponse, "Experts");
		assertEquals(Branch.EXPERTS.name(), expertsResponse.getCookie("branch").getValue());

		// Anything else
		MockHttpServletResponse defaultResponse = new MockHttpServletResponse();
		assertEquals("index", controller.getIndexPage(defaultResponse, "asdas"));
		assertEquals(Branch.DEFAULT.name(), defaultResponse.getCookie("branch").getValue());
	}
}
