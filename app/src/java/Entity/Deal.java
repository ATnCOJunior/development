package Entity;

/**
 * @author Avinash Dash
 */

import java.util.*;

public class Deal {

    private String company;
    private int dealID;
    private Date date_initiated;
    private Date date_expired;
    private int shares_required;
    private int shares_current;
    private String position;
    private int views;
    private String photoLocation;
    
    
    /**
     * Creates a Deal object with parameters company, dealID, date_initiated, date_expired, shares_required, shares_current, position, views
     * @param company the company that created the deal
     * @param dealID the unique ID of the deal
     * @param date_initiated the date on which the deal began
     * @param date_expired the date on which the deal expired
     * @param shares_required the shares required to redeem the deal
     * @param shares_current the current number of shares for the deal
     * @param position the position of the deal
     * @param views the current number of views of this 
     * @param photoLocation the reference of the photo
     */
    
    public Deal(String company, int dealID, Date date_initiated, Date date_expired, int shares_required, int shares_current, String position, int views, String photoLocation){
        this.company = company;
        this.dealID = dealID;
        this.date_initiated = date_initiated; 
        this.date_expired = date_expired; 
        this.shares_required = shares_required;
        this.shares_current = shares_current; 
        this.position = position;
        this.views = views;
        this.photoLocation = photoLocation;
    }
    
    public void setCompany(String company){
        this.company = company;
    }
    
    public void setDealID(int dealID){
        this.dealID = dealID;
    }
    
    public void setDateInitiated(Date date_initiated){
        this.date_initiated = date_initiated;
    }
    
    public void setDateExpired(Date date_expired){
        this.date_expired = date_expired; 
    }
    
    public void setSharesRequired(int shares_required){
        this.shares_required = shares_required;
    }
    
    public void setSharesCurrent(int shares_current){
        this.shares_current = shares_current;
    }
    
    public void setPosition(String position){
        this.position = position;
    }
    
    public void setViews(int views){
        this.views = views;
    }

    public void setPhotoLocation(String photoLocation) {
        this.photoLocation = photoLocation;
    }
        
    public String getCompany(){
        return company;
    }
    
    public int getDealID(){
        return dealID;
    }
    
    public Date getDateInitiated(){
        return date_initiated;
    }
    
    public Date getDateExpired(){
        return date_expired;
    }
    
    public int getSharesRequired(){
        return shares_required;
    }
    
    public int getSharesCurrent(){
        return shares_current;
    }
    
    public String getPosition(){
        return position;
    }
    
    public int getViews(){
        return views;
    }

    public String getPhotoLocation() {
        return photoLocation;
    }
    
}
