package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.Merchant;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read/Retrieve,Update & Delete) functions of Merchant
 */
public class MerchantDAO {

    private static final String TBLNAME = "Merchant";

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
        Logger.getLogger(MerchantDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Merchant that are stored in the database
     *
     * @return an arrayList of Merchants
     */
    public static ArrayList<Merchant> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<Merchant> merchantList = new ArrayList<Merchant>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            
            while (rs.next()) {
                //Retrieve by column name
                String username = rs.getString("username");
                String password = rs.getString("password");
                String company = rs.getString("company");

                Merchant merchant = new Merchant(username, password, company);
                merchantList.add(merchant);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return merchantList;
    }

    /**
     * Retrieves an instance of Merchant that is stored in the database with provided username and password
     *
     * @param username the Merchant username
     * @param password the Merchant password
     * @return Merchant
     */
    public static Merchant retrieve(String username, String password) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        Merchant merchant = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE username='" + username + "' and password='" + password + "'";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            while (rs.next()) {
                //Retrieve by column name
                String company = rs.getString("company");
                
                merchant = new Merchant(username, password, company);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return merchant;
    }

    /**
     * Creates a specific instance of Merchant into the database
     * @param merchant the merchant that is going to be created
     */
    public static void create(Merchant merchant) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();
            
            sql = "INSERT INTO " + TBLNAME
                    + " (username,password,company) VALUES (?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, merchant.getUsername());
            stmt.setString(2, merchant.getPassword());
            stmt.setString(3, merchant.getCompany());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Merchant={" + merchant + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific merchant in the database
     *
     * @param merchant the merchant to be deleted
     */
    public static void delete(Merchant merchant) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE username=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, merchant.getUsername());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Merchant={" + merchant + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all merchants in the database
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
            handleSQLException(ex, sql, "Merchant Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Allows the user to update the merchant in the database (for now it just updates password. Can be used to update other things as well) 
     *
     * @param merchant the merchant that is going to be updated
     */
    public static void update(Merchant merchant) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "UPDATE " + TBLNAME
                    + " SET password=?"
                    + " WHERE username=?";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, merchant.getPassword());
            stmt.setString(2, merchant.getUsername());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Merchant={" + merchant + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
