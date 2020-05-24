package gr.cup.mathesis.model;

import java.time.LocalDate;
import java.util.List;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import org.junit.Before;
import org.junit.Test;

/**
 * DO NOT MODIFY.
 * 
 * @author Mathesis
 */
public class TaskManagerTest {
    
    private static TaskManagerInterface taskManager = null;
    
    @BeforeClass
    public static void setUpClass() {
        taskManager = TaskManager.getInstance();
//        taskManager = TaskManagerDB.getInstance();
        taskManager.addTask(new Task("Κράτηση ξενοδοχείου", 1, LocalDate.of(2019, 4, 2), true, 2));
        taskManager.addTask(new Task("Αγορά εισητηρίου", 1, LocalDate.of(2019, 4, 6), true, 1));
        taskManager.addTask(new Task("Αγορά δώρου", 2, LocalDate.of(2019, 4, 5)));        
    }
    
    @AfterClass
    public static void tearDownClass() {
        taskManager = null;
    }    
    
    @Before
    public void setUp() {

    }
    
    @After
    public void tearDown() {
    }

    /**
     * Test of getInstance method, of class TaskManager.
     */
    @Test
    public void testGetInstance() {
        System.out.println("getInstance");
        assertNotNull(taskManager);
    }

    /**
     * Test of listAllTasks method, of class TaskManager.
     */
    @Test
    public void testListAllTasks() {
        System.out.println("listAllTasks");
        List<Task> resultByPriority = taskManager.listAllTasks(true);
        List<Task> resultByDueDate = taskManager.listAllTasks(false);
        assertEquals(resultByDueDate.size(), resultByPriority.size());
    }

    /**
     * Test of listTasksWithAlert method, of class TaskManager.
     */
    @Test
    public void testListTasksWithAlert() {
        System.out.println("listTasksWithAlert");
        List<Task> result = taskManager.listTasksWithAlert();
        assertEquals(2, result.size());
    }

    /**
     * Test of listCompletedTasks method, of class TaskManager.
     */
    @Test
    public void testListCompletedTasks() {
        System.out.println("listCompletedTasks");
        int completed = 0;
        List<Task> allTasks = taskManager.listAllTasks(true);
        for (Task task : allTasks) {
            if (task.isCompleted()) {
                completed++;
            }
        }
        List<Task> result = taskManager.listCompletedTasks();
        assertEquals(completed, result.size());
        taskManager.markAsCompleted(1, true);
        result = taskManager.listCompletedTasks();
        assertEquals(completed+1, result.size());
    }

    /**
     * Test of addTask method, of class TaskManager.
     */
    @Test
    public void testAddTask() {
        System.out.println("addTask");
        Task task = new Task("Αγορά sd card", 1, LocalDate.of(2019, 4, 14), true, 1);
        taskManager.addTask(task);
        assertEquals(4, taskManager.listAllTasks(true).size());
    }

    /**
     * Test of updateTask method, of class TaskManager.
     */
    @Test
    public void testUpdateTask() {
        System.out.println("updateTask");
        Task task = taskManager.findTask(2);
        assertEquals(2, task.getId());
        task.setCompleted(true);
        taskManager.updateTask(task);
    }

    /**
     * Test of removeTask method, of class TaskManager.
     */
    @Test
    public void testRemoveTask() {
        System.out.println("removeTask");
        taskManager.removeTask(4);
        assertEquals(3, taskManager.listAllTasks(false).size());
    }

}
