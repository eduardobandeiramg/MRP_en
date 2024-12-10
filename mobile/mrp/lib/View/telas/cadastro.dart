import 'package:flutter/material.dart';

class Cadastro extends StatelessWidget {
  final chave = GlobalKey<FormState>();
  TextEditingController controladorNome = TextEditingController();
  TextEditingController controladorEmail = TextEditingController();
  TextEditingController controladorSenha = TextEditingController();
  TextEditingController controladorSenha2 = TextEditingController();

  Cadastro({super.key});

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
                "Criar nova conta",
                style: TextStyle(fontSize: altura * 0.03),
              ),
              SizedBox(
                height: altura * 0.13,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextFormField(
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: "nome",
                  ),
                  controller: controladorNome,
                  validator: (valor) {
                    if (valor == null) {
                      return "Valor inválido!";
                    } else if (valor.isEmpty) {
                      return "valor vazio!";
                    } else {
                      return null;
                    }
                  },
                ),
              ),
              SizedBox(
                height: altura * 0.01,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextFormField(
                  obscureText: true,
                  textAlign: TextAlign.center,
                  controller: controladorEmail,
                  validator: (valor) {
                    if (valor == null) {
                      return "valor inválido!";
                    } else if (valor.isEmpty) {
                      return "valor vazio!";
                    } else {
                      return null;
                    }
                  },
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: "email",
                  ),
                ),
              ),
              SizedBox(
                height: altura * 0.01,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextFormField(
                  obscureText: true,
                  textAlign: TextAlign.center,
                  controller: controladorSenha,
                  validator: (valor) {
                    if (valor == null) {
                      return "valor inválido!";
                    } else if (valor.isEmpty) {
                      return "valor vazio!";
                    } else {
                      return null;
                    }
                  },
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: "senha",
                  ),
                ),
              ),
              SizedBox(
                height: altura * 0.01,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextFormField(
                  obscureText: true,
                  textAlign: TextAlign.center,
                  controller: controladorSenha2,
                  validator: (valor) {
                    if (valor == null) {
                      return "valor inválido!";
                    } else if (valor.isEmpty) {
                      return "valor vazio!";
                    } else {
                      return null;
                    }
                  },
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: "confirme a senha",
                  ),
                ),
              ),
              SizedBox(
                height: altura * 0.18,
              ),
              ElevatedButton(
                style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(Colors.indigo),
                  minimumSize: WidgetStateProperty.all(
                    Size(largura * 0.4, altura * 0.047),
                  ),
                ),
                onPressed: () {
                  chave.currentState!.validate();
                },
                child: Text(
                  "Criar conta",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
