package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.DealCategory;
import java.util.Date;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read,Update & Delete) functions of DealCategory
 */
public class DealCategoryDAO{

    private static final String TBLNAME = "DealCategory";

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
        Logger.getLogger(DealCategoryDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Deal that are stored in the database
     *
     * @return an arrayList of Deals
     */
    public static ArrayList<DealCategory> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<DealCategory> dealCategoryList = new ArrayList<DealCategory>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();

            while (rs.next()) {
                //Retrieve by column name
                String company = rs.getString("company");
                int dealID = rs.getInt("dealID");
                String category = rs.getString("category");
               
                DealCategory dealCategory = new DealCategory(company, dealID, category);            
                dealCategoryList.add(dealCategory);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return dealCategoryList;
    }

    /**
     * Retrieves an instance of DealCategory that is stored in the database with
     * provided username and password
     *
     * @param company the company the deal belongs to
     * @param dealID the ID of the deal
     * @return Deal
     */
    public static DealCategory retrieve(String company, int dealID, String category) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        DealCategory dealCategory = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE company='" + company + "' and category='" + category + "'and dealID='" + dealID + "'";
            stmt = conn.prepareStatement(sql); 

            rs = stmt.executeQuery();
            while (rs.next()) {
                dealCategory = new DealCategory(company, dealID, category);      
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return dealCategory;
    }

    /**
     * Creates a specific instance of DealCategory into the database
     *
     * @param dealCategory the deal that is going to be created
     */
    public static void create(DealCategory dealCategory) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();

            sql = "INSERT INTO " + TBLNAME
                    + " (company,dealID,category) VALUES (?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, dealCategory.getCompany());
            stmt.setInt(2, dealCategory.getDealID());
            stmt.setString(3, dealCategory.getCategory());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "DealCategory={" + dealCategory + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific dealCategory in the database
     *
     * @param dealCategory the deal to be deleted
     */
    public static void delete(DealCategory dealCategory) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE company=? and dealID=? and username=? ";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, dealCategory.getCompany());
            stmt.setInt(2, dealCategory.getDealID());
            stmt.setString(3, dealCategory.getCategory());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "DealCategory={" + dealCategory + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all dealCategorys in the database
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
            handleSQLException(ex, sql, "DealCategory Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
