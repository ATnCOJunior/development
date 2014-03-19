package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.Deal;
import java.util.Date;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read,Update & Delete) functions of Deal
 */
public class DealDAO {

    private static final String TBLNAME = "Deal";

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
        Logger.getLogger(DealDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Deal that are stored in the database
     *
     * @return an arrayList of Deals
     */
    public static ArrayList<Deal> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<Deal> deals = new ArrayList<Deal>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();

            while (rs.next()) {
                //Retrieve by column name
                String company = rs.getString("company");
                int dealID = rs.getInt("dealID");
                Date date_initiated = rs.getDate("date_initiated");
                Date date_expired = rs.getDate("date_expired");
                int shares_required = rs.getInt("shares_required");
                int shares_current = rs.getInt("shares_current");
                String position = rs.getString("position");
                int views = rs.getInt("views");
               
                Deal deal = new Deal(company, dealID, date_initiated, date_expired, shares_required, shares_current, position, views);            
                deals.add(deal);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return deals;
    }

    /**
     * Retrieves an instance of Deal that is stored in the database with
     * provided username and password
     *
     * @param company the company the deal belongs to
     * @param dealID the ID of the deal
     * @return Deal
     */
    public static Deal retrieve(String company, int dealID) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        Deal deal = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE company='" + company + "' and dealID='" + dealID + "'";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            while (rs.next()) {
                Date date_initiated = rs.getDate("date_initiated");
                Date date_expired = rs.getDate("date_expired");
                int shares_required = rs.getInt("shares_required");
                int shares_current = rs.getInt("shares_current");
                String position = rs.getString("position");
                int views = rs.getInt("views");
               
                deal = new Deal(company, dealID, date_initiated, date_expired, shares_required, shares_current, position, views);      
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return deal;
    }

    /**
     * Creates a specific instance of Deal into the database
     *
     * @param deal the deal that is going to be created
     */
    public static void create(Deal deal) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();

            sql = "INSERT INTO " + TBLNAME
                    + " (company,dealID,date_initiated,date_expired,shares_required,shares_current,position,views) VALUES (?,?,?,?,?,?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, deal.getCompany());
            stmt.setInt(2, deal.getDealID());
            stmt.setDate(3, (java.sql.Date) deal.getDateInitiated());
            stmt.setDate(4, (java.sql.Date) deal.getDateExpired());
            stmt.setInt(5, deal.getSharesRequired());
            stmt.setInt(6, deal.getSharesCurrent());
            stmt.setString(7, deal.getPosition());
            stmt.setInt(8, deal.getViews());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Deal={" + deal + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific deal in the database
     *
     * @param deal the deal to be deleted
     */
    public static void delete(Deal deal) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE company=?" + " and dealID=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, deal.getCompany());
            stmt.setInt(1, deal.getDealID());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Deal={" + deal + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all deals in the database
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
            handleSQLException(ex, sql, "Deal Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Allows the user to update the deal in the database (for now it just
     * updates views. Can be used to update other things as well)
     *
     * @param deal the deal that is going to be updated
     */
    public static void update(Deal deal) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "UPDATE " + TBLNAME
                    + " SET password=?"
                    + " WHERE company=?"
                    + " and dealID=?";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, deal.getCompany());
            stmt.setInt(2, deal.getDealID());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Deal={" + deal + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
