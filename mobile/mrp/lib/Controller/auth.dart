import 'package:http/http.dart' as http;
import 'package:mrp/Controller/infos_usuario.dart';
import 'package:mrp/Controller/token_app.dart';

class Auth {
  String? tokenApp;

  static Future<String> login(String username, String senha) async {
    String urlLogin = "http://10.0.2.2:3000/auth/login";
    String urlPerfil = "http://10.0.2.2:3000/users/profile";
    var retornoLogin = await http.post(Uri.parse(urlLogin),
        body: {"username": username, "password": senha});
    if (retornoLogin.statusCode == 201) {
      var token = retornoLogin.body.substring(10);
      token = token.substring(0, token.length - 2);
      token = "Bearer " + token;
      var retornoPerfil = await http
          .get(Uri.parse(urlPerfil), headers: {"Authorization": token});
      if (retornoPerfil.statusCode == 200) {
        List<String> valorRetorno = retornoPerfil.body.split(",");
        String papel = valorRetorno[3].substring(8, valorRetorno[3].length - 2);
        TokenApp.setToken(token);
        await InfosUsuario.setarInfosUsuario();
        return papel;
      } else {
        throw new Exception("erro");
      }
    } else {
      throw new Exception("erro");
    }
  }
}
