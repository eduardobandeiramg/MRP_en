import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mrp/Controller/token_app.dart';

class InfosUsuario {
  static String? username;
  static String? email;
  static String? papel;

  static setarInfosUsuario() async {
    String? token = TokenApp.tokenApp;
    String urlBuscaInfos = "http://10.0.2.2:3000/users/profile";
    if (token != null) {
      http.Response resposta = await http
          .get(Uri.parse(urlBuscaInfos), headers: {"Authorization": token});
      if (resposta.statusCode == 200) {
        Map<String, dynamic> infos = Map<String, dynamic>.from(
          jsonDecode(resposta.body),
        );
        username = infos["username"];
        email = infos["email"];
        papel = infos["role"];
      }
    }
  }
}
