import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mrp/Controller/token_app.dart';

class ProductionPlan {
  static dynamic getAProduzir() async {
    String urlGetAProduzir = "http://10.0.2.2:3000/production/to-production";
    http.Response resposta = await http.get(Uri.parse(urlGetAProduzir),
        headers: {"Authorization": TokenApp.tokenApp!});
    if (resposta.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
    } else {
      throw new Exception("erro-no-servidor");
    }
  }

  static dynamic getEmProducao() async {
    String urlGetAProduzir = "http://10.0.2.2:3000/production/on-production";
    http.Response resposta = await http.get(Uri.parse(urlGetAProduzir),
        headers: {"Authorization": TokenApp.tokenApp!});
    if (resposta.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
    } else {
      throw new Exception("erro-no-servidor");
    }
  }

  static dynamic getProductionPlan() async {
    String ulrGetProductionPlan = "http://10.0.2.2:3000/production/null-dates";
    http.Response resposta = await http.get(Uri.parse(ulrGetProductionPlan),
        headers: {"Authorization": TokenApp.tokenApp!});
    List<Map<String, dynamic>> productionPlan =
        List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
    if (resposta.statusCode == 200) {
      return productionPlan;
    } else {
      throw new Exception("erro");
    }
  }

  static Future<String> iniciarProducao(String id) async {
    String urlIniciarProducao = "http://10.0.2.2:3000/production/$id/start";
    var resposta = await http.patch(Uri.parse(urlIniciarProducao), headers: {
      "Authorization": TokenApp.tokenApp!,
      "Content-Type": "application/json"
    });
    await Future.delayed(
      Duration(seconds: 1),
    );
    if (resposta.statusCode == 200) {
      return "ok";
    } else {
      throw new Exception("erro");
    }
  }

  static Future<String> finalizarProducao(String id) async {
    String urlIniciarProducao = "http://10.0.2.2:3000/production/$id/end";
    var resposta = await http.patch(Uri.parse(urlIniciarProducao), headers: {
      "Authorization": TokenApp.tokenApp!,
      "Content-Type": "application/json"
    });
    await Future.delayed(
      Duration(seconds: 1),
    );

    if (resposta.statusCode == 200) {
      return "ok";
    } else {
      throw new Exception("erro");
    }
  }

  static Future<List<Map<String, dynamic>>> getProdutosFinalizados() async {
    String urlProdutosFinalizados =
        "http://10.0.2.2:3000/production/finished-production";
    http.Response resposta = await http.get(Uri.parse(urlProdutosFinalizados),
        headers: {"Authorization": TokenApp.tokenApp!});
    if (resposta.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
    } else {
      throw new Exception("erro");
    }
  }

  static solicitarPecas(String idDaProducao) async {
    String urlPausarProducao =
        "http://10.0.2.2:3000/production/stop-production";
    //http.Response resposta = await http.patch(Uri.parse(urlPausarProducao));
  }

  static retornaPecasProduto(String idProduto) async {
    String urlMateriaisProduto =
        "http://10.0.2.2:3000/build-of-materials/product/$idProduto";
    http.Response resposta = await http.get(Uri.parse(urlMateriaisProduto),
        headers: {"Authorization": TokenApp.tokenApp!});
    if (resposta.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(resposta.body));
    } else {
      throw new Exception("erro");
    }
  }

  static Future<String> pausarProducao(String idProducao) async {
    String stringExtra = "productionId=$idProducao";
    String urlPausarProducao =
        "http://10.0.2.2:3000/production/stop-production?$stringExtra";
    http.Response resposta = await http.patch(
      Uri.parse(urlPausarProducao),
      headers: {
        "Authorization": TokenApp.tokenApp!,
      },
    );
    if (resposta.statusCode == 200) {
      await Future.delayed(Duration(seconds: 1));
      return "ok";
    } else {
      throw new Exception("erro");
    }
  }

  static Future<String> retomarProducao(String idProducao) async {
    String stringExtra = "productionId=$idProducao";
    String urlRetomarProducao =
        "http://10.0.2.2:3000/production/reestart-production?$stringExtra";
    http.Response resposta = await http.patch(
      Uri.parse(urlRetomarProducao),
      headers: {
        "Authorization": TokenApp.tokenApp!,
      },
    );
    if (resposta.statusCode == 200) {
      await Future.delayed(Duration(seconds: 1));
      return "ok";
    } else {
      throw new Exception("erro");
    }
  }

  static Future<dynamic> cancelarProducao(String idProducao) async {
    String urlCancelarProducao =
        "http://10.0.2.2:3000/production/$idProducao/cancel";
    http.Response resposta = await http.patch(Uri.parse(urlCancelarProducao),
        headers: {"Authorization": TokenApp.tokenApp!});
    if (resposta.statusCode == 200) {
      await Future.delayed(Duration(seconds: 1));
      return "ok";
    } else {
      throw new Exception("erro");
    }
  }
}
