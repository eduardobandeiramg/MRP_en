import 'package:flutter/material.dart';
import 'package:mrp/View/artefatos/cartoes/tecnico/cartao_listagem_estoque.dart';
import '../../../../Controller/tecnico/materiais.dart';

encheCartoes() async {
  List<Map<String, dynamic>> listaEstoque = [];
  List<Widget> listaCartoes = [];
  listaEstoque = await Materiais.retornaEstoque();
  if (listaEstoque != []) {
    for (int a = 0; a < listaEstoque.length; a++) {
      listaCartoes.add(
        CartaoItemEstoque(listaEstoque[a]["description"],
            listaEstoque[a]["code"], listaEstoque[a]["qtd"]),
      );
    }
    return listaCartoes;
  } else {
    return [];
  }
}

class ListagemEstoque extends StatefulWidget {
  ListagemEstoque({super.key});

  @override
  State<ListagemEstoque> createState() => _ListagemEstoqueState();
}

class _ListagemEstoqueState extends State<ListagemEstoque> {
  List<Widget> listaCartoes = [];

  @override
  void initState() {
    encheCartoes().then((valor) {
      if (valor != null) {
        setState(() {
          listaCartoes = valor;
        });
      }
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Estoque",
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
