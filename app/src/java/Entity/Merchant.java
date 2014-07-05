package Entity;

/**
 *@author Avinash Dash
 */
public class Merchant {
    
    private String username;
    private String password;
    private String company;
    
    
    /**
     *Creates a Merchant object with default parameters
     *@param username the merchant's username
     *@param password the merchant's password
     *@param company the merchant's company
     */
    
    public Merchant(){
        this.username = null;
        this.password = null;
        this.company = null;
    }
    
    /**
     *Creates a Merchant object with specified username, password and company
     *@param username the merchant's username
     *@param password the merchant's password
     *@param company the merchant's company
     */
    
    public Merchant(String username, String password, String company){
        this.username = username;
        this.password = password;
        this.company = company;
    }
    
    
    /**
     * Set username of the merchant
     */
    
    public void setUsername(String username){
        this.username = username;
    }
    
    /**
     * Set password of the merchant
     */
    
    public void setPassword(String password){
        this.password = password;
    }
    
    /**
     * Set company of the merchant
     */
    
    public void setCompany(String company){
        this.company = company;
    }
    
    /**
     * Get username of the merchant
     * @return the username of the merchant
     */
    
    public String getUsername(){
        return username;
    }
    
    /**
     * Get password of the merchant
     * @return the password of the merchant
     */
    
    public String getPassword(){
        return password;
    }
    
    /**
     * Get company of the merchant
     * @return the company of the merchant
     */
    
    public String getCompany(){
        return company;
    }
    
    
}
