import 'package:http/http.dart' as http;
import 'package:mrp/Controller/token_app.dart';
import 'dart:convert';

class Materiais {
  static Future<List<Map<String, dynamic>>> buscaMateriais() async {
    String urlMateriais = "http://10.0.2.2:3000/materials";
    var resposta = await http.get(Uri.parse(urlMateriais),
        headers: {"Authorization": TokenApp.tokenApp!});
    List<Map<String, dynamic>> lista =
        List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
    return lista;
  }

  static retornaEstoque() async {
    String urlEstoque = "http://10.0.2.2:3000/materials";
    var resposta = await http.get(Uri.parse(urlEstoque),
        headers: {"Authorization": TokenApp.tokenApp!});
    if (resposta.statusCode == 200) {
      List<Map<String, dynamic>> estoque =
          List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
      return estoque;
    } else {
      throw new Exception("erro-no-servidor");
    }
  }

  static adicionarAoEstoque(String codigo, int qtd) async {
    String urlAddEstoque = "http://10.0.2.2:3000/materials/stock/add";
    List<Map<String, dynamic>> listaMateriais = await buscaMateriais();
    if (listaMateriais.any((element) => element["code"] == codigo)) {
      Map<String, dynamic> mapaProduto =
          listaMateriais.firstWhere((mapa) => mapa["code"] == codigo);
      var resposta = await http.patch(Uri.parse(urlAddEstoque),
          headers: {
            "Authorization": TokenApp.tokenApp!,
            "Content-Type": "application/json"
          },
          body: jsonEncode({"id": mapaProduto["id"], "qtd": qtd}));
      if (resposta.statusCode == 204) {
        return "ok";
      } else {
        throw new Exception("erro-no-servidor");
      }
    } else {
      throw new Exception("codigo-inexistente");
    }
  }

  static Future<String> tirarDoEstoque(String codigo, int qtdARetirar) async {
    String urlAtualizarEstoque = "http://10.0.2.2:3000/materials/stock/update";
    List<Map<String, dynamic>> listaMateriais = await buscaMateriais();
    if (listaMateriais.any((element) => element["code"] == codigo)) {
      Map<String, dynamic> mapaProduto =
          listaMateriais.firstWhere((mapa) => mapa["code"] == codigo);
      int quantidadeAtual = mapaProduto["qtd"];
      int novaQuantidade = quantidadeAtual - qtdARetirar;
      http.Response respostaAtualizarEstoque = await http.patch(
        Uri.parse(urlAtualizarEstoque),
        headers: {
          "Authorization": TokenApp.tokenApp!,
          "Content-Type": "application/json"
        },
        body: jsonEncode({"id": mapaProduto["id"], "qtd": novaQuantidade}),
      );
      if (respostaAtualizarEstoque.statusCode == 204) {
        print("atualizacao deu certo!");
        return "ok";
      } else {
        print("atualizacao deu errado");
        throw new Exception("erro-ao-atualizar-estoque");
      }
    } else {
      throw new Exception("erro-ao-atualizar-estoque");
    }
  }
}
