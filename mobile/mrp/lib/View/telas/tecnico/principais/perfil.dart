import 'package:flutter/material.dart';
import 'package:mrp/Controller/infos_usuario.dart';
import 'package:mrp/View/artefatos/cartoes/botao_logout.dart';
import 'package:mrp/View/artefatos/cartoes/cartao_listagem_perfil.dart';

class PerfilTecnico extends StatefulWidget {
  const PerfilTecnico({super.key});

  @override
  State<PerfilTecnico> createState() => _PerfilTecnicoState();
}

class _PerfilTecnicoState extends State<PerfilTecnico> {
  @override
  Widget build(BuildContext context) {
    double altura = MediaQuery.of(context).size.height;
    double largura = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Perfil",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.indigo,
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: CircleAvatar(
              radius: largura * 0.25,
              backgroundColor: Colors.white,
              //backgroundColor: Colors.grey[200], // Cor de fundo para o círculo
              child: ClipOval(
                //clipper: MyClipper(largura * 1),
                child: FittedBox(
                  fit: BoxFit.cover,
                  child: InfosUsuario.papel == "production-operator"
                      ? Image.asset("assets/images/operador.png")
                      : Image.asset("assets/images/estoque.png"),
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(8.0),
            child:
                CartaoListagemPerfil("Username:    ${InfosUsuario.username}"),
          ),
          Padding(
            padding: EdgeInsets.all(8.0),
            child: CartaoListagemPerfil("E-mail:    ${InfosUsuario.email}"),
          ),
          Padding(
            padding: EdgeInsets.all(8.0),
            child: CartaoListagemPerfil("Função:    Operador de Estoque"),
          ),
          SizedBox(
            height: altura * 0.1,
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: BotaoLogOut(),
          ),
        ],
      ),
    );
  }
}
