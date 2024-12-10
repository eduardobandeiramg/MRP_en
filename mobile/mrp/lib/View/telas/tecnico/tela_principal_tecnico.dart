import 'package:flutter/material.dart';
import 'package:mrp/View/telas/tecnico/principais/baixa.dart';
import 'package:mrp/View/telas/tecnico/principais/entrada.dart';
import 'package:mrp/View/telas/tecnico/principais/lista_estoque.dart';
import 'package:mrp/View/telas/tecnico/principais/perfil.dart';

class TelaPrincipalTecnico extends StatefulWidget {
  TelaPrincipalTecnico({super.key});

  @override
  State<TelaPrincipalTecnico> createState() => _TelaPrincipalTecnicoState();
}

class _TelaPrincipalTecnicoState extends State<TelaPrincipalTecnico> {
  int indexBarraNavegacao = 0;

  void aoSelecionarOIndex(int index) {
    setState(() {
      indexBarraNavegacao = index;
    });
  }

  telaAMoatrar(int indice) {
    if (indice == 0) {
      return ListagemEstoque();
    } else if (indice == 1) {
      return Entrada();
    } else if (indice == 2) {
      return Baixa();
    } else if (indice == 3) {
      return PerfilTecnico();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: telaAMoatrar(indexBarraNavegacao),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.list), label: "lista"),
          BottomNavigationBarItem(
              icon: Icon(Icons.fire_truck), label: "dar entrada"),
          BottomNavigationBarItem(
              icon: Icon(Icons.send_sharp), label: "dar baixa"),
          BottomNavigationBarItem(
              icon: Icon(Icons.person_2_rounded), label: "perfil"),
        ],
        currentIndex: indexBarraNavegacao,
        onTap: aoSelecionarOIndex,
        backgroundColor: Colors.black,
        unselectedItemColor: Colors.white,
        selectedItemColor: Colors.red,
      ),
    );
  }
}
