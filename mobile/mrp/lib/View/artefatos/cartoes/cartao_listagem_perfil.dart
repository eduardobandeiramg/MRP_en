import 'package:flutter/material.dart';

class CartaoListagemPerfil extends StatelessWidget {
  String texto;

  CartaoListagemPerfil(this.texto, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: Colors.grey,
            width: 1,
          )),
      child: ListTile(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50),
        ),
        dense: true,
        title: Text(texto),
      ),
    );
  }
}
