package gr.mathesis.merger.task_scheduler.v1_0_0.api;

import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.Task;
import gr.mathesis.merger.task_scheduler.v1_0_0.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/tasks")
@RestController
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public void addTask(@RequestBody Task task) {
        taskService.addTask(task);
    }

    @DeleteMapping(path = "{id}")
    public void removeTask(@PathVariable("id") int id) {
        taskService.removeTask(id);
    }

    @GetMapping
    public List<Task> listAllTasks(@RequestParam(value = "priorityOrDate") boolean priorityOrDate) {
        return taskService.listAllTasks(priorityOrDate);
    }

    @GetMapping(path = "{id}")
    public Task findTask(@PathVariable("id") int id) {
        return taskService.findTask(id);
    }

    @GetMapping(value = "/search")
    public List<Task> searchForTask(@RequestParam(value = "condition") String condition) {
        return taskService.searchForTask(condition);
    }

    @GetMapping(value = "/completed")
    public List<Task> listCompletedTasks() {
        return taskService.listCompletedTasks();
    }

    @GetMapping(value = "/hasAlert")
    public List<Task> listTasksWithAlert() {
        return taskService.listTasksWithAlert();
    }

    @PutMapping(path = "/edit/{id}")
    public void editTask(@PathVariable("id") int id, @RequestBody Task updatedTask) {
        taskService.editTask(id, updatedTask);
    }

    @PutMapping(path = "/markAsCompleted/{id}")
    public void markAsCompleted(@PathVariable("id") int id, @RequestParam(value = "completed") boolean completed) {
        taskService.markAsCompleted(id, completed);
    }
}
