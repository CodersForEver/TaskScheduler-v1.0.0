package gr.mathesis.merger.task_scheduler.v1_0_0.api;

import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.Task;
import gr.mathesis.merger.task_scheduler.v1_0_0.service.TaskService;
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
    public List<Task> listAllTasks(@RequestParam(value = "priorityOrDate") boolean priorityOrDate){
        return taskService.listAllTasks(priorityOrDate);
    }

    @GetMapping(path = "{id}")
    public Task findTask(@PathVariable("id") int id){
        return taskService.findTask(id);
    }

    @GetMapping
    public List<Task> searchForTask(@RequestParam(value = "search") String search){
        return taskService.searchForTask(search);
    }

    @PutMapping(path = "{id}")
    public void editTask(@RequestParam(value = "edit") boolean edit, @PathVariable("id") int id, @RequestBody Task updatedTask){
        if(edit){
            taskService.editTask(id, updatedTask);
        }
    }
}
