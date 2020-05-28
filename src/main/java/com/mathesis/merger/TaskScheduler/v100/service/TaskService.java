package com.mathesis.merger.TaskScheduler.v100.service;

import com.mathesis.merger.TaskScheduler.v100.mathesis.model.Task;
import com.mathesis.merger.TaskScheduler.v100.mathesis.model.TaskManagerInterface;
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

    public List<Task> listAllTasks(){
        return taskManager.listAllTasks(false);
    }

    public Task findTask(int id ){
        return  taskManager.findTask(id);
    }
}
