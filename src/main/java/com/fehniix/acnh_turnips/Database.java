package com.fehniix.acnh_turnips;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Database singleton object. Allows to execute low-level queries.
 */
public final class Database {
    /**
     * Singleton Database instance.
     */
    private static Database instance;
    
    /**
     * Database connection instance. Used to query the DB.
     */
    private Connection connection;

    private Database() {
        // IPv6 connection URL.
        String JDBCUrl = "jdbc:postgresql://[::1]:5432/acnh_turnips";

        try {
            this.connection = DriverManager.getConnection(JDBCUrl, "root", "root");
        } catch (Exception e) {
            System.out.println("Could not connect to the database. Execution will be terminated.");
            System.exit(-1);
        }

        // Note: Connection is never closed. It should never be.
    }

    /**
     * Returns the Database instance.
     */
    public static Database getInstance() {
        if (Database.instance == null)
            Database.instance = new Database();

        return Database.instance;
    }

    public void testQuery() {
        ResultSet resultSet = this.safeQuery("SELECT * FROM information_schema LIMIT 10;");

        System.out.println(resultSet == null);
    }

    /**
     * Returns either a `ResultSet`, given a SQL query string, or null on error.
     * Remember to close the `ResultSet` stream.
     */
    private ResultSet safeQuery(String query) {
        try {
            Statement statement = this.connection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);

            System.out.println("test");
            System.out.println(resultSet); 

            // This is a stream that need to be manually disposed. Waiting for the GC is unsafe and could cause memory leaks.
            statement.close();

            return resultSet;
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            return null;
        }
    }
}
