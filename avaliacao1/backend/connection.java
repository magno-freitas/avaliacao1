import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class connection {
    static java.sql.Connection Connection()throws SQLException{
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/documentos", "root", "senha");

    }

public static user authenticate(String username, String password) {
       try (Connection con = Connection()) {
        PreparedStatement stmt = con.prepareStatement("SELECT * FROM usuarios WHERE username=? AND password=?");
        stmt.setString(1, username);
        stmt.setString(2, password);
        ResultSet rs = stmt.executeQuery();
        if(rs.next()) {
            return new user(username, password, rs.getString("role"));
        }
        return null;
       } catch (SQLException e) {
            e.printStackTrace();
            return null;
       }
}
}

