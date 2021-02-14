package com.fehniix.acnh_turnips;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.boot.ansi.*;

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
		final String JDBCUrl = "jdbc:postgresql://[::1]:5432/acnh_turnips";
		final String username = "root";
		final String password = "root";

		try {
			this.connection = DriverManager.getConnection(JDBCUrl, username, password);
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
		try {
			Statement statement = this.connection.createStatement();
			ResultSet resultSet = statement.executeQuery("SELECT * FROM accounts LIMIT 10;");

			while(resultSet.next()) {
				System.out.println(resultSet.getInt("user_id") + "\t" + resultSet.getString("username"));
			}

			resultSet.close();
		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was an error running the query:\n", AnsiColor.DEFAULT, ex.getMessage());
		}
	}
}
