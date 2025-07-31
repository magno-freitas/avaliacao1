import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class auth {
        protected void doPost(HttpServletRequest request, HttpServletResponse resp) throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        user user = connection.authenticate(username, password);
        if (user != null) {
            resp.sendRedirect("dashboard.html");
        }else{
            resp.getWriter().println("Acesso negado");
        }
        
    }
}
