import 'package:flutter/material.dart';
import 'package:mrp/Controller/tecnico/materiais.dart';
import 'package:mrp/View/telas/tecnico/tela_principal_tecnico.dart';

class ModalDarSaida extends StatefulWidget {
  ModalDarSaida({super.key});

  @override
  State<ModalDarSaida> createState() => _ModalDarSaidaState();
}

class _ModalDarSaidaState extends State<ModalDarSaida> {
  final TextEditingController controladorCodigo = TextEditingController();
  final TextEditingController controladorQtd = TextEditingController();
  String valor = "Selecione o produto";
  Widget botao = Row(
    children: [],
  );
  List lista = [];
  List listaProdutos = [];

  @override
  void initState() {
    Materiais.buscaMateriais().then((valor) {
      setState(() {
        listaProdutos = valor;
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;
    return Center(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey,
          borderRadius: BorderRadius.all(Radius.circular(50)),
        ),
        height: altura * 0.7,
        width: largura * 0.8,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              height: altura * 0.05,
            ),
            Center(
              child: Padding(
                padding: EdgeInsets.all(16.0), // Margem ao redor do TextField
                child: Container(
                  width: largura * 0.4, // Largura fixa
                  height: altura * 0.08, // Altura fixa para ser quadrado
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.black, width: 2),
                    // Cor e espessura da borda
                    borderRadius: BorderRadius.zero, // Mantém borda quadrada
                  ),
                  child: TextField(
                    controller: controladorCodigo,
                    textAlign: TextAlign.center,
                    maxLength: 3,
                    decoration: InputDecoration(
                      border: InputBorder.none, // Remove a borda interna
                      hintText: 'Código do produto',
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(
              height: altura * 0.05,
            ),
            Center(
              child: Padding(
                padding: EdgeInsets.all(16.0), // Margem ao redor do TextField
                child: Container(
                  width: largura * 0.4, // Largura fixa
                  height: altura * 0.08, // Altura fixa para ser quadrado
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.black, width: 2),
                    // Cor e espessura da borda
                    borderRadius: BorderRadius.zero, // Mantém borda quadrada
                  ),
                  child: TextField(
                    controller: controladorQtd,
                    textAlign: TextAlign.center,
                    maxLength: 3,
                    decoration: InputDecoration(
                      border: InputBorder.none, // Remove a borda interna
                      hintText: 'Quantidade',
                    ),
                  ),
                ),
              ),
            ),
/*            ListTile(
              title: Text(valor),
              trailing: PopupMenuButton(onSelected: (selecionado) {
                setState(() {
                  valor = selecionado;
                });
              }, itemBuilder: (BuildContext context) {
                return [
                  PopupMenuItem(
                    child: Text("produto 1"),
                    value: "produto 1",
                  ),
                  PopupMenuItem(
                    child: Text("produto 2"),
                    value: "produto 2",
                  ),
                  PopupMenuItem(
                    child: Text("produto 3"),
                    value: "produto 3",
                  ),
                  PopupMenuItem(
                    child: Text("produto 4"),
                    value: "produto 4",
                  ),
                  PopupMenuItem(
                    child: Text("produto 5"),
                    value: "produto 5",
                  ),
                ];
              }),
            ),*/
            SizedBox(
              height: altura * 0.25,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {},
                  child: Icon(
                    Icons.cancel,
                    color: Colors.black,
                  ),
                  style: ButtonStyle(
                    backgroundColor: WidgetStatePropertyAll(Colors.red),
                  ),
                ),
                ElevatedButton(
                  onPressed: () async {
                    try {
                      int quantidade =
                          int.parse(controladorQtd.text.toString());
                      var resposta = await Materiais.tirarDoEstoque(
                          controladorCodigo.text, quantidade);
                      if (resposta == "ok") {
                        print("resposta é ok");
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (context) => TelaPrincipalTecnico(),
                          ),
                        );
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              "Estoque atualizado com sucesso!",
                              textAlign: TextAlign.center,
                            ),
                          ),
                        );
                      }
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("Erro ao atualizar estoque"),
                        ),
                      );
                    }
                  },
                  child: Icon(
                    Icons.check,
                    color: Colors.black,
                  ),
                  style: ButtonStyle(
                    backgroundColor: WidgetStatePropertyAll(Colors.green),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
