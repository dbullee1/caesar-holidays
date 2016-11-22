package nl.caesar.holidays.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class AboutControllerTest {

	@Test
	public void test() {
		AboutController controller = new AboutController();
		assertEquals("about", controller.getAboutPage());
	}

}
