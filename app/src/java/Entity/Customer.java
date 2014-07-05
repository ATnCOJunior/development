package Entity;

/*
 *@author Avinash Dash
 */

/*
 * This class is the object for a customer who uses our website to surf advertisements. 
 */
public class Customer {

    private String username;
    private String password;
    private String name;
    private int age;
    private char gender;
    private String profession;
    private String facebookName;
    private int currentPoints;
    private String photoLocation;

    /**
     * Creates a Customer object with default parameters
     *
     * @param username the customer's username
     * @param password the customer's password
     * @param name the customer's name
     * @param gender the customer's gender
     * @param profession the customer's profession
     * @param facebookName the customer's Facebook username
     */
    public Customer() {
        username = null;
        password = null;
        name = null;
        age = 0;
        gender = 'n';
        profession = null;
        facebookName = null;
        currentPoints = 0;
        photoLocation = null;
    }

    /**
     * Creates a Customer object with specified username, password, name, age,
     * gender, profession, facebookName and currentPoints
     *
     * @param username the customer's username
     * @param password the customer's password
     * @param name the customer's name
     * @param age the customer's age
     * @param gender the customer's gender
     * @param profession the customer's profession
     * @param facebookName the customer's Facebook username
     */
    public Customer(String username, String password, String name, int age, char gender, String profession, String facebookName, String photoLoc, int currentPoint) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.profession = profession;
        this.facebookName = facebookName;
        this.currentPoints = currentPoints;
        this.photoLocation = photoLoc;
    }

    /**
     * Set username of the customer
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Set password of the customer
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Set name of the customer
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Set gedern of the customer
     */
    public void setGender(char gender) {
        this.gender = gender;
    }

    /**
     * Set age of the customer
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * Set profession of the customer
     */
    public void setProfession(String profession) {
        this.profession = profession;
    }

    /**
     * Set facebook name of the customer
     */
    public void setFacebookName(String facebookName) {
        this.facebookName = facebookName;
    }

    /**
     * Set current points of the customer
     */
    public void setCurrentPoints(int currentPoints) {
        this.currentPoints = currentPoints;
    }

    /*I have not included a setter method for facebookName and gender since I 
     don't think that they will be necessary in our project. Also because a 
     change in gender or faceBook name is an unlikely scenario. */
    /**
     * Get username of the customer
     *
     * @return the username of the customer
     */
    public String getUsername() {
        return username;
    }

    /**
     * Get password of the customer
     *
     * @return the password of the customer
     */
    public String getPassword() {
        return password;
    }

    /**
     * Get name of the customer
     *
     * @return the name of the customer
     */
    public String getName() {
        return name;
    }

    /**
     * Get age of the customer
     *
     * @return the age of the customer
     */
    public int getAge() {
        return age;
    }

    /**
     * Get gender of the customer
     *
     * @return the gender of the customer
     */
    public char getGender() {
        return gender;
    }

    /**
     * Get profession of the customer
     *
     * @return the profession of the customer
     */
    public String getProfession() {
        return profession;
    }

    /**
     * Get Facebook username of the customer
     *
     * @return the Facebook username of the customer
     */
    public String getFacebookName() {
        return facebookName;
    }

    /**
     * Get current points of the customer
     *
     * @return the current points of the customer
     */
    public int getCurrentPoints() {
        return currentPoints;
    }
    
    public void setPhotoLoc(String newLoc) {
        this.photoLocation = newLoc;
    }
    
    public String getPhotoLoc(){
        return photoLocation;
    }

}
