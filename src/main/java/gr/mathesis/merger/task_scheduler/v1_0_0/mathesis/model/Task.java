package gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.Period;

public class Task {
    private static int autoIndex = 0;
    private int id;
    private String description;
    private int priority;
    private LocalDate dueDate;
    private int daysBefore;
    private boolean completed;
    private boolean alert;
    private String comments;

    /**
     * Task Constructor
     *
     * @param id Id
     * @param desc Description
     * @param priority Priority 1..10
     * @param dueDate Due Date
     * @param alert Alert
     * @param daysBefore Days Before notification 0..365
     * @param comments Comments
     * @param completed Defines if the task is completed
     */
    public Task(int id, String desc, int priority, LocalDate dueDate, boolean alert, int daysBefore, String comments, boolean completed) {
        this.id = id;
        description = desc;
        this.priority = priority;
        this.dueDate = dueDate;
        this.alert = alert;
        this.daysBefore = daysBefore;
        this.comments = comments;
        this.completed = completed;
    }

    /**
     * Task Constructor
     *
     * @param desc Description
     * @param priority Priority 1..10
     * @param dueDate Due Date
     * @param alert Alert
     * @param daysBefore Days Before notification 0..365
     * @param comments Comments
     * @param completed Defines if the task is completed
     */
    public Task(
            @JsonProperty("desc") String desc,
            @JsonProperty("priority") int priority,
            @JsonProperty("dueDate") LocalDate dueDate,
            @JsonProperty("alert") boolean alert,
            @JsonProperty("daysBefore") int daysBefore,
            @JsonProperty("comments") String comments,
            @JsonProperty("completed") boolean completed) {
        id = ++autoIndex;
        description = desc;
        this.priority = priority;
        this.dueDate = dueDate;
        this.alert = alert;
        this.daysBefore = daysBefore;
        this.comments = comments;
        this.completed = completed;
    }

    /**
     * Task Constructor
     *
     * @param desc Description
     * @param priority Priority 1..10
     * @param dueDate Due Date
     * @param alert Alert
     * @param daysBefore Days Before notification 0..365
     */
    public Task(String desc, int priority, LocalDate dueDate, boolean alert, int daysBefore) {
        id = ++autoIndex;
        description = desc;
        this.priority = priority;
        this.dueDate = dueDate;
        this.alert = alert;
        this.daysBefore = daysBefore;
        this.comments = "";
        this.completed = false;
    }

    /**
     * Task Constructor
     *
     * @param desc Description
     * @param priority Priority 1..10
     * @param dueDate Due Date
     */
    public Task(String desc, int priority, LocalDate dueDate) {
        id = ++autoIndex;
        description = desc;
        this.priority = priority;
        this.dueDate = dueDate;
        this.alert = false;
        this.daysBefore = 0;
        this.comments = "";
        this.completed = false;
    }

    /**
     * Returns a boolean for the task if it has alert or not
     *
     * @return boolean
     */
    public boolean hasAlert() {
        return alert;
    }

    /**
     * Returns a boolean for the task if it is completed or not
     *
     * @return boolean
     */
    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) throws IllegalArgumentException {
        if(description.isEmpty()) throw new IllegalArgumentException("The description was empty!");
        this.description = description;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) throws IllegalArgumentException {
        if(priority < 1 || priority > 10) throw new IllegalArgumentException("Priority was set to < 1 or > 10!");
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public int getDaysBefore() {
        return daysBefore;
    }

    public void setDaysBefore(int daysBefore) throws IllegalArgumentException {
        if(daysBefore < 0 || daysBefore > 365) throw new IllegalArgumentException("Days Before was set to < 0 or > 365!");
        this.daysBefore = daysBefore;
    }

    /**
     * Returns an int showing the days that have passed since the pass of the due date in negative number
     * or returns the number of days to the due date in positive number
     *
     * @return Integer
     */
    public int isLate() { return Period.between(LocalDate.now(), dueDate).getDays(); }

    public int getId() {
        return id;
    }

    /**
     * Returns a formatted string with basic info of the Task
     *
     * @return String
     */
    public String toShortString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Id = ").append(id).append("\n");
        sb.append("Priority = ").append(priority).append("\n");
        sb.append("Description = '").append(description).append('\'').append("\n");
        sb.append("Due Date = ").append(dueDate).append("\n");
        sb.append("Alert = ").append(alert).append("\n");
        sb.append("Days Before = ").append(daysBefore).append("\n");
        return sb.toString();
    }

    public boolean getAlert() {
        return alert;
    }

    public void setAlert(boolean alert) {
        this.alert = alert;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    /**
     * Returns a formatted string with all the info of the Task
     *
     * @return String
     */
    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("Id = ").append(id).append("\n");
        sb.append("Priority = ").append(priority).append("\n");
        sb.append("Description = '").append(description).append('\'').append("\n");
        sb.append("Due Date = ").append(dueDate).append("\n");
        sb.append("Alert = ").append(alert).append("\n");
        sb.append("Days Before = ").append(daysBefore).append("\n");
        sb.append("Comments = '").append(comments).append('\'').append("\n");
        sb.append("Completed = ").append(completed).append("\n");
        return sb.toString();
    }
}
