package gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * 2. Υλοποιήστε αυτή την κλάση 
 * 
 * @author mathesis
 */
@Repository("inMemory")
public final class TaskManager implements TaskManagerInterface {

    private static TaskManager INSTANCE;
    private List<Task> tasks = new ArrayList<>();

    public TaskManager() {
    }

    public static TaskManager getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new TaskManager();
        }
        return INSTANCE;
    }

    @Override
    public List<Task> listAllTasks(final boolean priorityOrDate) {
        if(priorityOrDate) tasks.sort(Comparator.comparing(Task::getPriority));
        else {
            try {
                tasks.sort(Comparator.comparing(Task::getDueDate));
            }catch (NullPointerException ex){
                Logger.getLogger(TaskManager.class.getName()).log(Level.INFO, ex.getMessage());
            }
        }
        return Collections.unmodifiableList(tasks);
    }

    @Override
    public List<Task> listTasksWithAlert() {
        return tasks.stream().filter(Task::hasAlert).collect(Collectors.toList());
    }
    
    @Override
    public List<Task> listCompletedTasks() {
        return tasks.stream().filter(Task::isCompleted).collect(Collectors.toList());
    }

    @Override
    public void addTask(final Task task) {
        if(validate(task)) tasks.add(task);
        else Logger.getLogger(TaskManager.class.getName()).log(Level.WARNING, "Validation failed. Task not created.");
    }

    @Override
    public void updateTask(final Task task) {
        if(validate(task)) {
            int index = 0;
            for (Task t : tasks) {
                if (t.equals(task)) {
                    index = tasks.indexOf(t);
                }
            }
            tasks.set(index, task);
        }
        else {
            Logger.getLogger(TaskManager.class.getName()).log(Level.WARNING, "Validation failed. Task not updated.");
        }
    }

    @Override
    public void markAsCompleted(final int id, final boolean completed) {
        Task t = findTask(id);
        if(t != null) t.setCompleted(completed);
    }

    @Override
    public void removeTask(final int id) {
        tasks.removeIf(o -> o.getId() == id);
    }

    private boolean validate(final Task task) {return !task.getDescription().isEmpty();}

    @Override
    public Task findTask(final int id) {
        for (Task t : tasks) {
            if(t.getId() == id) return t;
        }
        return null;
    }
}
