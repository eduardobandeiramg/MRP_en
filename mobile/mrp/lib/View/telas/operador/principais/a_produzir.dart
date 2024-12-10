import 'package:flutter/material.dart';
import 'package:mrp/Controller/operador/production_plan.dart';
import 'package:mrp/View/artefatos/cartoes/operador/cartao_listagem_produtos.dart';

Future<List<Widget>> encheLista() async {
  try {
    List<Map<String, dynamic>> productionPlan =
        await ProductionPlan.getAProduzir();
    List<CartaoListagemProducao> listaCartoes = [];
    if (productionPlan.isNotEmpty) {
      for (var a = 0; a < productionPlan.length; a++) {
        listaCartoes.add(
          CartaoListagemProducao(
              productionPlan[a]["qtd"],
              productionPlan[a]["status"],
              productionPlan[a]["product"],
              productionPlan[a]["productionIds"],
              productionPlan[a]["productionPlan"]),
        );
      }
      return listaCartoes;
    } else {
      throw new Exception("lista-vazia");
    }
  } catch (e) {
    return [];
  }
}

class AProduzir extends StatefulWidget {
  AProduzir({super.key});

  @override
  State<AProduzir> createState() => _AProduzirState();
}

class _AProduzirState extends State<AProduzir> {
  List<Widget> listaCartoes = [];

  @override
  void initState() {
    encheLista().then((valor) {
      setState(() {
        listaCartoes = valor;
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    ProductionPlan.getProductionPlan();
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "A Produzir",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.indigo,
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        children: listaCartoes,
      ),
    );
  }
}
