package gr.mathesis.merger.task_scheduler.v1_0_0.service;

import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.Task;
import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.TaskManagerInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskManagerInterface taskManager;

    @Autowired
    public TaskService(@Qualifier("hsql") TaskManagerInterface taskManager) {
        this.taskManager = taskManager;
    }

    public void addTask(Task task){
        taskManager.addTask(task);
    }

    public List<Task> listAllTasks(boolean priorityOrDate){
        return taskManager.listAllTasks(priorityOrDate);
    }

    public Task findTask(int id ){
        return  taskManager.findTask(id);
    }
}
