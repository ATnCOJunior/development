package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.Redemption;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read/Retrieve,Update & Delete) functions of Redemption
 */
public class RedemptionDAO {

    private static final String TBLNAME = "Redemption";

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
        Logger.getLogger(RedemptionDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Redemption that are stored in the database
     *
     * @return an arrayList of Redemptions
     */
    public static ArrayList<Redemption> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<Redemption> redemptionList = new ArrayList<Redemption>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            
            while (rs.next()) {
                //Retrieve by column name
                String company = rs.getString("company");
                int dealID = rs.getInt("dealID");
                String options = rs.getString("options");
                int amount = rs.getInt("amount");
                

                Redemption redemption = new Redemption(company, dealID, options, amount);
                redemptionList.add(redemption);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return redemptionList;
    }

    /**
     * Retrieves an instance of Redemption that is stored in the database with provided username and password
     *
     * @param username the Redemption username
     * @param password the Redemption password
     * @return Redemption
     */
    public static Redemption retrieve(String company, int dealID) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        Redemption redemption = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE company='" + company + "' and dealID='" + dealID + "'";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            while (rs.next()) {
                //Retrieve by column name
                String options = rs.getString("options");
                int amount = rs.getInt("amount");
                
                redemption = new Redemption(company, dealID, options, amount);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return redemption;
    }

    /**
     * Creates a specific instance of Redemption into the database
     * @param redemption the redemption that is going to be created
     */
    public static void create(Redemption redemption) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();
            
            sql = "INSERT INTO " + TBLNAME
                    + " (company,dealID,options,amount) VALUES (?,?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, redemption.getCompany());
            stmt.setInt(2, redemption.getDealID());
            stmt.setString(3, redemption.getOptions());
            stmt.setInt(4, redemption.getAmount());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Redemption={" + redemption + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific redemption in the database
     *
     * @param redemption the redemption to be deleted
     */
    public static void delete(Redemption redemption) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE company=? and dealID=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, redemption.getCompany());
            stmt.setInt(2, redemption.getDealID());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Redemption={" + redemption + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all redemptions in the database
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
            handleSQLException(ex, sql, "Redemption Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Allows the user to update the redemption in the database (for now it just updates password. Can be used to update other things as well) 
     *
     * @param redemption the redemption that is going to be updated
     */
    public static void update(Redemption redemption) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "UPDATE " + TBLNAME
                    + " SET options=? and amount=?"
                    + " WHERE company=? and dealID=?";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, redemption.getOptions());
            stmt.setInt(2, redemption.getAmount());
            stmt.setString(3, redemption.getCompany());
            stmt.setInt(2, redemption.getDealID());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Redemption={" + redemption + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
