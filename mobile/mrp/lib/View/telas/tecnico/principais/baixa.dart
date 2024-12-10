import 'package:flutter/material.dart';
import 'package:mrp/View/artefatos/modais/tecnico/modal_dar_saida.dart';

class Baixa extends StatefulWidget {
  const Baixa({super.key});

  @override
  State<Baixa> createState() => BaixaState();
}

class BaixaState extends State<Baixa> {
  bool mostraModal = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Histórico de Saídas",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.indigo,
        automaticallyImplyLeading: false,
      ),
      body: mostraModal
          ? ModalDarSaida()
          : Center(
              child: Text("Clique no botão para dar baixa"),
            ),
      floatingActionButton: FloatingActionButton(
          backgroundColor: Colors.indigo,
          child: Icon(
            Icons.send_sharp,
            color: Colors.white,
          ),
          onPressed: () {
            setState(() {
              mostraModal ? mostraModal = false : mostraModal = true;
            });
          }),
    );
  }
}
