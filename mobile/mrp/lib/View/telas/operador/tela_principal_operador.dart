import 'package:flutter/material.dart';
import 'package:mrp/View/telas/operador/principais/a_produzir.dart';
import 'package:mrp/View/telas/operador/principais/finalizado.dart';
import 'package:mrp/View/telas/operador/principais/linha.dart';
import 'package:mrp/View/telas/operador/principais/perfil.dart';

class TelaPrincipalOperador extends StatefulWidget {
  int indice;

  TelaPrincipalOperador(this.indice, {super.key});

  @override
  State<TelaPrincipalOperador> createState() => _TelaPrincipalOperadorState();
}

class _TelaPrincipalOperadorState extends State<TelaPrincipalOperador> {
  void aoSelecionarOIndex(int index) {
    setState(() {
      widget.indice = index;
    });
  }

  telaAMoatrar(int indice) {
    if (indice == 0) {
      return AProduzir();
    } else if (indice == 1) {
      return LinhaProducao();
    } else if (indice == 2) {
      return Finalizado();
    } else if (indice == 3) {
      return PerfilOperador();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: telaAMoatrar(widget.indice),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.build), label: "a produzir"),
          BottomNavigationBarItem(
              icon: Icon(Icons.conveyor_belt), label: "linha"),
          BottomNavigationBarItem(
              icon: Icon(Icons.check_box), label: "finalizado"),
/*          BottomNavigationBarItem(
              icon: Icon(Icons.fire_truck), label: "dar entrada"),
          BottomNavigationBarItem(
              icon: Icon(Icons.send_sharp), label: "dar baixa"),*/
          BottomNavigationBarItem(
              icon: Icon(Icons.person_2_rounded), label: "perfil"),
        ],
        currentIndex: widget.indice,
        onTap: aoSelecionarOIndex,
        backgroundColor: Colors.black,
        unselectedItemColor: Colors.white,
        selectedItemColor: Colors.red,
      ),
    );
  }
}
