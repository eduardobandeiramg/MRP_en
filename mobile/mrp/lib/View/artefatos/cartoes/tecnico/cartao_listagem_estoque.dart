import 'package:flutter/material.dart';
import 'package:mrp/Controller/tecnico/materiais.dart';
import 'package:mrp/View/telas/tecnico/detalhamento/tela_detalhamento_peca_estoque.dart';

class CartaoItemEstoque extends StatelessWidget {
  String description;
  String code;
  int qtd;

  CartaoItemEstoque(this.description, this.code, this.qtd);

  @override
  Widget build(BuildContext context) {
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) =>
                  TelaDetalhamentoPecaEstoque(description, code, qtd),
            ),
          );
        },
        child: Container(
          height: altura * 0.1,
          decoration: BoxDecoration(
            color: Colors.grey,
            borderRadius: BorderRadius.all(
              Radius.circular(20),
            ),
          ),
          child: Row(
            children: [
              SizedBox(
                width: largura * 0.03,
              ),
              Expanded(
                flex: 1,
                child: Text("item: $description"),
              ),
              Expanded(
                flex: 1,
                child: Text("código: $code"),
              ),
              Expanded(
                flex: 1,
                child: Text("qtd: $qtd"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
