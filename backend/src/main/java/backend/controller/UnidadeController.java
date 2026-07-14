package backend.controller;

import backend.model.Unidade;
import backend.repository.UnidadeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades")
public class UnidadeController {

    private final UnidadeRepository unidadeRepository;

    public UnidadeController(UnidadeRepository unidadeRepository) {
        this.unidadeRepository = unidadeRepository;
    }

    @GetMapping
    public List<Unidade> listarTodas() {
        return unidadeRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Unidade criarNovaUnidade(@RequestBody Unidade unidade) {
        return unidadeRepository.save(unidade);
    }
}