import 'package:flutter/material.dart';

class TelaDetalhamentoPecaEstoque extends StatelessWidget {
  String description;
  String code;
  int qtd;

  TelaDetalhamentoPecaEstoque(this.description, this.code, this.qtd,
      {super.key});

  @override
  Widget build(BuildContext context) {
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Detalhes da peça",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.indigo,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ListView(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text("Peça:    $description"),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text("Código:    $code"),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text("Quantidade:    $qtd"),
            ),
            SizedBox(
              height: altura * 0.1,
            ),
            SizedBox(
              width: largura * 0.9,
              child: ElevatedButton(
                onPressed: () {},
                child: Text(
                  "Reportar nível crítico",
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
                style: ButtonStyle(
                  backgroundColor: WidgetStatePropertyAll(Colors.indigo),
                  shape: MaterialStateProperty.all(
                    RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                  ),
                ),
              ),
            ),
            SizedBox(
              height: altura * 0.07,
            ),
            SizedBox(
              width: largura * 0.9,
              child: ElevatedButton(
                onPressed: () {},
                child: Text(
                  "Reportar problema com peça",
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
                style: ButtonStyle(
                  backgroundColor: WidgetStatePropertyAll(Colors.indigo),
                  shape: MaterialStateProperty.all(
                    RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
