package gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.db;

import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.Task;
import gr.mathesis.merger.task_scheduler.v1_0_0.mathesis.model.TaskManagerInterface;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.util.List;
import java.util.ArrayList;
import java.sql.*;
import java.util.Properties;

/**
 * 3. Υλοποιήστε αυτή την κλάση
 *
 * @author Mathesis
 */
@Repository("hsql")
public final class TaskManagerDB implements TaskManagerInterface {

    private Connection con;
    private static TaskManagerDB INSTANCE;
    private final Properties properties;

    public TaskManagerDB() {
        properties = readProperties("src/main/resources/db.properties");
        connect();
    }

    private static Properties readProperties(String propertiesFile) {
        Properties prop = new Properties();

        try {
            prop.load(new FileInputStream(propertiesFile));
        } catch (IOException e) {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.SEVERE, null, e);
        }
        return prop;
    }

    public static TaskManagerDB getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new TaskManagerDB();
        }
        return INSTANCE;
    }

    private String getDatabase() {
        return System.getProperty("user.home") + File.separator + properties.getProperty("defaultDatabase");
    }

    private String getJdbcUrl() {
        return properties.getProperty("defaultUrl") + getDatabase() + properties.getProperty("defaultOptions");
    }

    private void connect() {
        try {
            Class.forName(properties.getProperty("jdbcDriver"));
            con = DriverManager.getConnection(getJdbcUrl(),
                    properties.getProperty("dbAdmin"),
                    properties.getProperty("dbPassword"));
            if (!checkTables()) {
                createTables();
            }
        } catch (ClassNotFoundException | SQLException e) {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    private boolean checkTables() {
        ResultSet resultSet;
        try (PreparedStatement stmt = con.prepareStatement(properties.getProperty("sql.count"))) {
            resultSet = stmt.executeQuery();
            return (resultSet.next());
        } catch (SQLException e) {
            return false;
        }
    }

    private void createTables() throws SQLException {
        try (PreparedStatement stmt = con.prepareStatement(properties.getProperty("sql.createTable"))) {
            stmt.executeUpdate();
        }
    }

    public void disconnect() {
        try {
            if (con != null) {
                con.close();
            }
            con = null;
        } catch (SQLException e) {
            // ignores the exception
        }
    }

    private void cleanUp(Statement stmt, ResultSet rs) {
        try {
            if (rs != null) {
                rs.close();
            }
            rs = null;
            if (stmt != null) {
                stmt.close();
            }
            stmt = null;
        } catch (SQLException e) {
            // ignores the exception
        }
    }

    /**
     * Update task with the given {@code id}
     *
     * @param sql update/delete sql query
     * @param id  task id
     */
    private void update(String sql, int id) {
        try (PreparedStatement stmt = con.prepareStatement(sql)){
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    private List<Task> query(String where, String orderBy) {
        List<Task> result = new ArrayList<>();

        StringBuilder sql = new StringBuilder(properties.getProperty("sql.select"));
        if (where != null) sql.append(" WHERE ").append(where);
        if (orderBy != null) sql.append(" ORDER BY ").append(orderBy);

        try (PreparedStatement stmt = con.prepareStatement(sql.toString())) {
            ResultSet set = stmt.executeQuery();
            while (set.next()) {

                //Check for nulls in dueDate
                java.time.LocalDate date = (set.getDate("dueDate") != null)
                        ? set.getDate("dueDate").toLocalDate() : null;

                result.add(new Task(
                        set.getInt("id"),
                        set.getString("description"),
                        set.getInt("priority"),
                        date,
                        set.getBoolean("alert"),
                        set.getInt("daysBefore"),
                        set.getString("comments"),
                        set.getBoolean("completed")
                ));
            }
            cleanUp(stmt, set);
        } catch (SQLException ex) {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    private void modify(String sql, Task task, boolean isUpdate) {
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, task.getDescription());
            stmt.setInt(2, task.getPriority());

            //Check for nulls in dueDate
            if(task.getDueDate() != null) {
                stmt.setDate(3, Date.valueOf(task.getDueDate()));
            }else{
                stmt.setDate(3, null);
            }

            stmt.setBoolean(4, task.getAlert());
            stmt.setInt(5, task.getDaysBefore());
            stmt.setString(6, task.getComments());
            stmt.setBoolean(7, task.isCompleted());
            if (isUpdate) {
                stmt.setInt(8, task.getId());
            }
            stmt.executeUpdate();
        } catch (SQLException e) {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    @Override
    public List<Task> listAllTasks(boolean priorityOrDate) {
        return query(null, priorityOrDate
                ? properties.getProperty("sql.alertsOrderByPriority")
                : properties.getProperty("sql.alertsOrderByDueDate"));
    }

    @Override
    public List<Task> listTasksWithAlert() {
        return query(properties.getProperty("sql.alerts"),
                properties.getProperty("sql.alertsOrderByDueDate"));
    }

    @Override
    public List<Task> listCompletedTasks() {
        return query("completed = true", null);
    }

    @Override
    public void addTask(Task task) {
        if (validate(task)) {
            modify(properties.getProperty("sql.insert"), task, false);
        } else {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.WARNING, "Validation failed. DB not updated.");
        }

    }

    @Override
    public void updateTask(Task task) {
        if (validate(task)) {
            modify(properties.getProperty("sql.update"), task, true);
        } else {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.WARNING, "Validation failed. DB not updated.");
        }
    }

    @Override
    public void markAsCompleted(int id, boolean completed) {
        try (PreparedStatement stmt = con.prepareStatement(properties.getProperty("sql.updateCompleted"))){
            stmt.setBoolean(1, completed);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            Logger.getLogger(TaskManagerDB.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    @Override
    public void removeTask(int id) {
        update(properties.getProperty("sql.delete"), id);
    }

    @Override
    public Task findTask(final int id) {
        List<Task> tasks = query("id = " + id, null);
        return tasks.isEmpty() ? null : tasks.get(0);
    }

    private boolean validate(Task task) {
        return !task.getDescription().isEmpty();
    }

}
