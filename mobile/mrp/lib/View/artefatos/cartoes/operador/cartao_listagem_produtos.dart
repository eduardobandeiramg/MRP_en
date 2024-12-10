import 'package:flutter/material.dart';
import 'package:mrp/View/telas/operador/detalhamento/detalhamento_producao.dart';

class CartaoListagemProducao extends StatelessWidget {
  int qtd;
  String status;
  Map<String, dynamic> produto;
  List<dynamic> idsProducao;
  Map<String, dynamic> productionPlan;

  CartaoListagemProducao(this.qtd, this.status, this.produto, this.idsProducao,
      this.productionPlan);

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
              builder: (context) => TelaDetalhamentoProducao(
                  qtd, status, produto, idsProducao, productionPlan),
            ),
          );
        },
        child: Container(
          height: altura * 0.18,
          decoration: BoxDecoration(
            color: Colors.grey,
            borderRadius: BorderRadius.all(
              Radius.circular(20),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: largura * 0.03,
                ),
                Expanded(
                  flex: 1,
                  child: Text("Item: ${produto["description"]}"),
                ),
                Expanded(
                  flex: 1,
                  child: Text("Código: ${produto["code"]}"),
                ),
/*                Expanded(
                  flex: 1,
                  child: Text("status: $status"),
                ),*/
                if (productionPlan["datePrev"] != null)
                  Expanded(
                    flex: 1,
                    child:
                        Text("Data da produção: ${productionPlan["datePrev"]}"),
                  ),
                Expanded(
                  flex: 1,
                  child: Text("Quantidade: $qtd"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
