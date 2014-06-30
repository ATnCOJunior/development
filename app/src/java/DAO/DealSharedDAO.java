package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.DealShared;
import java.util.Date;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read,Update & Delete) functions of DealShared
 */
public class DealSharedDAO{

    private static final String TBLNAME = "DealShared";

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
        Logger.getLogger(DealSharedDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Deal that are stored in the database
     *
     * @return an arrayList of Deals
     */
    public static ArrayList<DealShared> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<DealShared> dealSharedList = new ArrayList<DealShared>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();

            while (rs.next()) {
                //Retrieve by column name
                String username = rs.getString("username");
                String company = rs.getString("company");
                int dealID = rs.getInt("dealID");
               
                DealShared dealShared = new DealShared(company, username, dealID);            
                dealSharedList.add(dealShared);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return dealSharedList;
    }

    /**
     * Retrieves an instance of Deal that is stored in the database with
     * provided username and password
     *
     * @param company the company the deal belongs to
     * @param dealID the ID of the deal
     * @return Deal
     */
    public static DealShared retrieve(String company, String username, int dealID) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        DealShared dealShared = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE company='" + company + "' and username='" + username + "'and dealID='" + dealID + "'";
            stmt = conn.prepareStatement(sql); 

            rs = stmt.executeQuery();
            while (rs.next()) {
                dealShared = new DealShared(company, username, dealID);      
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return dealShared;
    }

    /**
     * Creates a specific instance of DealShared into the database
     *
     * @param dealShared the deal that is going to be created
     */
    public static void create(DealShared dealShared) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();

            sql = "INSERT INTO " + TBLNAME
                    + " (company,username,dealID) VALUES (?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, dealShared.getCompany());
            stmt.setString(2, dealShared.getUsername());
            stmt.setInt(3, dealShared.getDealID());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "DealShared={" + dealShared + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific dealShared in the database
     *
     * @param dealShared the deal to be deleted
     */
    public static void delete(DealShared dealShared) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE company=? and username=? and dealID=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, dealShared.getCompany());
            stmt.setString(2, dealShared.getUsername());
            stmt.setInt(3, dealShared.getDealID());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "DealShared={" + dealShared + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all dealShareds in the database
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
            handleSQLException(ex, sql, "DealShared Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
