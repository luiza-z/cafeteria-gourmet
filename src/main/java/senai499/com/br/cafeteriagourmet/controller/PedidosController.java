package senai499.com.br.cafeteriagourmet.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pedidos")
public class PedidosController {

    @GetMapping
    public String pedidos() {
        return "pedidos/pedidos";
    }
}