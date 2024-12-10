import 'package:flutter/material.dart';
import 'package:mrp/Controller/operador/production_plan.dart';
import 'package:mrp/View/telas/operador/detalhamento/detalhamento_pecas_produto.dart';

import '../tela_principal_operador.dart';

class TelaDetalhamentoProducao extends StatefulWidget {
  int qtd;
  String status;
  Map<String, dynamic> produto;
  List<dynamic> idsProducao;
  Map<String, dynamic> productionPlan;

  TelaDetalhamentoProducao(this.qtd, this.status, this.produto,
      this.idsProducao, this.productionPlan);

  @override
  State<TelaDetalhamentoProducao> createState() =>
      _TelaDetalhamentoProducaoState();
}

class _TelaDetalhamentoProducaoState extends State<TelaDetalhamentoProducao> {
  bool carregando = false;

  @override
  Widget build(BuildContext context) {
    print(widget.idsProducao);
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Detalhamento da produção",
          style: TextStyle(color: Colors.white),
        ),
        iconTheme: IconThemeData(color: Colors.white),
        backgroundColor: Colors.indigo,
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
                semanticsLabel: "Carregando",
              ),
            ),
          if (!carregando)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Produto: ${widget.produto["description"]}"),
                    SizedBox(
                      height: altura * 0.01,
                    ),
                    Text("Código: ${widget.produto["code"]}"),
                    SizedBox(
                      height: altura * 0.01,
                    ),
                    Text("Quantidade: ${widget.qtd}"),
                    SizedBox(
                      height: altura * 0.01,
                    ),
                    Text("Status: ${widget.status}"),
                    SizedBox(
                      height: altura * 0.1,
                    ),
                    if (widget.status == "a produzir")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) =>
                                      TelaDetalhamentoPecasProduto(
                                          widget.produto["id"],
                                          widget.idsProducao),
                                ),
                              );
                            },
                            child: Text(
                              "Visualizar peças",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "a produzir")
                      SizedBox(
                        height: altura * 0.06,
                      ),
                    if (widget.status == "a produzir")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () async {
                              setState(() {
                                carregando = true;
                              });
                              try {
                                await ProductionPlan.iniciarProducao(
                                    widget.idsProducao[0]);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content:
                                        Text("Produção iniciada com sucesso!"),
                                  ),
                                );
                                Navigator.of(context).pushReplacement(
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        TelaPrincipalOperador(0),
                                  ),
                                );
                              } catch (e) {
                                setState(() {
                                  carregando = false;
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Erro ao iniciar produção"),
                                  ),
                                );
                              }
                            },
                            child: Text(
                              "iniciar produção",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
/*                    if (widget.status == "a produzir")
                      Center(
                        child: ElevatedButton(
                          onPressed: () {},
                          child: Text(
                            "Solicitar peças",
                            style: TextStyle(color: Colors.white),
                          ),
                          style: ButtonStyle(
                            backgroundColor:
                                WidgetStatePropertyAll(Colors.indigo),
                          ),
                        ),
                      ),*/
                    if (widget.status == "aguardando peças")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () {},
                            child: Text(
                              "Visualizar pedido",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "aguardando peças")
                      SizedBox(
                        height: altura * 0.02,
                      ),
                    if (widget.status == "aguardando peças")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () {},
                            child: Text(
                              "Cancelar pedido",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "aguardando peças")
                      SizedBox(
                        height: altura * 0.02,
                      ),
                    if (widget.status == "aguardando peças")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () {},
                            child: Text(
                              "Confirmar recebimento das peças",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "aguardando peças")
                      SizedBox(
                        height: altura * 0.08,
                      ),
                    if (widget.status == "aguardando peças")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () async {
                              setState(() {
                                carregando = true;
                              });
                              try {
                                await ProductionPlan.retomarProducao(
                                    widget.idsProducao[0]);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content:
                                        Text("Produção retomada com sucesso!"),
                                  ),
                                );
                                Navigator.of(context).pushReplacement(
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        TelaPrincipalOperador(1),
                                  ),
                                );
                              } catch (e) {
                                setState(() {
                                  carregando = false;
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Erro ao iniciar produção"),
                                  ),
                                );
                              }
                            },
                            child: Text(
                              "Retomar Produção",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "em produção")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () async {
                              setState(() {
                                carregando = true;
                              });
                              try {
                                print(
                                    "mandando pausar a seguinte producao: ${widget.idsProducao[0]}");
                                await ProductionPlan.pausarProducao(
                                    widget.idsProducao[0]);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Produção pausada!"),
                                  ),
                                );
                                Navigator.of(context).pushReplacement(
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            TelaPrincipalOperador(1)));
                              } catch (e) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Erro ao pausar produção!"),
                                  ),
                                );
                                setState(() {
                                  carregando = false;
                                });
                              }
                            },
                            child: Text(
                              "Pausar produção",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "em produção")
                      SizedBox(
                        height: altura * 0.02,
                      ),
                    if (widget.status == "em produção")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () async {
                              setState(() {
                                carregando = true;
                              });
                              try {
                                await ProductionPlan.cancelarProducao(
                                    widget.idsProducao[0]);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content:
                                        Text("Produção cancelada com sucesso!"),
                                  ),
                                );
                                Navigator.of(context).pushReplacement(
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        TelaPrincipalOperador(1),
                                  ),
                                );
                              } catch (e) {
                                setState(() {
                                  carregando = false;
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Erro ao cancelar produção"),
                                  ),
                                );
                              }
                            },
                            child: Text(
                              "Cancelar produção",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "em produção")
                      SizedBox(
                        height: altura * 0.06,
                      ),
                    if (widget.status == "em produção")
                      Center(
                        child: SizedBox(
                          width: largura * 0.9,
                          child: ElevatedButton(
                            onPressed: () async {
                              setState(() {
                                carregando = true;
                              });
                              try {
                                await ProductionPlan.finalizarProducao(
                                    widget.idsProducao[0]);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                        "Produção finalizada com sucesso!"),
                                  ),
                                );
                                Navigator.of(context).pushReplacement(
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        TelaPrincipalOperador(1),
                                  ),
                                );
                              } catch (e) {
                                setState(() {
                                  carregando = false;
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Erro ao finalizar produção"),
                                  ),
                                );
                              }
                            },
                            child: Text(
                              "Finalizar produção",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStatePropertyAll(Colors.indigo),
                              shape: MaterialStateProperty.all(
                                RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero),
                              ),
                            ),
                          ),
                        ),
                      ),
                    if (widget.status == "produção pausada")
                      Center(
                        child: ElevatedButton(
                          onPressed: () {},
                          child: Text(
                            "Solicitar peças",
                            style: TextStyle(color: Colors.white),
                          ),
                          style: ButtonStyle(
                            backgroundColor:
                                WidgetStatePropertyAll(Colors.indigo),
                          ),
                        ),
                      ),
                    if (widget.status == "produção pausada")
                      Center(
                        child: ElevatedButton(
                          onPressed: () {},
                          child: Text(
                            "Continuar produção",
                            style: TextStyle(color: Colors.white),
                          ),
                          style: ButtonStyle(
                            backgroundColor:
                                WidgetStatePropertyAll(Colors.indigo),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
