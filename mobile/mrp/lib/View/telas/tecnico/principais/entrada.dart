import 'package:flutter/material.dart';
import 'package:mrp/View/artefatos/modais/tecnico/modal_dar_entrada.dart';

class Entrada extends StatefulWidget {
  const Entrada({super.key});

  @override
  State<Entrada> createState() => EntradaState();
}

class EntradaState extends State<Entrada> {
  bool mostraModal = false;
  bool carregando = false;

  Widget telaAMostrar() {
    if (mostraModal) {
      return ModalDarEntrada();
    } else if (carregando) {
      return Center(
        child: CircularProgressIndicator(
          semanticsLabel: "Carregando. Aguarde",
          color: Colors.orange,
        ),
      );
    } else {
      return Center(
        child: Text("Clique no botão para dar entrda"),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Histórico de Entradas",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.indigo,
        automaticallyImplyLeading: false,
      ),
      body: telaAMostrar(),
      /*mostraModal
          ? ModalProduto()
          : Center(
              child: Text("Clique no botão para dar entrada"),
            ),*/
      floatingActionButton: FloatingActionButton(
          child: Icon(
            Icons.add,
            color: Colors.white,
          ),
          backgroundColor: Colors.indigo,
          onPressed: () {
            setState(() {
              mostraModal ? mostraModal = false : mostraModal = true;
            });
          }),
    );
  }
}
