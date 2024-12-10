import 'package:flutter/material.dart';
import 'package:mrp/View/artefatos/cartoes/operador/cartao_listagem_produtos.dart';
import '../../../../Controller/operador/production_plan.dart';

encheLista() async {
  try {
    List<Map<String, dynamic>> emProducao =
        await ProductionPlan.getEmProducao();
    List<Widget> listaCartoes = [];
    if (emProducao.isNotEmpty) {
      for (var a = 0; a < emProducao.length; a++) {
        listaCartoes.add(
          CartaoListagemProducao(
              emProducao[a]["qtd"],
              emProducao[a]["status"],
              emProducao[a]["product"],
              emProducao[a]["productionIds"],
              emProducao[a]["productionPlan"]),
        );
      }
      return listaCartoes;
    }
  } catch (e) {
    return null;
  }
}

class LinhaProducao extends StatefulWidget {
  const LinhaProducao({super.key});

  @override
  State<LinhaProducao> createState() => _LinhaProducaoState();
}

class _LinhaProducaoState extends State<LinhaProducao> {
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
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Linha de produção",
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
