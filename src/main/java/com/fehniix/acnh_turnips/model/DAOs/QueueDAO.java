package com.fehniix.acnh_turnips.model.DAOs;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.fehniix.acnh_turnips.Database;
import com.fehniix.acnh_turnips.Logger;
import com.fehniix.acnh_turnips.model.QueueMeta;

import org.springframework.boot.ansi.AnsiColor;

public class QueueDAO {

	public static QueueMeta getQueueByTurnipCode(String turnipCode) {
		try {

			PreparedStatement statement = Database.getInstance().getConnection().prepareStatement(
				"SELECT * FROM queues WHERE turnipCode = ?"
			);
			statement.setString(1, turnipCode);

			ResultSet resultSet = statement.executeQuery();

			//	The result is supposed to be only one.
			if (!resultSet.next())
				return null;

			QueueMeta qm 	= new QueueMeta();
			qm.islandName	= resultSet.getString("islandName");
			qm.nativeFruit	= resultSet.getString("nativeFruit");
			qm._private		= resultSet.getBoolean("private");
			qm.turnips		= resultSet.getInt("turnips");
			qm.hemisphere	= resultSet.getString("hemisphere");
			qm.maxLength 	= resultSet.getInt("maxLength");
			qm.maxVisitors 	= resultSet.getInt("maxVisitors");
			qm.description	= resultSet.getString("description");
			qm.turnipCode	= resultSet.getString("turnipCode");

			return qm;

		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem retrieving the queue with turnip code (" + turnipCode + "). " + ex.getMessage());
		}

		return null;
	}

	public static String getDodoCodeByTurnipCode(String turnipCode) {
		try {

			PreparedStatement statement = Database.getInstance().getConnection().prepareStatement(
				"SELECT * FROM queues WHERE turnipCode = ?"
			);
			statement.setString(1, turnipCode);

			ResultSet resultSet = statement.executeQuery();

			//	The result is supposed to be only one.
			resultSet.next();

			String dodoCode = resultSet.getString("dodoCode");

			return dodoCode;

		} catch (Exception ex) {
			Logger.log(AnsiColor.RED, "There was a problem retrieving the Dodo Code of the queue with turnip code (" + turnipCode + "). " + ex.getMessage());
		}

		return null;
	}

	public static Boolean insertQueue(QueueMeta qm) {
		try {

			PreparedStatement statement = Database.getInstance().getConnection().prepareStatement(
					"INSERT INTO " 
				+ 	"queues(islandName, nativeFruit, private, turnips, hemisphere, maxLength, maxVisitors, dodoCode, adminId, description, turnipCode)"
				+ 	"VALUES "
				+ 	"(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
			);
			statement.setString(1, qm.islandName);
			statement.setString(2, qm.nativeFruit);
			statement.setBoolean(3, qm._private);
			statement.setInt(4, qm.turnips);
			statement.setString(5, qm.hemisphere);
			statement.setInt(6, qm.maxLength);
			statement.setInt(7, qm.maxVisitors);
			statement.setString(8, qm.dodoCode);
			statement.setString(9, qm.adminId);
			statement.setString(10, qm.description);
			statement.setString(11, qm.turnipCode);

			if (statement.executeUpdate() == 1)
				return true;

		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem inserting the new queue. " + ex.getMessage());
		}

		return false;
	}

	public static Boolean updateQueueByTurnipCode(QueueMeta qm) {
		try {

			PreparedStatement statement = Database.getInstance().getConnection().prepareStatement(
					"UPDATE queues " 
				+ 	"SET islandName=?, nativeFruit=?, private=?,"
				+	"turnips=?, hemisphere=?, maxLength=?, maxVisitors=?,"
				+	"dodoCode=?, adminId=?, description=?"
				+	"WHERE turnipCode=?"
			);
			statement.setString(1, qm.islandName);
			statement.setString(2, qm.nativeFruit);
			statement.setBoolean(3, qm._private);
			statement.setInt(4, qm.turnips);
			statement.setString(5, qm.hemisphere);
			statement.setInt(6, qm.maxLength);
			statement.setInt(7, qm.maxVisitors);
			statement.setString(8, qm.dodoCode);
			statement.setString(9, qm.adminId);
			statement.setString(10, qm.description);
			statement.setString(11, qm.turnipCode);

			if (statement.executeUpdate() == 1)
				return true;

		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem updating the queue with Turnip Code: " + qm.turnipCode + " " + ex.getMessage());
		}

		return false;
	}

	public static Boolean deleteQueueByTurnipCode(String turnipCode) {
		try {

			PreparedStatement statement = Database.getInstance().getConnection().prepareStatement("DELETE FROM queues WHERE turnipCode=?");
			statement.setString(1, turnipCode);

			if (statement.executeUpdate() == 1)
				return true;

		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem deleting the queue with Turnip Code: " + turnipCode + " " + ex.getMessage());
		}

		return false;
	}
}
