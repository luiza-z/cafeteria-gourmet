package senai499.com.br.cafeteriagourmet.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProdutosController {

    @GetMapping("/produtos")
    public String pedidos() {
        return "produtos/produtos";
    }
}