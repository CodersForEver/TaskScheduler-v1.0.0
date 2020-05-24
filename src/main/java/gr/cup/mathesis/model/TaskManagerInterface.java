package gr.cup.mathesis.model;

import java.util.List;

/**
 * DO NOT MODIFY.
 * 
 * @author mathesis
 */
public interface TaskManagerInterface {
   void addTask(Task task) ;
   void updateTask(Task task);
   void removeTask(int id) ;
   Task findTask(final int id);
   void markAsCompleted(int id, boolean completed) ;

   List<Task> listAllTasks(boolean priorityOrDate);
   List<Task> listTasksWithAlert();
   List<Task> listCompletedTasks();
}
