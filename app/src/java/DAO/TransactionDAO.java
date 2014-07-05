package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.Transaction;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read/Retrieve,Update & Delete) functions of Transaction
 */
public class TransactionDAO {

    private static final String TBLNAME = "Transaction";

    /**
     * Provide a consistent manner to handle SQL Exception
     *
     * @param ex The SQLException encountered
     * @param sql The SQL command issued
     * @param parameters Textual representation of the parameters passed in to
     * PreparedStatement
     */
    private static void handleSQLException(SQLException ex, String sql, String... parameters) {
        String msg = "Unable to access data; SQL=" + sql + "\n";
        for (String parameter : parameters) {
            msg += "," + parameter;
        }
        Logger.getLogger(TransactionDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Transaction that are stored in the database
     *
     * @return an arrayList of Transactions
     */
    public static ArrayList<Transaction> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<Transaction> transactionList = new ArrayList<Transaction>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            
            while (rs.next()) {
                //Retrieve by column name
                String adminUsername = rs.getString("admin_username");
                String customerUsername = rs.getString("customer_username");
                String company = rs.getString("company");
                int dealID = rs.getInt("dealID");

                Transaction transaction = new Transaction(adminUsername, customerUsername, company, dealID);
                transactionList.add(transaction);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return transactionList;
    }

    /**
     * Retrieves an instance of Transaction that is stored in the database with provided username and password
     *
     * @param username the Transaction username
     * @param password the Transaction password
     * @return Transaction
     */
    public static Transaction retrieve(String adminUsername, String customerUsername, String company, int dealID) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        Transaction transaction = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE admin_username='" + adminUsername + "' and customer_username='" + customerUsername + "' and company='" + company + "' and dealID='" + dealID + "'";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            while (rs.next()) {
                //Retrieve by column name
                String options = rs.getString("options");
                int amount = rs.getInt("amount");
                
                transaction = new Transaction(adminUsername, customerUsername, company, dealID);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return transaction;
    }

    /**
     * Creates a specific instance of Transaction into the database
     * @param transaction the transaction that is going to be created
     */
    public static void create(Transaction transaction) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();
            
            sql = "INSERT INTO " + TBLNAME
                    + " (admin_username,customer_username,company,dealID) VALUES (?,?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, transaction.getAdminUsername());
            stmt.setString(2, transaction.getCustomerUsername());
            stmt.setString(3, transaction.getCompany());
            stmt.setInt(4, transaction.getDealID());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Transaction={" + transaction + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific transaction in the database
     *
     * @param transaction the transaction to be deleted
     */
    public static void delete(Transaction transaction) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE admin_username=? and customer_username=? and company=? and dealID=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, transaction.getAdminUsername());
            stmt.setString(2, transaction.getCustomerUsername());
            stmt.setString(3, transaction.getCompany());
            stmt.setInt(4, transaction.getDealID());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Transaction={" + transaction + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all transactions in the database
     */
    public static void deleteAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();

            sql = "DELETE FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Transaction Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
