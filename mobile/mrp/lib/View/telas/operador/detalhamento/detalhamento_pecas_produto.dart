import 'package:flutter/material.dart';
import 'package:mrp/Controller/operador/production_plan.dart';
import 'package:mrp/View/artefatos/cartoes/operador/cartao_listagem_pecas.dart';
import 'package:mrp/View/telas/operador/tela_principal_operador.dart';

/*bool retornaAlgumSelecionado(List<CartaoListagemPecas> listaDeTiles) {
  for (int a = 0; a < listaDeTiles.length; a++) {
    if (listaDeTiles[a].estaSelecionado == true) {
      return true;
    }
  }
  return false;
}*/

Future<List<CartaoListagemPecas>> encheLista(String idProduto) async {
  List<CartaoListagemPecas> listaListTiles = [];
  List<Map<String, dynamic>> materiais =
      await ProductionPlan.retornaPecasProduto(idProduto);
  if (materiais != null && materiais.isNotEmpty) {
    for (var a = 0; a < materiais.length; a++) {
      listaListTiles.add(CartaoListagemPecas(
          materiais[a]["material"]["id"],
          materiais[a]["material"]["description"],
          materiais[a]["material"]["code"],
          materiais[a]["qtd"]));
    }
    return listaListTiles;
  } else {
    throw new Exception("erro-ao-encher-lista-pecas");
  }
}

class TelaDetalhamentoPecasProduto extends StatefulWidget {
  String idProduto;
  List<dynamic> idsProducao;

  TelaDetalhamentoPecasProduto(this.idProduto, this.idsProducao);

  @override
  State<TelaDetalhamentoPecasProduto> createState() =>
      _TelaDetalhamentoPecasProdutoState();
}

class _TelaDetalhamentoPecasProdutoState
    extends State<TelaDetalhamentoPecasProduto> {
  List<CartaoListagemPecas> listaDeTiles = [];
  bool carregando = false;

  @override
  void initState() {
    encheLista(widget.idProduto).then((valor) {
      setState(() {
        listaDeTiles = valor;
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Peças Necessárias",
          style: TextStyle(color: Colors.white),
        ),
        iconTheme: IconThemeData(color: Colors.white),
        backgroundColor: Colors.indigo,
        actions: [],
      ),
      body: Stack(
        children: [
          if (carregando)
            ModalBarrier(
              color: Colors.black.withOpacity(0.5),
            ),
          if (carregando)
            Center(
              child: CircularProgressIndicator(
                color: Colors.orange,
                semanticsLabel: "Carregando. Aguarde",
              ),
            ),
          if (!carregando)
            SingleChildScrollView(
              child: Column(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                    ),
                    height: altura * 0.5,
                    child: ListView(children: listaDeTiles),
                  ),
                  SizedBox(
                    height: altura * 0.02,
                  ),
                  SizedBox(
                    width: largura * 0.9,
                    child: ElevatedButton(
                      onPressed: () {},
                      child: Text(
                        "Relatar problema com peças selecionadas",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                      style: ButtonStyle(
                        backgroundColor: WidgetStatePropertyAll(Colors.indigo),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                              borderRadius: BorderRadius.zero),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    height: altura * 0.02,
                  ),
                  SizedBox(
                    width: largura * 0.9,
                    child: ElevatedButton(
                      onPressed: () {},
                      child: Text(
                        "Sinalizar peças não selecionadas como faltantes",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                      style: ButtonStyle(
                        backgroundColor: WidgetStatePropertyAll(Colors.indigo),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                              borderRadius: BorderRadius.zero),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    height: altura * 0.1,
                  ),
                  SizedBox(
                    width: largura * 0.9,
                    child: ElevatedButton(
                      onPressed: () async {
                        bool podeProduzir = true;
                        for (CartaoListagemPecas cartao in listaDeTiles) {
                          if (cartao.estaSelecionado == false) {
                            podeProduzir = false;
                            break;
                          }
                        }
                        if (podeProduzir) {
                          setState(() {
                            carregando = true;
                          });
                          try {
                            await ProductionPlan.iniciarProducao(
                                widget.idsProducao[0]);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text("Produção iniciada com sucesso!"),
                              ),
                            );
                            Navigator.of(context).pushReplacement(
                              MaterialPageRoute(
                                builder: (context) => TelaPrincipalOperador(0),
                              ),
                            );
                          } catch (e) {
                            setState(() {
                              carregando = false;
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text("Erro: ${e.toString()}"),
                              ),
                            );
                          }
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                  "Não podem haver peças faltantes para iniciar a produção!"),
                            ),
                          );
                        }
                      },
                      child: Text(
                        "Iniciar produção",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                      style: ButtonStyle(
                        backgroundColor: WidgetStatePropertyAll(Colors.indigo),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                              borderRadius: BorderRadius.zero),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
