package com.fehniix.acnh_turnips.model.DAOs;

import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.fehniix.acnh_turnips.entities.Database;
import com.fehniix.acnh_turnips.entities.Logger;
import com.fehniix.acnh_turnips.model.Queue;
import com.fehniix.acnh_turnips.model.Queues;
import com.fehniix.acnh_turnips.model.QueueMeta;
import com.fehniix.acnh_turnips.model.QueueTuple;

import org.springframework.boot.ansi.AnsiColor;

public class QueueDAO {

	public static final QueueMeta getQueueByTurnipCode(String turnipCode) {
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

	public static final QueueMeta getQueueByTurnipCodePrivileged(String turnipCode) {
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
			qm.dodoCode		= resultSet.getString("dodoCode");

			return qm;

		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem retrieving the queue with turnip code (" + turnipCode + "). " + ex.getMessage());
		}

		return null;
	}

	public static final String getDodoCodeByTurnipCode(String turnipCode) {
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

	public static final Boolean insertQueue(QueueMeta qm) {
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

	public static final Boolean updateQueueByTurnipCode(QueueMeta qm) {
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

	public static final Boolean deleteQueueByTurnipCode(String turnipCode) {
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

	public static final ArrayList<QueueTuple> getQueuesWithFilters(String turnipsOrder, String hemisphere) {
		ArrayList<QueueTuple> queues = new ArrayList<QueueTuple>();

		try {
			
			PreparedStatement statement;
			String orderBy = turnipsOrder.equals("descending") ? "DESC" : "ASC";
			if (hemisphere.equals("either")) {
				statement = Database.getInstance().getConnection().prepareStatement("SELECT turnipCode FROM queues WHERE private = 'false' ORDER BY turnips " + orderBy + " LIMIT 30;");
			} else {
				statement = Database.getInstance().getConnection().prepareStatement("SELECT turnipCode FROM queues WHERE private = 'false' AND hemisphere = ? ORDER BY turnips " + orderBy + " LIMIT 30;");
				statement.setString(1, hemisphere);
			}

			Logger.log("Executing query:\t", AnsiColor.MAGENTA, statement.toString());

			ResultSet resultSet = statement.executeQuery();
			
			while(resultSet.next()) {
				String turnipCode 	= resultSet.getString("turnipCode");
				QueueMeta meta 		= QueueDAO.getQueueByTurnipCode(turnipCode);
				Queue queueInstance = Queues.getInstance().selectQueueByTurnipCode(turnipCode);

				//	Check for DB inconsistency
				if (queueInstance == null) {
					QueueDAO.deleteQueueByTurnipCode(turnipCode);
					Logger.log(AnsiColor.BRIGHT_RED, "DB inconsistency detected. Removed queue with turnipCode: " + turnipCode);
					continue;
				}
				
				queues.add(new QueueTuple(meta, queueInstance));
			}

			if (queues.size() == 0)
				Logger.log("Query executed:\t\t", AnsiColor.MAGENTA, "ResultSet was empty.");

		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem retrieving queues. " + ex.getMessage());
		}

		return queues;
	}

	public static final void checkForPrivateInconsistencies() {
		ArrayList<String> turnipCodes = new ArrayList<String>();

		try {
			Statement statement = Database.getInstance().createStatement();
			ResultSet resultSet = statement.executeQuery("SELECT turnipCode FROM queues WHERE private = 'true';");

			//	In future versions, queue instances are to be stored in an Amazon AW3 Redis cache server; hence why the check for each queue,
			//	rather than "safely" assuming that an application restart implies loss of data.
			while(resultSet.next()) {
				String turnipCode = resultSet.getString("turnipCode");

				if (Queues.getInstance().selectQueueByTurnipCode(turnipCode) == null)
					turnipCodes.add(turnipCode);
			}
		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem cleaning up private island inconsistencies. " + ex.getMessage());
		}

		if (turnipCodes.size() == 0)
			return;

		try {
			String[] arr = new String[turnipCodes.size()];
			for (int i = 0; i < arr.length; ++i)
				arr[i] = "'" + turnipCodes.get(i) + "'";

			Statement statement = Database.getInstance().createStatement();
			int updatedRows = statement.executeUpdate("DELETE FROM queues WHERE turnipCode IN (" + String.join(",", arr) + ");");

			Logger.log("DB inconsistency cleanup:\t\t", AnsiColor.MAGENTA, updatedRows + " rows were deleted.");
		} catch (SQLException ex) {
			Logger.log(AnsiColor.RED, "There was a problem cleaning up private island inconsistencies. " + ex.getMessage());
		}
	}
}
