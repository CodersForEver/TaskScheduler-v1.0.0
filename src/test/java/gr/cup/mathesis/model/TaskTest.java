package gr.cup.mathesis.model;

import java.time.LocalDate;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test;

/**
 * DO NOT MODIFY.
 * 
 * @author Mathesis
 */
public class TaskTest {

    private Task task;

    @Before
    public void setUp() {
        task = new Task("Κράτηση ξενοδοχείου", 1, LocalDate.of(2019, 4, 2), true, 2, "", false);
    }

    @After
    public void tearDown() {
        task = null;
    }

    /**
     * Test of isLate method, of class Task.
     */
    @Test
    public void testIsLate() {
        System.out.println("isLate");
        assertTrue(task.isLate() < 0);
    }

    /**
     * Test of hasAlert method, of class Task.
     */
    @Test
    public void testHasAlert() {
        System.out.println("hasAlert");
        assertTrue(task.hasAlert());
    }

    /**
     * Test of isCompleted method, of class Task.
     */
    @Test
    public void testCompleted() {
        System.out.println("Completed");
        assertFalse(task.isCompleted());
        task.setCompleted(true);
        assertTrue(task.isCompleted());
        
    }

    /**
     * Test of getDescription method, of class Task.
     */
    @Test(expected = IllegalArgumentException.class)
    public void testDescription() {
        System.out.println("Description");
        assertEquals("Κράτηση ξενοδοχείου", task.getDescription());
        task.setDescription("");
    }

    /**
     * Test of getPriority method, of class Task.
     */
    @Test(expected = IllegalArgumentException.class)
    public void testPriority() {
        System.out.println("Priority");
        assertEquals(1, task.getPriority());
        task.setPriority(-1);
        task.setPriority(11);
    }

    /**
     * Test of getDueDate method, of class Task.
     */
    @Test
    public void testDueDate() {
        System.out.println("DueDate");
        assertEquals(LocalDate.of(2019, 4, 2), task.getDueDate());
    }


    /**
     * Test of getDaysBefore method, of class Task.
     */
    @Test(expected = IllegalArgumentException.class)
    public void testDaysBefore() {
        System.out.println("DaysBefore");
        assertEquals(2, task.getDaysBefore());
        task.setDaysBefore(400);
    }

}
