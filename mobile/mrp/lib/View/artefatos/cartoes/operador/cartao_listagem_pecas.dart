import 'package:flutter/material.dart';

class CartaoListagemPecas extends StatefulWidget {
  String idMaterial;
  String nomeMaterial;
  String codigoMaterial;
  int qtdMaterial;
  bool? estaSelecionado = false;

  CartaoListagemPecas(
      this.idMaterial, this.nomeMaterial, this.codigoMaterial, this.qtdMaterial,
      {super.key});

  @override
  State<CartaoListagemPecas> createState() => _CartaoListagemPecasState();
}

class _CartaoListagemPecasState extends State<CartaoListagemPecas> {
  bool selecionado = false;

  @override
  Widget build(BuildContext context) {
    return CheckboxListTile(
        title: Text(widget.nomeMaterial),
        subtitle: Text(widget.qtdMaterial.toString()),
        value: selecionado,
        onChanged: (bool? valor) {
          setState(() {
            selecionado = valor!;
            widget.estaSelecionado = valor!;
          });
        });
  }
}
