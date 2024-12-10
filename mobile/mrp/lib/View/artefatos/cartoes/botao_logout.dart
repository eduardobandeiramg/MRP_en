import 'package:flutter/material.dart';
import 'package:mrp/View/telas/login.dart';

class BotaoLogOut extends StatelessWidget {
  const BotaoLogOut({super.key});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => Login()),
        );
      },
      child: Container(
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
          title: Text("Fazer logout"),
          trailing: Icon(Icons.logout),
        ),
      ),
    );
  }
}
