package gr.mathesis.merger.task_scheduler.v1_0_0.service;

import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.Task;
import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.TaskManagerInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskManagerInterface taskManager;

    @Autowired
    public TaskService(@Qualifier("hsql") TaskManagerInterface taskManager) {
        this.taskManager = taskManager;
    }

    public int addTask(Task task) {
        taskManager.addTask(task);
        return 1;
    }

    public List<Task> listAllTasks(boolean priorityOrDate) {
        return taskManager.listAllTasks(priorityOrDate);
    }

    public Task findTask(int id) {
        return taskManager.findTask(id);
    }

    public List<Task> searchForTask(String desc) {
//        List<Task> search = new ArrayList<>();
//        for (Task task : listAllTasks(false)) {
//            if (task.getDescription().contains(desc)) {
//                search.add(task);
//            }
//        }
        return listAllTasks(false)
                .stream()
                .filter(task -> task.getDescription().contains(desc))
                .collect(Collectors.toList());
    }

    public int editTask(int id, Task updatedTask) {
        Task taskToUpdate = findTask(id);

        if (taskToUpdate != null) {
            if (!updatedTask.getDescription().isEmpty()) {
                taskToUpdate.setDescription(updatedTask.getDescription());
            }

            if (updatedTask.getPriority() > 0 && updatedTask.getPriority() <= 10) {
                taskToUpdate.setPriority(updatedTask.getPriority());
            }

            if (updatedTask.getDueDate() != null) {
                taskToUpdate.setDueDate(updatedTask.getDueDate());
            } else {
                taskToUpdate.setDueDate(null);
            }

            if (updatedTask.getDueDate() != null) {
                taskToUpdate.setAlert(updatedTask.getAlert());
            }

            if (updatedTask.getAlert()) {
                taskToUpdate.setDaysBefore(updatedTask.getDaysBefore());
            }
            taskToUpdate.setComments(updatedTask.getComments());
            taskToUpdate.setCompleted(updatedTask.isCompleted());
            taskManager.updateTask(taskToUpdate);
            return 1;
        }
        return 0;
    }

    public int removeTask(int id){
        taskManager.removeTask(id);
        return 1;
    }

    public int markAsCompleted(int id, boolean completed){
        taskManager.markAsCompleted(id, completed);
        return 1;
    }

    public List<Task> listCompletedTasks(){
        return taskManager.listCompletedTasks();
    }

    public List<Task> listTasksWithAlert(){
        return taskManager.listTasksWithAlert();
    }
}

