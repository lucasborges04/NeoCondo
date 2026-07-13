package backend.controller;

import backend.model.Bloco;
import backend.repository.BlocoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blocos")
public class BlocoController {

    private final BlocoRepository blocoRepository;

    public BlocoController(BlocoRepository blocoRepository) {
        this.blocoRepository = blocoRepository;
    }

    @GetMapping
    public List<Bloco> listarTodos() {
        return blocoRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Bloco criarNovoBloco(@RequestBody Bloco bloco) {
        return blocoRepository.save(bloco);
    }
}
