package com.mathesis.merger.TaskScheduler.v100.api;

import com.mathesis.merger.TaskScheduler.v100.mathesis.model.Task;
import com.mathesis.merger.TaskScheduler.v100.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/task")
@RestController
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public void addTask(@RequestBody Task task){
        taskService.addTask(task);
    }

    @GetMapping
    public List<Task> listAllTasks(){
        return taskService.listAllTasks();
    }

    @GetMapping(path = "{id}")
    public Task findTask(@PathVariable("id") int id){
        return taskService.findTask(id);
    }
}
