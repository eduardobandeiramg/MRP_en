import 'package:flutter/material.dart';

class EsqueciSenha extends StatelessWidget {
  final chave = GlobalKey<FormState>();

  EsqueciSenha({super.key});

  @override
  Widget build(BuildContext context) {
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(),
      body: SingleChildScrollView(
        child: Form(
          key: chave,
          child: Column(
            children: [
              SizedBox(
                height: altura * 0.01,
              ),
              Text(
                "Recuperar senha",
                style: TextStyle(fontSize: altura * 0.03),
              ),
              SizedBox(
                height: altura * 0.15,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextFormField(
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: "e-mail",
                  ),
                  //controller: controladorEmail,
                  validator: (valor) {
                    if (valor == null) {
                      return "Valor inválido!";
                    } else if (valor.isEmpty) {
                      return "digite um e-mail válido";
                    } else {
                      return null;
                    }
                  },
                ),
              ),
              SizedBox(
                height: altura * 0.18,
              ),
              ElevatedButton(
                onPressed: () {
                  chave.currentState!.validate();
                },
                child: Text(
                  "confirmar",
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
                style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(Colors.indigo),
                  minimumSize: WidgetStateProperty.all(
                    Size(largura * 0.4, altura * 0.047),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
